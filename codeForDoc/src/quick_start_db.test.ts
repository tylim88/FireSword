import { filteredData } from './quick_start_db'
import { serverTimestamp, increment } from 'firebase/database'

describe('quick_start_db', () => {
	it('check value', () => {
		expect(filteredData).toEqual({
			b: increment(1),
			g: [serverTimestamp(), serverTimestamp(), serverTimestamp()],
			h: [{ i: true }, { j: 'a' }],
		})
	})
})
