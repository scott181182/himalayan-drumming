export type Unnullified<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<any, any>
    ? { [K in keyof T]: Unnullified<T[K]> }
    : T extends null
      ? undefined
      : T;

export function unnullifyObject<T>(obj: T): Unnullified<T> {
  if (obj === null) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return undefined as Unnullified<T>;
  }
  if (typeof obj === "object") {
    const newObj = { ...obj };
    for (const k in obj) {
      // oxlint-disable-next-line typescript/no-unsafe-assignment typescript/no-unsafe-type-assertion
      newObj[k] = unnullifyObject(obj[k]) as any;
    }
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return newObj as Unnullified<T>;
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return obj as Unnullified<T>;
}
