import js from '@eslint/js';
import globals from 'globals';

export default [  
  js.configs.recommended,
  {
    files: ["assets/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: "module",
      globals: {
        ...globals.browser,
        XLSX: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-eval": "error",
      "no-implied-eval": "error",
      "semi": ["error", "always"],
      "quotes": ["warn", "single"],
      "eqeqeq": ["error", "always"],
    },
  },
];