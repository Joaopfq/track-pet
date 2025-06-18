/** @type {import('next').NextConfig} */
export default {
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
};
