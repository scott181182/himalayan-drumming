/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    corePlugins: {
        preflight: false
    },
    theme: {
        extend: {
            container: { center: true }
        },
    },
    plugins: [],
};
