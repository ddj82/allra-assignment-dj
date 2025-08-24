/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary
                primary: {
                    DEFAULT: '#1E90FF',
                },

                // Secondary - Blue 계열
                secondary: {
                    700: '#1565C0', // Blue700
                    600: '#1976D2', // Blue600
                    400: '#42A5F5', // Blue400
                    300: '#90CAF9', // Blue300
                    200: '#BBDEFB', // Blue200
                    100: '#E3F2FD', // Blue100
                    50: '#F3F9FF',  // Blue50
                },

                // Label - Gray 계열
                label: {
                    900: '#212121',
                    800: '#424242',
                    700: '#616161',
                    500: '#9E9E9E',
                    100: '#F5F5F5',
                },

                // Background
                background: {
                    default: '#FFFFFF',
                    alternative: '#F8F9FA',
                },

                // Line
                line: {
                    800: '#263238',
                    400: '#CFD8DC',
                    200: '#ECEFF1',
                },

                // Status
                status: {
                    correct: '#4CAF50',
                    error: '#F44336',
                    caution: '#FF9800',
                    disable: '#BDBDBD',
                },

                // Component
                component: {
                    dark: '#263238',
                    light: '#CFD8DC',
                    assistive: '#F5F5F5',
                    alternative: '#FAFAFA',
                },

                // Material
                material: {
                    dimmed: '#424242',
                    scroll: '#BDBDBD',
                },
            },

            // Shadow 정의
            boxShadow: {
                'elevation-normal': '0 2px 4px rgba(0, 0, 0, 0.1)',
                'elevation-strong': '0 4px 8px rgba(0, 0, 0, 0.15)',
                'elevation-heavy': '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
            borderRadius: {
                '2xs': '2px',
                'xs': '4px',
                'sm': '6px',
                'md': '8px',
                'lg': '10px',
                'xl': '12px',
                '2xl': '14px',
            },
        },
    },
    plugins: [
        // 커스텀 텍스트 스타일을 유틸리티 클래스로 추가
        function({ addUtilities }) {
            const newUtilities = {
                '.text-display-1': {
                    fontSize: '48px',
                    lineHeight: '140%',
                    letterSpacing: '-0.02em',
                },
                '.text-display-2': {
                    fontSize: '40px',
                    lineHeight: '140%',
                    letterSpacing: '-0.02em',
                },
                '.text-title-1': {
                    fontSize: '32px',
                    lineHeight: '140%',
                    letterSpacing: '-0.02em',
                },
                '.text-title-2': {
                    fontSize: '26px',
                    lineHeight: '140%',
                    letterSpacing: '-0.02em',
                },
                '.text-title-3': {
                    fontSize: '20px',
                    lineHeight: '140%',
                    letterSpacing: '-0.02em',
                },
                '.text-title-4': {
                    fontSize: '18px',
                    lineHeight: '144%',
                    letterSpacing: '-0.02em',
                },
                '.text-body-1': {
                    fontSize: '16px',
                    lineHeight: '150%',
                    letterSpacing: '-0.01em',
                },
                '.text-body-2': {
                    fontSize: '15px',
                    lineHeight: '150%',
                    letterSpacing: '-0.01em',
                },
                '.text-body-3': {
                    fontSize: '14px',
                    lineHeight: '150%',
                    letterSpacing: '-0.01em',
                },
                '.text-caption-1': {
                    fontSize: '12px',
                    lineHeight: '140%',
                    letterSpacing: '-0.01em',
                },
                '.text-caption-2': {
                    fontSize: '11px',
                    lineHeight: '140%',
                    letterSpacing: '-0.01em',
                },
            }
            addUtilities(newUtilities)
        }
    ],
}