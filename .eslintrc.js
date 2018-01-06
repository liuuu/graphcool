module.exports = {
  extends: 'airbnb',
  plugins: ['react', 'jsx-a11y', 'import'],
  parser: 'babel-eslint',
  rules: {
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'react/prefer-stateless-function': 0,
    'import/extensions': 0,
    'no-underscore-dangle': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'func-names': 0,
  },
  globals: {
    document: 1,
  },
  env: {
    browser: 1,
  },
};
