import { filteredData } from './dealing_with_incorrect_data_type'

describe('dealing_with_incorrect_data_type', () => {
	it('check value', () => {
		expect(filteredData).toEqual({
			a: true,
			b: {},
			g: {},
			h: [],
		})
	})
})
