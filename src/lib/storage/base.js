function buildStoreObject(d) {
    const data = {
        versions: d.versions,
        currentVersion: d.maxVersion,
        id: d.storageString,
    }

    function update(obj) {
        if (!obj)
            throw new Error("object to update is not an object");

        // repeat until object fully updated
        if (obj["--version"] === undefined)
            obj["--version"] = 0;
        while (obj["--version"] !== this.currentVersion) {
            // get version
            let version = obj["--version"] || 0;
            if (version.constructor !== Number || version < 0)
                version = -42; // invalid on purpose so it will reset
            else {
                version = (version+1).toString()
            }
            console.log(this, version);
            
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
    }

    function get() {
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
        
        // add instance helpers
        Object.entries(d.instanceHelpers).forEach(([name, helper]) => {
            if (data[name] !== undefined)
                throw new Error(`helper name: ${name} on instance of store ${this.id} is reserved`)
            data[name] = helper.bind(data);
        })

        // return data
        return data;
    }

    // add functions to store
    data.get = get.bind(data);
    data.update = update.bind(data);

    // add static helpers
    Object.entries(d.staticHelpers).forEach(([name, helper]) => {
        if (data[name] !== undefined)
            throw new Error(`helper name: ${name} on store ${data.id} is reserved`)
        data[name] = helper.bind({});
    })

    return data;
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
            instanceHelpers: {},
            staticHelpers: {},
        },

        /*
         * set key of localstorage item, must be unique
        */
        setKey(str) {
            this._data.storageString = str;
            return this;
        },

        /*
         * add a version to the store
         *
         * version: version number
         * migrate: function to update from previous version to this version
         * create: function to return an empty storage item from this version (in correct syntax)
        */
        addVersion({ version, migrate, create }) {
            // input checking
            if (version < 0)
                throw new Error("Cannot add version below 0 in store");
            if (version > 0 && !migrate)
                throw new Error(`Missing migration on version ${version} (needed for any version above 0)`);

            // update max version list
            if (version > this._data.maxVersion)
                this._data.maxVersion = version;
            // add to version list
            this._data.versionList.push(version);


            // register version
            this._data.versions[version.toString()] = {
                version: version, // version number
                update: migrate ? (data) => { // update function, and increment version
                    migrate(data);
                    data["--version"] = version;
                    return data;
                } : null,
                init: create ? () => { // return an initial object
                    const data = create();
                    data["--version"] = version;
                    return data;
                } : null
            }
            return this;
        },

        /*
         * register a instance or static helper to the store 
         *
         * name: name of the helper function
         * helper: function to execute, the 'this' context is the current storage item (type is instance)
         * type: "instance" or "static". instance is put on the storage item when you store.get() it, static is on the store
        */
        registerHelper({ name, helper, type }) {
            // type
            if (!type)
                type = "instance"

            // input checking
            if (!name || name.constructor !== String) {
                throw new Error("helper name is not a string")
            }
            if (!helper || helper.constructor !== Function) {
                throw new Error("helper function is not a function")
            }
            if (!["instance", "static"].includes(type)) {
                throw new Error("helper type must be either 'instance' or 'static'")
            }

            // register helper
            if (type === "instance")
                this._data.instanceHelpers[name] = helper
            else if (type === "static")
                this._data.staticHelpers[name] = helper

            return this;
        },

        /*
         * returns function store based on what has been set
        */
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

            // max version must have init function
            if (!this._data.versions[this._data.maxVersion.toString()].init)
                throw new Error(`Missing create function on version ${this._data.maxVersion} (needed for latest version of store)`);

            // check storage string
            if (!this._data.storageString)
                throw new Error("storage key not set in store");

            // build versioned store
            return buildStoreObject(this._data);
        }
    }
}
