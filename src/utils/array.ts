export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function uniqByFilter<T>(key: keyof T) {
  const seen = new Set<T[keyof T]>();

  return (value: T) => {
    if (seen.has(value[key])) {
      return false;
    }
    seen.add(value[key]);
    return true;
  };
}
