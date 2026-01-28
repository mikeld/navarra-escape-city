/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Cinzel', 'serif'],
                sans: ['Lato', 'sans-serif'],
            },
            colors: {
                navarra: {
                    crimson: '#E30613',
                    gold: '#D4AF37',
                    goldLight: '#F3E5AB',
                    dark: '#1A1A1A',
                    stone: '#2D2D2D',
                    parchment: '#F4EBD0',
                    panel: '#242424'
                }
            },
            backgroundImage: {
                'medieval-pattern': "url('https://upload.wikimedia.org/wikipedia/commons/5/5e/Paper_texture_1.jpg')",
                'navarra-hero': "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/hero_navarra.jpg')",
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
                'flash-colors': 'flashColors 0.5s steps(5, end) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                glitch: {
                    '0%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                    '100%': { transform: 'translate(0)' }
                },
                flashColors: {
                    '0%': { backgroundColor: '#1a1814' },
                    '25%': { backgroundColor: '#6b1010' },
                    '50%': { backgroundColor: '#2d3e50' },
                    '75%': { backgroundColor: '#e2b13c' },
                    '100%': { backgroundColor: '#1a1814' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        }
    },
    plugins: [],
}
