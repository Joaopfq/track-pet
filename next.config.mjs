/** @type {import('next').NextConfig} */

import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/app-build-manifest\.json$/],
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
