import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import vitest from 'eslint-plugin-vitest'

export default tseslint.config(
    {ignores: ['dist']},
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, ...vitest.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            '@typescript-eslint/no-unused-expressions': 'off',
            "vitest/expect-expect": "off",
            'react-refresh/only-export-components': [
                'warn',
                {allowConstantExport: true},
            ],
        },
        globals: {
            ...vitest.environments.env.globals,
        },
    },
)
