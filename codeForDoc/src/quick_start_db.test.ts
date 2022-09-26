import { filteredData } from './quick_start_db'

describe('quick_start_db', () => {
	it('check value', () => {
		expect(filteredData).toEqual({
			b: 1,
			g: [5276471267, 924721744, 23712938],
			h: [{ i: true }, { j: 'a' }],
		})
	})
})
