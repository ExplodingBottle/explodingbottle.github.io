var jsDisplay;
var chkUpds;
var instUpds;

var lastPackagesList;

var toUpd = [];

function dispError(id) {
    jsDisplay.innerHTML = "An error occured. Error code: " + id;
}

function chkBoxUpd(id) {
    var found = toUpd.indexOf(id);
    if (found == -1) {
        toUpd.push(id);
    } else {
        toUpd.splice(found, 1);
    }
    if (toUpd.length > 0) {
        instUpds.disabled = false;
    } else {
        instUpds.disabled = true;
    }
}

function loopInstallChecking() {
    function checking(status) {
        if (status == RETRY_NON_FATAL) {
            loopInstallChecking();
        } else if (status == NO_ERROR) {
            jsDisplay.innerHTML = "All the selected updates were installed !";
        } else {
            dispError(status);
        }
    }
    asyncFetchInstallResults(checking);
}

function installUpdates(status) {
    if (status != NO_ERROR) {
        dispError(status);
    } else {
        loopInstallChecking();
    }
}

function retreiveUpdates(status, packages) {
    if (status != NO_ERROR) {
        dispError(status);
    } else {
        lastPackagesList = packages;
        var bmsg = "Here is the list of programs and updates: <br><br>";
        packages.forEach((package) => {
            bmsg += "<input type='checkbox'";
            if (!package.updateRequired) {
                bmsg += " disabled";
            }
            bmsg += " onchange='chkBoxUpd(" + package.id + ");'>";
            bmsg += package.displayName + " - Current version: " + package.currentVersion + "<br>";
            bmsg += "Latest version: " + package.currentVersion + "<br>";
            bmsg += "Found at: " + package.path + "<br>";
            bmsg += "<br>";
        });
        bmsg += "<br><br>";
        bmsg += "<button id='install' disabled>Install updates</button>";
        jsDisplay.innerHTML = bmsg;
        instUpds = document.getElementById("install");
        instUpds.onclick = () => {
            jsDisplay.innerHTML = "Downloading and installing the selected updates...";
            asyncInstallUpdates(installUpdates, toUpd)
        };
    }
}

function loopUpdateChecking() {
    function checking(status) {
        if (status == RETRY_NON_FATAL) {
            loopUpdateChecking();
        } else if (status == NO_ERROR) {
            asyncReceiveUpdates(retreiveUpdates);
        } else {
            dispError(status);
        }
    }
    asyncCheckUpdating(checking);
}

function onCheckUpdate(status) {
    if (status != NO_ERROR) {
        dispError(status);
    } else {
        loopUpdateChecking();
    }
}

function onPingEnd(status) {
    if (status != NO_ERROR) {
        if (status == PING_CON_ERROR || status == PING_CON_TIMEOUT) {
            jsDisplay.innerHTML = "It seems like the ExplodingAU client is not installed Please download it <a href=''>here</a>.<br>Error code: " + status;
        } else {
            dispError(status);
        }
    } else {
        jsDisplay.innerHTML = "Welcome to ExplodingAU Update Website !<br>";
        jsDisplay.innerHTML += "<button id='chkUpds'>Check for updates now</button>";
        chkUpds = document.getElementById("chkUpds");
        chkUpds.onclick = () => {
            jsDisplay.innerHTML = "Checking for updates...";
            asyncCheckForUpdates(onCheckUpdate);
        };
    }
}

window.onload = () => {
    jsDisplay = document.getElementById("jsDisp");
    jsDisplay.innerHTML = "Checking that ExplodingAU component is installed...";
    asyncPingAgent(onPingEnd);
};