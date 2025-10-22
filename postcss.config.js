// // postcss.config.js (Solusi Akhir untuk Next.js/Link Error)

// module.exports = {
//   plugins: {
//     // Memaksa Webpack untuk menemukan file index.js dari paket 'tailwindcss'
//     [require.resolve('tailwindcss')]: {}, 
//     'autoprefixer': {},
//   },
// }
// postcss.config.js

module.exports = {
  plugins: {
    'tailwindcss': {}, 
    'autoprefixer': {},
  },
}