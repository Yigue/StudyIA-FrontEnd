interface CacheEntry<T> {
    data: T;
    timestamp: number;
}
  
export class CacheManager<T = undefined> {
    private cache: Map<string, CacheEntry<T>>;
    private ttl: number;
  
    constructor(ttl: number) {
        this.cache = new Map();
        this.ttl = ttl;
    }
  
    get size(): number {
        return this.cache.size;
    }
  
    generateKey(params: Record<string, unknown>): string {
        return Object.entries(params)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
            .join('&');
    }
  
    get(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;
        
        if (Date.now() - entry.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.data;
    }
  
    set(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
  
    isExpired(key: string): boolean {
        const entry = this.cache.get(key);
        return entry ? Date.now() - entry.timestamp > this.ttl : true;
    }
  
    invalidate(keyPattern: string | RegExp): void {
        Array.from(this.cache.keys()).forEach((key) => {
            if (key.match(keyPattern)) {
                this.cache.delete(key);
            }
        });
    }
}