/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const sharedConfig = require('../jest.config.js')
module.exports = {
	...sharedConfig,
	collectCoverage: false,
	resolver: 'jest-node-exports-resolver',
	transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)'],
}
