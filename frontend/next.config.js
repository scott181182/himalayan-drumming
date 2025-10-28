/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    rewrites: async () => [
        {
            source: "/api/:path*",
            destination: "http://localhost:3001/:path*"
        }
    ]
};

module.exports = nextConfig;
