/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "@remotion/bundler",
      "@remotion/renderer",
      "@remotion/compositor-mac-arm64",
      "@remotion/compositor-mac-x64",
      "@rspack/core",
      "@rspack/binding",
      "@rspack/binding-darwin-arm64",
      "esbuild",
    ],
  },
};

export default nextConfig;
