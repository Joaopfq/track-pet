/** @type {import('next').NextConfig} */

import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "na64y6u6p9.ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "place-puppy.com",
        pathname: "/puppy/y:*/x:*"
      },
    ],
  },
});
