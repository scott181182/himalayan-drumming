/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    rewrites: async () => [
        {
            // Keep auth endpoints in NextJS.
            source: "/api/auth/:path*",
            destination: "/api/auth/:path*",
        },
        {
            // Redirect other API endpoints to backend server.
            source: "/api/:path*",
            destination: "http://localhost:3001/api/:path*"
        }
    ]
};

module.exports = nextConfig;
