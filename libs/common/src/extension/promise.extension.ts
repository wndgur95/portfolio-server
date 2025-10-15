export {};

declare global {
  interface PromiseConstructor {
    allWait<T extends readonly unknown[]>(
      promises: readonly [...T],
    ): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
  }
}

Promise.allWait = async function <T extends readonly unknown[]>(
  promises: readonly [...T],
): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
  const results = await Promise.allSettled(promises);

  const firstError = results.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );

  if (firstError) {
    throw firstError.reason;
  }

  return results
    .filter(
      (result): result is PromiseFulfilledResult<Awaited<T[keyof T]>> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value) as {
    -readonly [P in keyof T]: Awaited<T[P]>;
  };
};

