import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const themeVariables = (color: string) => ({
    50: `var(--theme-${color}-50)`,
    100: `var(--theme-${color}-100)`,
    200: `var(--theme-${color}-200)`,
    300: `var(--theme-${color}-300)`,
    400: `var(--theme-${color}-400)`,
    500: `var(--theme-${color}-500)`,
    600: `var(--theme-${color}-600)`,
    700: `var(--theme-${color}-700)`,
    800: `var(--theme-${color}-800)`,
    900: `var(--theme-${color}-900)`,
    950: `var(--theme-${color}-950)`,
});

export default (<Config>{
    content: [
        "./entrypoints/**/*.{js,jsx,ts,tsx,html}",
        "./components/**/*.{js,jsx,ts,tsx,html}",
    ],
    theme: {
        extend: {
            colors: {
                dark: themeVariables("dark"),
                primary: themeVariables("primary"),
            },
        },
    },
    plugins: [forms, typography],
});
