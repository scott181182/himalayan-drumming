/** @type import("eslint").Linter.Config */
const config = {
    extends: [
        "next/core-web-vitals",
        "plugin:import/recommended"
    ],
    rules: {
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        "import/order": [
            "error",
            {
                "alphabetize": {
                    order: "asc",
                    orderImportKind: "asc",
                    caseInsensitive: true
                },
                "groups": [
                    "builtin",
                    "external"
                ],
                "newlines-between": "always"
            }
        ],
    },
};

module.exports = config;
