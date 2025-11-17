// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("node:path");



/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    serverExternalPackages: [
        "himalayan-drumming-research-database"
    ],
    turbopack: {
        root: path.resolve(__dirname, "..", "..")
    },
};

module.exports = nextConfig;
