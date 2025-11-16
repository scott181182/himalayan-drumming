import path from "node:path";



const BLOB_ROOT = process.env.BLOB_ROOT ?? path.resolve(__dirname, "..", "..", "..", "..", "blob");

export const FILE_ROOT = path.join(BLOB_ROOT, "files");
export const AVATAR_ROOT = path.join(BLOB_ROOT, "avatars");