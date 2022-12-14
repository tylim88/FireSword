/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const sharedConfig = require('./jest.config.js')
module.exports = {
	...sharedConfig,
	collectCoverage: false,
	transform: {
		'^.+\\.(js|ts)$': './babel.config.ESM.js',
	},
}
