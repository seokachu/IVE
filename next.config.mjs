/** @type {import('next').NextConfig} */
const config = {
  outputFileTracingRoot: import.meta.dirname,
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/index.html",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jzghadoanikvjvczuerw.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default config;
