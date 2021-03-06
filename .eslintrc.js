module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'prettier/prettier': 'error',
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
    },
    plugins: ['prettier'],
};
