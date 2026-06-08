import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    outputFileTracingRoot: process.cwd(),
    webpack: (config) => {
        // Handle MathJax static assets
        config.module.rules.push({
            test: /\.woff2$/,
            type: 'asset/resource'
        });
        return config;
    },
};

// module.exports = {
//     reactStrictMode: false,
// }
export default nextConfig;
