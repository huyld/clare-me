export const TTL_NEVER_EXPIRE = 0
export const TTL_ONE_DAY = 86400
export interface CacheClient {
  prefixKey(key: string): string
  set(key: string, value: Object, ttl: number): Promise<Object | null>
  get(key: string): Promise<string | null>
  exists(key: string): Promise<number>
  addToList(key: string, value: string): Promise<number>
  listAll(key: string): Promise<string[] | null>
}
