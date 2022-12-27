const a11yOff = Object.keys(require("eslint-plugin-jsx-a11y").rules).reduce(
  (acc, rule) => {
    acc[`jsx-a11y/${rule}`] = "off";
    return acc;
  },
  {}
);

module.exports = {
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  settings: {
    "import/resolver": {
      typescript: {}
    }
  },
  ignorePatterns: ["public/*", "dist/*", "/*.js", "/*.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: "./"
  },
  plugins: ["@typescript-eslint", "import"],
  env: {
    browser: true
  },
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
    "react/destructuring-assignment": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": "off",
    "@typescript-eslint/no-this-alias": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-restricted-syntax": "off",
    "react/jsx-props-no-spreading": "off",
    "consistent-return": "off",
    "no-continue": "off",
    "no-eval": "off",
    "no-await-in-loop": "off",
    "react/jsx-filename-extension": [
      "error",
      { extensions: [".js", ".tsx", ".jsx"] }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never"
      }
    ],
    ...a11yOff
  }
};
