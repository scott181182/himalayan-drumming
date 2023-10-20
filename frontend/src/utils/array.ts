


export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

export function uniqByFilter<T, K extends keyof T>(key: K) {
    const seen = new Set<T[K]>();

    return (value: T) => {
        if(seen.has(value[key])) { return false; }
        seen.add(value[key]);
        return true;
    };
}