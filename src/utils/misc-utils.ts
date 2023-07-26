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
