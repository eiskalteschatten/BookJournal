module.exports = {
    'env': {
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 8,
        'sourceType': 'module'
    },
    'plugins': [
        'promise'
    ],
    'rules': {
        'indent': [
            'error',
            4,
            {'SwitchCase': 1}
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': [
            'off'
        ],
        'no-case-declarations': [
            'off'
        ],
        'prefer-const': [
            'error'
        ],
        'arrow-parens': [
            'error',
            'as-needed'
        ],
        'no-undef': [
            'off'
        ],
        'promise/catch-or-return': 'error',
        'promise/param-names': 'error',
        'promise/no-return-wrap': 'error',
        'no-async-promise-executor': 'off'
    }
};
