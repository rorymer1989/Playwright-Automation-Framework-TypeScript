// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: [
            "node_modules/**",
            "playwright-report/**",
            "allure-report/**",
            "allure-results/**",
            "test-results/**",
            "reports/**",
            "Screenshots/**",
        ],
    },

    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
            "@typescript-eslint/no-explicit-any": "error",
            "no-console": "off",
        },
    },

    // Playwright requires the `{}` destructuring pattern for fixtures without dependencies
    {
        files: ["fixtures/**/*.ts"],
        rules: { "no-empty-pattern": "off" },
    },

    // Playwright-specific rules for spec files
    {
        files: ["tests/**/*.ts"],
        ...playwright.configs["flat/recommended"],
        rules: {
            ...playwright.configs["flat/recommended"].rules,
            // Assertions are wrapped by the `assertion` fixture; the rule can't see through it.
            "playwright/expect-expect": "off",
            "playwright/no-wait-for-timeout": "error",
            "playwright/no-networkidle": "error",
        },
    },

    // Config / plain-JS tooling files don't need type-aware linting
    {
        files: ["*.mjs", "*.js"],
        ...tseslint.configs.disableTypeChecked,
    },

    prettier
);
