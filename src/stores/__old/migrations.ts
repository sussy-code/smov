interface StoreVersion<A> {
  version: number;
  migrate?(data: A): any;
  create?: () => A;
}
interface StoreRet<T> {
  save: (data: T) => void;
  get: () => T;
  _raw: () => any;
  onChange: (cb: (data: T) => void) => {
    destroy: () => void;
  };
}

export interface StoreBuilder<T> {
  setKey: (key: string) => StoreBuilder<T>;
  addVersion: <A>(ver: StoreVersion<A>) => StoreBuilder<T>;
  build: () => StoreRet<T>;
}

interface InternalStoreData {
  versions: StoreVersion<any>[];
  key: string | null;
}

const storeCallbacks: Record<string, ((data: any) => void)[]> = {};
const stores: Record<string, [StoreRet<any>, InternalStoreData]> = {};

export async function initializeOldStores() {
  // migrate all stores
  for (const [store, internal] of Object.values(stores)) {
    const versions = internal.versions.sort((a, b) => a.version - b.version);

    const data = store._raw();
    const dataVersion =
      data["--version"] && typeof data["--version"] === "number"
        ? data["--version"]
        : 0;

    // Find which versions need to be used for migrations
    const relevantVersions = versions.filter((v) => v.version >= dataVersion);

    // Migrate over each version
    let mostRecentData = data;
    try {
      for (const version of relevantVersions) {
        if (version.migrate) {
          localStorage.setItem(
            `BACKUP-v${version.version}-${internal.key}`,
            JSON.stringify(mostRecentData),
          );
          mostRecentData = await version.migrate(mostRecentData);
        }
      }
    } catch (err) {
      console.error(`FAILED TO MIGRATE STORE ${internal.key}`, err);
      // reset store to lastest version create
      mostRecentData =
        relevantVersions[relevantVersions.length - 1].create?.() ?? {};
    }

    store.save(mostRecentData);
  }
}

function buildStorageObject<T>(store: InternalStoreData): StoreRet<T> {
  const key = store.key ?? "";
  const latestVersion = store.versions.sort((a, b) => b.version - a.version)[0];

  function onChange(cb: (data: T) => void) {
    if (!storeCallbacks[key]) storeCallbacks[key] = [];
    storeCallbacks[key].push(cb);
    return {
      destroy() {
        // remove function pointer from callbacks
        storeCallbacks[key] = storeCallbacks[key].filter((v) => v === cb);
      },
    };
  }

  function makeRaw() {
    const data = latestVersion.create?.() ?? {};
    data["--version"] = latestVersion.version;
    return data;
  }

  function getRaw() {
    const item = localStorage.getItem(key);
    if (!item) return makeRaw();
    try {
      return JSON.parse(item);
    } catch (err) {
      // we assume user has fucked with the data, give them a fresh store
      console.error(`FAILED TO PARSE LOCALSTORAGE FOR KEY ${key}`, err);
      return makeRaw();
    }
  }

  function save(data: T) {
    const withVersion: any = { ...data };
    withVersion["--version"] = latestVersion.version;
    localStorage.setItem(key, JSON.stringify(withVersion));

    if (!storeCallbacks[key]) storeCallbacks[key] = [];
    storeCallbacks[key].forEach((v) => v(window.structuredClone(data)));
  }

  return {
    get() {
      const data = getRaw();
      delete data["--version"];
      return data as T;
    },
    _raw() {
      return getRaw();
    },
    onChange,
    save,
  };
}

function assertStore(store: InternalStoreData) {
  const versionListSorted = store.versions.sort(
    (a, b) => a.version - b.version,
  );
  versionListSorted.forEach((v, i, arr) => {
    if (i === 0) return;
    if (v.version !== arr[i - 1].version + 1)
      throw new Error("Version list of store is not incremental");
  });
  versionListSorted.forEach((v) => {
    if (v.version < 0) throw new Error("Versions cannot be negative");
  });

  // version zero must exist
  if (versionListSorted[0]?.version !== 0)
    throw new Error("Version 0 doesn't exist in version list of store");

  // max version must have create function
  if (!store.versions[store.versions.length - 1].create)
    throw new Error(`Missing create function on latest version of store`);

  // check storage string
  if (!store.key) throw new Error("storage key not set in store");

  // check if all parts have migratio
  const migrations = [...versionListSorted];
  migrations.pop();
  migrations.forEach((v) => {
    if (!v.migrate)
      throw new Error(`Migration missing on version ${v.version}`);
  });
}

export function createVersionedStore<T>(): StoreBuilder<T> {
  const _data: InternalStoreData = {
    versions: [],
    key: null,
  };

  return {
    setKey(key) {
      _data.key = key;
      return this;
    },
    addVersion(ver) {
      _data.versions.push(ver);
      return this;
    },
    build() {
      assertStore(_data);
      const storageObject = buildStorageObject<T>(_data);
      stores[_data.key ?? ""] = [storageObject, _data];
      return storageObject;
    },
  };
}
