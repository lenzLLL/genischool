/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{ hostname: "images.pexels.com" ,protocol:"https"},{hostname:"cdn-icons-png.flaticon.com",protocol:"https"}],
      },
};

export default nextConfig;
