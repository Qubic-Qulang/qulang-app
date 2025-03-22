/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [],
    theme: {
        extend: {
            opacity: {
                '15': '0.15',
                '35': '0.35',
                '65': '0.65',
            },
            keyframes: {
                blink: {
                    '50%': { opacity: '0' },
                },
            },
            animation: {
                blink: 'blink 1s infinite',
            },
            colors: ({ colors }) => ({
                inherit: colors.inherit,
                current: colors.current,
                transparent: "transparent",
                primary: {
                    20: "#CCFCFF",
                    30: "#202E3C",
                    40: "#61F0FE",
                    50: "#61F0FE",
                    60: "#101820",
                    70: "#019AB8",
                    90: "#112C35",
                },
                error: {
                    40: "#F97066",
                    90: "#381D1E",
                },
                success: {
                    40: "#47CD89",
                    90: "#11322D",
                },
                warning: {
                    40: "#CDA747",
                    90: "#322D11",
                },
            }),
        },
    },
    plugins: [],
};