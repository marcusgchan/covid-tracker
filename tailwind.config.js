const { colors: defaultColors } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "custom-grey": "#424242",
      },
    },
  },
  plugins: [],
};
