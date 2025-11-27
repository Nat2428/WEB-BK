/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions sudah default di Next.js 14
  webpack: (config, { isServer }) => {
    // Ensure .js files can be resolved
    if (!config.resolve.extensions) {
      config.resolve.extensions = [];
    }
    config.resolve.extensions.push(".js", ".jsx", ".ts", ".tsx", ".json");
    
    // Ensure proper module resolution
    config.resolve.modules = ["node_modules", ...(config.resolve.modules || [])];
    
    return config;
  },
};

module.exports = nextConfig;
