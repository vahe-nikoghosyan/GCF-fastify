export const toMap = <T>(items: T[], key = "id" as keyof T) =>
  items.reduce(
    (p, c) => {
      if (!c[key]) {
        return p;
      }
      p[c[key] as string] = c;
      return p;
    },
    {} as Record<string, T>,
  );

export const createMergedKeys = <T>(
  items: T[],
  keys: (keyof T)[] = ["id" as keyof T],
) => {
  const keysExist = keys.every((key) => !!items[0][key]);

  if (!keysExist) {
    return {} as Record<string, T>;
  }
  return items.reduce(
    (p, c) => {
      const key = keys.reduce((acc, cur) => {
        return acc + String(c[cur]);
      }, "" as string);
      p[key] = c;
      return p;
    },
    {} as Record<string, T>,
  );
};
