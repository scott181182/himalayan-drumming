/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    serverExternalPackages: [
        "himalayan-drumming-research-database"
    ],
};

module.exports = nextConfig;
