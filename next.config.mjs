/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                hostname: "www.thespruce.com",
            },
        ],
    },
};

export default nextConfig;
