/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.@(js|jsx)'],
  staticDirs: ["../public"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/addon-a11y',
    "@chromatic-com/storybook"
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
