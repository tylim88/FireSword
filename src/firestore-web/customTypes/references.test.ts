import { zDocumentReference, zGeoPoint, zTimestamp } from './references'
import { Timestamp, GeoPoint, doc, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

initializeApp({ projectId: 'any' })
describe('test reference type', () => {
	it('test ', () => {
		expect(zTimestamp().safeParse(new Timestamp(123, 456)).success).toBe(true)
		expect(zGeoPoint().safeParse(new GeoPoint(0, 0)).success).toBe(true)
		expect(
			zDocumentReference().safeParse(doc(getFirestore(), 'a/b')).success
		).toBe(true)
	})
})
