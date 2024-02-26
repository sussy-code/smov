export class SimpleCache<Key, Value> {
  protected readonly INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

  protected _interval: ReturnType<typeof setTimeout> | null = null;

  protected _compare: ((a: Key, b: Key) => boolean) | null = null;

  protected _storage: { key: Key; value: Value; expiry: Date }[] = [];

  /*
   ** initialize store, will start the interval
   */
  public initialize(): void {
    if (this._interval) throw new Error("cache is already initialized");
    this._interval = setInterval(() => {
      const now = new Date();
      this._storage.filter((val) => {
        if (val.expiry < now) return false; // remove if expiry date is in the past
        return true;
      });
    }, this.INTERVAL_MS);
  }

  /*
   ** destroy cache instance, its not safe to use the instance after calling this
   */
  public destroy(): void {
    if (this._interval) clearInterval(this._interval);
    this.clear();
  }

  /*
   ** Set compare function, function must return true if A & B are equal
   */
  public setCompare(compare: (a: Key, b: Key) => boolean): void {
    this._compare = compare;
  }

  /*
   ** check if cache contains the item
   */
  public has(key: Key): boolean {
    return !!this.get(key);
  }

  /*
   ** get item from cache
   */
  public get(key: Key): Value | undefined {
    if (!this._compare) throw new Error("Compare function not set");
    const foundValue = this._storage.find(
      (item) => this._compare && this._compare(item.key, key),
    );
    if (!foundValue) return undefined;
    return foundValue.value;
  }

  /*
   ** set item from cache, if it already exists, it will overwrite
   */
  public set(key: Key, value: Value, expirySeconds: number): void {
    if (!this._compare) throw new Error("Compare function not set");
    const foundValue = this._storage.find(
      (item) => this._compare && this._compare(item.key, key),
    );
    const expiry = new Date(new Date().getTime() + expirySeconds * 1000);

    // overwrite old value
    if (foundValue) {
      foundValue.key = key;
      foundValue.value = value;
      foundValue.expiry = expiry;
      return;
    }

    // add new value to storage
    this._storage.push({
      key,
      value,
      expiry,
    });
  }

  /*
   ** remove item from cache
   */
  public remove(key: Key): void {
    if (!this._compare) throw new Error("Compare function not set");
    this._storage.filter((val) => {
      if (this._compare && this._compare(val.key, key)) return false; // remove if compare is success
      return true;
    });
  }

  /*
   ** clear entire cache storage
   */
  public clear(): void {
    this._storage = [];
  }
}
