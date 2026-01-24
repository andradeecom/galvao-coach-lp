/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        bgteam: {
          transparent: "transparent",
          dark: "#020617", // slate-950
          light: "#f1f5f9", // slate-100
          text: "#111e5a", // neutral-950
          error: "#ef4444", // red-500
          success: "#22c55e", // green-500
          primary: {
            50: "#edf5ff",
            100: "#d7e7ff",
            200: "#b9d6ff",
            300: "#88bdff",
            400: "#5099ff",
            500: "#2871ff",
            600: "#1350ff",
            700: "#0a39eb",
            800: "#0f2ebe",
            900: "#132e95",
            950: "#111e5a",
          },
          secondary: {
            50: "#f4f3ff",
            100: "#ebe9fe",
            200: "#d9d6fe",
            300: "#beb6fc",
            400: "#9d8cf9",
            500: "#7e5df5",
            600: "#6c3ceb",
            700: "#5d2ad7",
            800: "#4d22b3",
            900: "#411e94",
            950: "#261164",
          },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#2871ff",
          secondary: "#7e5df5",
          accent: "#88bdff",
          neutral: "#111e5a",
          "base-100": "#d7e7ff",
          info: "#5d2ad7",
          success: "#22c55e", // green-500
          warning: "#eab308", // yellow-500
          error: "#ef4444", // red-500
        },
      },
    ],
  },
};
