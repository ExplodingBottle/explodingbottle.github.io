class UpdatePackage {
    constructor(id, path, currentVersion, displayName, latestVersion, updateRequired) {
        this.id = id;
        this.path = path;
        this.currentVersion = currentVersion;
        this.displayName = displayName;
        this.latestVersion = latestVersion;
        this.updateRequired = updateRequired;
    }
}
