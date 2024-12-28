/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  // experimental: {
  //   missingSuspenseWithCSRBailout: false,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mxjyswfblmzljdjizuar.supabase.co",
      },
      {
        protocol: "https",
        hostname: "tailus.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "farmgrid.org",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
    ],
  },
};

export default nextConfig;
