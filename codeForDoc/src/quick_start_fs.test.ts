import { filteredData } from './quick_start_fs'
import { Timestamp, getFirestore } from 'firebase-admin/firestore'

describe('quick_start_db', () => {
	it('check value', () => {
		expect(filteredData).toEqual({
			b: 1,
			c: {
				d: new Timestamp(0, 0),
				e: getFirestore().doc('a/b'),
			},
			g: [100, 200, 300],
			h: [{ i: true }, { j: 'a' }],
		})
	})
})
