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
      {
        protocol: "https",
        hostname: "*.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "http",
        hostname: "www.kopis.or.kr",
        port: "",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "search.pstatic.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default config;
