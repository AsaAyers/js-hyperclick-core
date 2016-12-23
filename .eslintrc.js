module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
        }
    },
    "plugins": [
        "jest"
    ],
    "rules": {
        "jest/no-exclusive-tests": 2,
        "jest/no-identical-title": 2,
        "comma-dangle": [ 0 ],
        "no-this-before-super": [ 2 ],
        "constructor-super": [ 2 ],
        "indent": [ 2, 4 ],
        "linebreak-style": [ 2, "unix" ],
        "no-var": [ 1 ],
        "prefer-const": [ 1 ],
        "no-const-assign": [ 2 ],
        "no-unused-vars": [ 2 ],
        "semi": [ 2, "never" ]
    }
};
