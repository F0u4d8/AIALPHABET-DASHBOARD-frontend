import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {unoptimized : true ,
    remotePatterns: [ {
      protocol: 'https',
      hostname: 'upload.wikimedia.org'
    },] ,
  },
};

export default nextConfig;
