export function getEnvVar(key: string): string | undefined;
export function getEnvVar(key: string, defaultValue: string): string;
export function getEnvVar(key: string, defaultValue?: string): string | undefined {
  const value = process.env[key];
  // Using `||` to return the default value if the environment variable is undefined _or_ empty;
  // oxlint-disable-next-line typescript/prefer-nullish-coalescing
  return value || defaultValue;
}

/** Array of string values considered as true for environment variable flags. */
const TRUE_VALUES = ["true", "1", "y", "yes"];
export function getEnvVarFlag(key: string, defaultValue: boolean): boolean {
  const value = getEnvVar(key);
  if (!value) {
    return defaultValue;
  }

  return TRUE_VALUES.includes(value.toLowerCase());
}
