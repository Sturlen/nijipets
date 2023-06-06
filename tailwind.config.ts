import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dragoon: ["Selen2 Font", "Selen Font"],
      },
    },
  },
  plugins: [],
} satisfies Config;
