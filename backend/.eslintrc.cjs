/** @type import("eslint").Linter.Config */
const config = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
    ],
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts"]
        },
        "import/resolver": {
            "typescript": {
                "project": "./tsconfig.json",
            }
        }
    },
    rules: {
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        "import/no-named-as-default-member": "off",
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

        "@typescript-eslint/consistent-type-imports": "error"
    },
};

// eslint-disable-next-line no-undef
module.exports = config;
