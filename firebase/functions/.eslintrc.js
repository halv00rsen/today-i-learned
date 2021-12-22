module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  rules: {
    quotes: ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
  },
};
