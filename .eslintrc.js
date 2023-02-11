module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/typescript',
		'plugin:import/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:json/recommended',
		'plugin:markdown/recommended',
		'plugin:yml/prettier',
	],
	parser: '@typescript-eslint/parser',
	ignorePatterns: [
		'codeForDoc/**/*',
		'dist/**/*', // Ignore built files.
		'babel.configESM.js',
	],
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'no-sparse-arrays': 'off',
		'import/named': 'off',
		'import/no-unresolved': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off', // explicit function return type
		'@typescript-eslint/no-explicit-any': 'off',
		camelcase: 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-empty-function': 'warn',
		'spaced-comment': 'error',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
	},
}
