module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
    'prettier',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    'no-console': 'off',
    'xwalk/max-cells': ['error', {
      '*': 10,
    }],
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'prettier/prettier': 'error',
  },
  plugins: ['prettier'],
};
