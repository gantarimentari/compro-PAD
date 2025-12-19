// next.config.js (atau next.config.mjs)

const nextConfig = {
  async rewrites(){
    return [
      {
        source: '/laravel/:path*',
        destination:'http://localhost:8000/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 
// ATAU: export default nextConfig; jika Anda menggunakan .mjs