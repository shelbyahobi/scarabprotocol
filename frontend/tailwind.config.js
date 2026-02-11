/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'beetle-dark': '#0a1a0f',
                'beetle-green': '#1a3c22',
                'beetle-gold': '#d4af37',
                'beetle-accent': '#ffcc00',
                'beetle-electric': '#00f0ff',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
            }
        },
    },
    plugins: [],
}
