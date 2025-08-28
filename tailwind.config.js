/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            container: {
                center: true,
                padding: {
                    DEFAULT: "1.25rem",
                    md: "2.5rem",
                    lg: "20px",
                },
                screens: {
                    sm: "40rem",
                    md: "48rem",
                    lg: "64rem",
                    xl: "80rem",
                    "2xl": "96rem",
                },
            },
            colors: {
                primary: {
                    DEFAULT: "#1E90FF"
                },
                secondary: {
                    50: "#F3F9FF",
                    100: "#E3F2FD",
                    200: "#BBDEFB",
                    300: "#90CAF9",
                    400: "#42A5F5",
                    600: "#1976D2",
                    700: "#1565C0",
                },
                label: {
                    100: "#F5F5F5",
                    500: "#9E9E9E",
                    700: "#616161",
                    800: "#424242",
                    900: "#212121",
                },
                background: {
                    default: "#FFFFFF",
                    alternative: "#F8F9FA",
                },
                line: {
                    200: "#ECEFF1",
                    400: "#CFD8DC",
                    800: "#263238",
                },
                status: {
                    correct: "#4CAF50",
                    error: "#F44336",
                    caution: "#FF9800",
                    disable: "#BDBDBD",
                },
                component: {
                    dark: "#263238",
                    light: "#CFD8DC",
                    assistive: "#F5F5F5",
                    alternative: "#FAFAFA",
                },
                material: {
                    dimmed: "#424242",
                    scroll: "#BDBDBD",
                },
            },
            boxShadow: {
                "elevation-normal": "0 2px 4px rgba(0,0,0,0.1)",
                "elevation-strong": "0 4px 8px rgba(0,0,0,0.15)",
                "elevation-heavy": "0 8px 16px rgba(0,0,0,0.2)",
            },
            borderRadius: {
                "2xs": "2px",
                xs: "4px",
                sm: "6px",
                md: "8px",
                lg: "10px",
                xl: "12px",
                "2xl": "14px",
            },
            fontSize: {
                'display-1': ['3rem', { lineHeight: '140%', letterSpacing: '-0.02em' }],
                'display-2': ['2.5rem', { lineHeight: '140%', letterSpacing: '-0.02em' }],
                'title-1': ['2rem', { lineHeight: '140%', letterSpacing: '-0.02em' }],
                'title-2': ['1.625rem', { lineHeight: '140%', letterSpacing: '-0.02em' }],
                'title-3': ['1.25rem', { lineHeight: '140%', letterSpacing: '-0.02em' }],
                'title-4': ['1.125rem', { lineHeight: '144%', letterSpacing: '-0.02em' }],
                'body-1': ['1rem', { lineHeight: '150%', letterSpacing: '-0.01em' }],
                'body-2': ['0.9375rem', { lineHeight: '150%', letterSpacing: '-0.01em' }],
                'body-3': ['0.875rem', { lineHeight: '150%', letterSpacing: '-0.01em' }],
                'caption-1': ['0.75rem', { lineHeight: '140%', letterSpacing: '-0.01em' }],
                'caption-2': ['0.70rem', { lineHeight: '140%', letterSpacing: '-0.01em' }],
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                ".scrollbar-hide": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                },
                ".text-nowrap": {
                    "text-wrap": "nowrap"
                },
            });
        },
    ],
};