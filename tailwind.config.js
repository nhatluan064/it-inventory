// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  // DÒNG QUAN TRỌNG NHẤT: Báo cho Tailwind biết sẽ dùng class "dark"
  darkMode: "class",

  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        rotateIn: {
          "0%": { transform: "rotate(-10deg)", opacity: "0" },
          "100%": { transform: "rotate(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        }, //<div class="w-24 h-24 bg-purple-500 rounded-full animate-blob"></div>
        neon: {
          "0%, 100%": { textShadow: "0 0 5px #ff00de, 0 0 10px #ff00de" },
          "50%": { textShadow: "0 0 20px #ff00de, 0 0 40px #ff00de" },
        }, //<h1 class="text-4xl font-bold text-pink-500 animate-neon">Loading...</h1>
        bounceDots: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
        // <div class="flex space-x-2">
        //   <div class="w-3 h-3 bg-gray-500 rounded-full animate-dot1"></div>
        //   <div class="w-3 h-3 bg-gray-500 rounded-full animate-dot2"></div>
        //   <div class="w-3 h-3 bg-gray-500 rounded-full animate-dot3"></div>
        // </div>
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(40px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(40px) rotate(-360deg)",
          },
        },
        // <div class="relative w-20 h-20">
        //   <div class="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full animate-orbit"></div>
        //   <div class="absolute top-1/2 left-1/2 w-5 h-5 bg-yellow-400 rounded-full"></div>
        // </div>
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out",
        slideUp: "slideUp 0.8s ease-out",
        scaleIn: "scaleIn 0.6s ease",
        rotateIn: "rotateIn 0.6s ease",
        shimmer: "shimmer 2s linear infinite",
        blob: "blob 6s infinite ease-in-out",
        neon: "neon 1.5s ease-in-out infinite",
        dot1: "bounceDots 1.4s infinite ease-in-out",
        dot2: "bounceDots 1.4s infinite ease-in-out 0.2s",
        dot3: "bounceDots 1.4s infinite ease-in-out 0.4s",
        orbit: "orbit 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
