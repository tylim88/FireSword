import { filteredData } from './filtered_data_static_typing'
import {
	zDocumentReference,
	zGeoPoint,
	zTimestamp,
} from 'firesword/firestore-web'

describe('filtered_data_static_typing', () => {
	it('check value', () => {
		const { d, e, f } = filteredData
		expect(zTimestamp().safeParse(d).success).toBe(true)
		expect(zDocumentReference().safeParse(e).success).toBe(true)
		expect(zGeoPoint().safeParse(f).success).toBe(true)
	})
})
