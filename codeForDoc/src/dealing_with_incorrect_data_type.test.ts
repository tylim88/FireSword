import { filteredData, filteredData2 } from './dealing_with_incorrect_data_type'

describe('dealing_with_incorrect_data_type', () => {
	it('check value', () => {
		expect(filteredData).toEqual({ j: [{ y: { a: null } }] })
		expect(filteredData2).toEqual({ g: {}, h: [, true] })
	})
})
