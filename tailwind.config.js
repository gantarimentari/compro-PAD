/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Untuk Komponen DS di luar src
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Gunakan 'extend' untuk menambahkan Design Tokens Anda
    extend: {

      fontFamily: {
        sans: ['var(--font-primary)', 'var(--font-secondary)', 'sans-serif'],
      },



      colors: {
          // YELLOW (Aksen utama untuk input field Anda)
          'accent-yellow': {
              100: 'rgb(255, 227, 186)',
              150: 'rgb(254, 249, 194)',
              200: 'rgb(255, 199, 116)',
              300: 'rgb(255, 171, 47)', // Digunakan untuk border oranye Anda
              400: 'rgb(233, 139, 0)',
              500: 'rgb(164, 98, 0)',
              550: 'rgb(166, 95, 0)',
          },

          // ALPHA ACCENT (Opacity)
          'accent-alpha': {
              10: 'rgba(255, 171, 47, 0.1)',
              50: 'rgba(255, 171, 47, 0.5)',
          },
          
          // BLUE
          'accent-blue': {
              100: 'rgb(180, 224, 255)',
              150: 'rgb(205, 228, 245)',
              175: 'rgb(219, 234, 254)',
              200: 'rgb(106, 193, 255)',
              300: 'rgb(31, 162, 255)',
              350: 'rgb(76,140,186)',
              400: 'rgb(0, 129, 221)',
              550: 'rgb(1, 68, 126)',
              500: 'rgb(0, 91, 156)',
              600: 'rgb(0, 56, 96)',
          },

          // GREEN
          'accent-green': {
              100: 'rgb(177, 245, 243)',
              200: 'rgb(98, 235, 230)',
              300: 'rgb(28, 216, 210)',
              350: 'rgb(87, 160, 157)',
              400: 'rgb(22, 168, 163)',
              500: 'rgb(15, 119, 116)',
              600: 'rgb(8, 78, 76)',
          },
          'accent-neutral': {
            
              100: 'rgb(255, 255, 255)', // Putih
              200: 'rgb(232, 232, 232)',
              225: 'rgb(248, 249, 250)',
              250: 'rgb(228, 228, 231)', //#E4E4E7
              300: 'rgb(210, 210, 210)',
              400: 'rgb(187, 187, 187)',
              250: 'rgb(228, 228, 231)',
              500: 'rgb(164, 164, 164)',
              600: 'rgb(142, 142, 142)',
              700: 'rgb(119, 119, 119)',
              800: 'rgb(96, 96, 96)',
              900: 'rgb(74, 74, 74)',
              1000: 'rgb(51, 51, 51)', // Hitam/Abu-abu Sangat Gelap
          },

          // RED
          'accent-red': {
              300: 'rgb(237, 66, 100)',
              400: 'rgb(213, 20, 59)',
              500: 'rgb(150, 14, 41)',
          },
          'accent-red-alpha-10': 'rgba(237, 66, 100, 0.1)',
      },
      fontSize: {
        'h-1': ['7.5rem', { lineHeight: '11.25rem' }],
        'h-2': ['5.75rem', { lineHeight: '8.625rem' }],  
        'h-3': ['4.375rem', { lineHeight: '6.5625rem' }],
        'h-4': ['3.375rem', { lineHeight: '5.0625rem' }],
        'h-5': ['2.625rem', { lineHeight: '3.9375rem' }],
        'h-6': ['2rem', { lineHeight: '3rem' }],
        'h-7': ['1.5rem', { lineHeight: '2.25rem' }],

        'body-1': ['1.125rem', { lineHeight: '1.6875rem' }],
        'body-2': ['0.875rem', { lineHeight: '1.3125rem' }],
        'body-5': ['0.625rem', { lineHeight: '0.9375rem' }],
        'body-6': ['0.5rem', { lineHeight: '0.75rem' }],
        'body-7': ['0.375rem', { lineHeight: '0.5625rem' }],

      
      },
      // tailwind.config.js (Hanya bagian extend.boxShadow)

      boxShadow: {
          // Tokens E0: Digunakan untuk shadow yang 'tidak ada' atau reset.
          'e0': '0 0 0 0 rgba(0, 0, 0, 0)', 
          'e1': '0px 2px 4px 0px rgba(0, 0, 0, 0.03)',
          'e2': '0px 16px 32px -12px rgba(0, 0, 0, 0.1)',
          'e3': '0px 16px 40px -8px rgba(0, 0, 0, 0.15)',
      },
      
    },
  },
  plugins: [],
}