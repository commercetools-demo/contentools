export class ComponentCache {
  private cache = new Map<string, any>();
  private cleanupFunctions = new Map<string, (() => void)[]>();
  private maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  set(key: string, component: any, cleanup: (() => void)[] = []): void {
    // LRU eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.delete(firstKey);
      }
    }

    this.cache.set(key, component);
    this.cleanupFunctions.set(key, cleanup);
  }

  get(key: string): any {
    const component = this.cache.get(key);
    if (component) {
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, component);

      const cleanup = this.cleanupFunctions.get(key);
      this.cleanupFunctions.delete(key);
      this.cleanupFunctions.set(key, cleanup || []);
    }
    return component;
  }

  delete(key: string): void {
    // Run cleanup functions
    const cleanupFunctions = this.cleanupFunctions.get(key);
    if (cleanupFunctions) {
      cleanupFunctions.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          console.info('Cleanup error:', error);
        }
      });
    }

    this.cache.delete(key);
    this.cleanupFunctions.delete(key);
  }

  clear(): void {
    for (const key of this.cache.keys()) {
      this.delete(key);
    }
  }
}
