const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://practicetestautomation.com",
    setupNodeEvents(on, config) {},
  },
});
