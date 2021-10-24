function buildStoreObject(data) {
    return {
        versions: data.versions,
        currentVersion: data.maxVersion,
        id: data.storageString,
        update(obj) {
            if (!obj)
                throw new Error("object to update is not an object");

            // repeat until object fully updated
            while (obj["--version"] !== this.currentVersion) {
                // get version
                let version = obj["--version"] || 0;
                if (version === undefined || version.constructor !== Number)
                    version = -42; // invalid on purpose so it will reset
                else {
                    version = (version+1).toString()
                }

                // check if version exists
                if (!this.versions[version]) {
                    console.error(`Version not found for storage item in store ${this.id}, resetting`);
                    obj = null;
                    break;
                }

                // update object
                obj = this.versions[version].update(obj);
                console.log(obj);
            }

            // if resulting obj is null, use latest version as init object
            if (obj === null) {
                console.error(`Storage item for store ${this.id} has been reset due to faulty updates`);
                return this.versions[this.currentVersion.toString()].init();
            }

            // updates succesful, return
            return obj;
        },
        get() {
            // get from storage api
            const store = this;
            let data = localStorage.getItem(this.id);

            // parse json if item exists
            if (data) {
                try {
                    data = JSON.parse(data);
                    if (!data.constructor) {
                        console.error(`Storage item for store ${this.id} has not constructor`)
                        throw new Error("storage item has no constructor")
                    }
                    if (data.constructor !== Object) {
                        console.error(`Storage item for store ${this.id} is not an object`)
                        throw new Error("storage item is not an object")
                    }
                } catch (_) {
                    // if errored, set to null so it generates new one, see below
                    console.error(`Failed to parse storage item for store ${this.id}`)
                    data = null;
                }
            }

            // if item doesnt exist, generate from version init
            if (!data) {
                data = this.versions[this.currentVersion.toString()].init();
            }

            // update the data if needed
            data = this.update(data);

            // add a save object to return value
            data.save = function save() {
                localStorage.setItem(store.id, JSON.stringify(data));
            }

            // return data
            return data;
        }
    }
}

/*
 * Builds a versioned store
 *
 * manages versioning of localstorage items
*/
export function versionedStoreBuilder() {
    return {
        _data: {
            versionList: [],
            maxVersion: 0,
            versions: {},
            storageString: null,
        },
        setKey(str) {
            this._data.storageString = str;
            return this;
        },
        addVersion(num, updateFunc, initFunc) {
            // update max version list
            if (num > this._data.maxVersion)
                this._data.maxVersion = num;
            // add to version list
            this._data.versionList.push(num);

            // register version
            this._data.versions[num.toString()] = {
                version: num, // version number
                update: (data) => { // update function, and increment version
                    updateFunc(data);
                    data["--version"] = num;
                    return data;
                },
                init: () => { // return an initial object
                    const data = initFunc();
                    data["--version"] = num;
                    return data;
                }
            }
            return this;
        },
        build() {
            // check if version list doesnt skip versions
            const versionListSorted = this._data.versionList.sort((a,b)=>a-b);
            versionListSorted.forEach((v, i, arr) => {
                if (i === 0)
                    return;
                if (v !== arr[i-1]+1)
                    throw new Error("Version list of store is not incremental");
            })

            // version zero must exist
            if (versionListSorted[0] !== 0)
                throw new Error("Version 0 doesn't exist in version list of store");

            // check storage string
            if (!this._data.storageString)
                throw new Error("storage key not set in store");

            // build versioned store
            return buildStoreObject(this._data);
        }
    }
}
