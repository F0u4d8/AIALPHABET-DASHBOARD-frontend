import type { NextConfig } from "next";

const nextConfig: NextConfig = {
eslint: {
    ignoreDuringBuilds: true,
  },
 
  images: {unoptimized : true ,
    remotePatterns: [ {
      protocol: 'https',
      hostname: 'teal-peculiar-dingo-421.mypinata.cloud'
    },] ,
  },
};

export default nextConfig;
