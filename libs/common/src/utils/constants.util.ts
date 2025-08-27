export function constToString<T>(constObject: T, objectName?: string): string {
  const enumString = Object.keys(constObject)
    .map((key) => {
      const value = constObject[key];
      if (typeof value === 'object') {
        return `${key}: ${constToString(value)}`;
      }
      return `${key}: ${value}`;
    })
    .join(', ');

  return objectName ? `${objectName}: { ${enumString} }` : `{ ${enumString} }`;
}
