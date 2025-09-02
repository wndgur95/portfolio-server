declare global {
  interface Array<T> {
    isEmpty(): boolean;

    isNotEmpty(): boolean;

    sum(): number;

    hasDuplicates(): boolean;

    distinct(): T[];

    hasCommonElements(items: (T | ConcatArray<T>)[]): boolean;

    generateSubsets(): T[][];

    hasSameElements(this: T[], a: T[]): boolean;
  }
}

Array.prototype.isEmpty = function (): boolean {
  return this.length === 0;
};

Array.prototype.isNotEmpty = function (): boolean {
  return this.length !== 0;
};

Array.prototype.sum = function (): number {
  return this.reduce((acc: number, cur: number) => acc + cur, 0);
};

Array.prototype.hasDuplicates = function (): boolean {
  const uniqueSet = new Set(this);
  return this.length - uniqueSet.size > 0;
};

Array.prototype.distinct = function <T>(): T[] {
  return [...new Set(this)] as T[];
};

Array.prototype.hasCommonElements = function <T>(
  items: (T | ConcatArray<T>)[],
): boolean {
  const combinedSet = new Set([...this, ...items]);

  return combinedSet.size < this.length + items.length;
};

Array.prototype.generateSubsets = function (): number[][] {
  if (this.isEmpty()) {
    return [];
  }

  const result: number[][] = [];
  const seen = new Set<string>();
  const n = this.length;

  for (let i = 0; i < Math.pow(2, n); i++) {
    const subset = new Array(n).fill(0);

    for (let j = 0; j < n; j++) {
      if ((i >> (n - 1 - j)) & 1) {
        subset[j] = this[j];
      }
    }

    // 중복 제거
    const key = subset
      .map((val, idx) => (val === 0 ? null : `${idx}:${val}`))
      .filter(Boolean)
      .join(',');

    if (!seen.has(key)) {
      seen.add(key);
      result.push(subset);
    }
  }

  return result;
};

Array.prototype.hasSameElements = function <T>(this: T[], a: T[]): boolean {
  if (!Array.isArray(a)) return false;
  if (this.length !== a.length) return false;

  const setA = new Set(this);
  const setB = new Set(a);

  if (setA.size !== setB.size) return false;

  return [...setA].every((v) => setB.has(v));
};

export {};
