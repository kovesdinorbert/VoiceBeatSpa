export class VersionService  {
    setCurrentVersionNumber(cversion: String|undefined) {
        if (cversion) {
            localStorage.setItem('currentVersion', cversion.toString());
        }else {
            localStorage.setItem('currentVersion', "unknown");
        }
    }

    getCurrentVersionNumber(): String | null {
        let v = localStorage.getItem('currentVersion');

        if (v) {
            return v;
        } else {
            this.setCurrentVersionNumber(undefined);
            return localStorage.getItem('currentVersion');
        }
    }

    async getServerVersion() {
        fetch(process.env.REACT_APP_API_PATH+'/version')
          .then((res) => {
            if (res.ok) {
                res.text().then(r => this.checkVersion(r));
                }
            }
        );
    }

    checkVersion(serverVersion: String) {
        if (!this.getCurrentVersionNumber() || this.getCurrentVersionNumber()?.toString() !== serverVersion.toString()) {
            this.setCurrentVersionNumber(serverVersion)
            window.location.reload(true);
        }
    }
}