const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
        colors: {
            primary: '#ef4444',
            secondary: '#111827',
            accent: '#f97316',
            light: '#f3f4f6',
            white: '#ffffff',
        },
        fontFamily: {
            // jadikan default
            sans: ["'Plus Jakarta Sans'", ...defaultTheme.fontFamily.sans],
            // alias opsional
            jakarta: ["'Plus Jakarta Sans'", ...defaultTheme.fontFamily.sans],
        },
        },
    },
    plugins: [],
};