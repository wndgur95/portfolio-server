import { createLRU } from 'lru.min';

type QueryValue<V> = V extends any[] ? V[] : V[];
type QueryInterface<T> = {
  [K in keyof T]?: QueryValue<T[K]>;
};

export abstract class StaticBaseRepository<T> {
  items: Record<number, T> = {};
  cache = createLRU<string, T[]>({
    max: 1000,
  });

  abstract load(): void;

  keys(): number[] {
    return Object.keys(this.items).map(Number);
  }

  values(): T[] {
    return Object.values(this.items);
  }

  findById(id: number): T {
    return this.items[id];
  }

  findByIdIn(ids: number[]): T[] {
    return ids.map((id) => this.items[id]).filter((it) => !!it);
  }

  query(queryInterface: QueryInterface<T>): T[] {
    const queryKey = JSON.stringify(queryInterface);
    const cached = this.cache.get(queryKey);
    if (cached) {
      return [...cached];
    }

    const result = this.values().filter((data) => {
      for (const key in queryInterface) {
        const value = data[key];
        const conditions = queryInterface[key];

        if (!Array.isArray(conditions) || conditions.length === 0) {
          continue;
        }

        if (value === undefined) {
          return false;
        }

        if (Array.isArray(conditions[0])) {
          const valueStr = JSON.stringify(value);
          const match = conditions.some(
            (condition) => JSON.stringify(condition) === valueStr,
          );

          if (!match) {
            return false;
          }

          continue;
        }

        if (!conditions.includes(value)) {
          return false;
        }
      }
      return true;
    });

    Object.freeze(result);

    this.cache.set(queryKey, result);

    return [...result];
  }
}
