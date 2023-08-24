


export function fatal(message: string): never {
    console.error(message);
    process.exit(1);
}
