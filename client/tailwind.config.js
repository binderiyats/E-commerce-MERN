/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#292D32",
        "color-1": "#003F62",
        "color-2": "#EDA415",
        "color-3": "#F4F4F4",
        "color-4": "#3A3A3A",
      },
      fontSize: {
        "xs-regular": [
          "14px",
          {
            lineHeight: "21px",
            fontWeight: "400",
          },
        ],
        "base-medium": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "500",
          },
        ],
        "base-bold": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "700",
          },
        ],
      },
    },
  },
  plugins: [],
};
