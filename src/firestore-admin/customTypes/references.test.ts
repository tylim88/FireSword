import { zDocumentReference, zGeoPoint, zTimestamp } from './references'
import { Timestamp, getFirestore, GeoPoint } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'

initializeApp({ projectId: 'any' })
describe('test reference', () => {
	it('test ', () => {
		expect(zTimestamp().safeParse(new Timestamp(123, 456)).success).toBe(true)
		expect(
			zDocumentReference().safeParse(getFirestore().doc('a/b')).success
		).toBe(true)
		expect(zGeoPoint().safeParse(new GeoPoint(0, 0)).success).toBe(true)
	})
})
