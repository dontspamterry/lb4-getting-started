export interface CcpDao<K, T> {
    get(id: K): Promise<T | undefined>;
    save(item: T): Promise<T>;
}