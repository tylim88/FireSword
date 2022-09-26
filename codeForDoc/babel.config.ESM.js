'use strict'

const { transform } = require('@babel/core')
const jestPreset = require('@babel/preset-typescript')

module.exports = {
	process(src, filename) {
		const result = transform(src, {
			filename,
			presets: [jestPreset],
		})

		return result || src
	},
}
