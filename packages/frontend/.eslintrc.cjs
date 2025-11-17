/** @type import("eslint").Linter.Config */
const config = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "next/core-web-vitals",
        "plugin:import/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint"
    ],
    rules: {
        "indent": ["error", 4, {
            SwitchCase: 1
        }],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        "import/no-unresolved": ["off"],
        "import/order": [
            "error",
            {
                "alphabetize": {
                    order: "asc",
                    caseInsensitive: true
                },
                "groups": [
                    "builtin",
                    "external"
                ],
                "newlines-between": "always"
            }
        ],

        "@typescript-eslint/consistent-type-imports": "error"
    },
};

module.exports = config;
