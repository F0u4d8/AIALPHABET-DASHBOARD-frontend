import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {unoptimized : true ,
    remotePatterns: [ {
      protocol: 'https',
      hostname: 'teal-peculiar-dingo-421.mypinata.cloud'
    },] ,
  },
};

export default nextConfig;
