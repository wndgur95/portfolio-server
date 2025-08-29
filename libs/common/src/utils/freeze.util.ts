export function deepFreeze(obj: unknown): void {
  const propNames = Object.getOwnPropertyNames(obj);

  for (const name of propNames) {
    const value = obj[name];

    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  Object.freeze(obj);
}
