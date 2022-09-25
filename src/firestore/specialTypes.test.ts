import { documentReference, geoPoint, timestamp } from './specialTypes'
import { Timestamp, getFirestore, GeoPoint } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'
import {
	Timestamp as Timestamp_,
	GeoPoint as GeoPoint_,
	doc,
	getFirestore as getFirestore_,
} from 'firebase/firestore'
import { initializeApp as initializeApp_ } from 'firebase/app'
describe('test zod parse special type', () => {
	it('test timestamp', () => {
		expect(timestamp.safeParse(new Timestamp(123, 456)).success).toBe(true)
		expect(timestamp.safeParse(new Timestamp_(123, 456)).success).toBe(true)
	})

	it('test geoPoint', () => {
		expect(geoPoint.safeParse(new GeoPoint(0, 0)).success).toBe(true)
		expect(geoPoint.safeParse(new GeoPoint_(0, 0)).success).toBe(true)
	})

	it('test document reference', () => {
		initializeApp({ projectId: 'any' })
		initializeApp_({ projectId: 'any' })
		expect(documentReference.safeParse(getFirestore().doc('a/b')).success).toBe(
			true
		)
		expect(
			documentReference.safeParse(doc(getFirestore_(), 'a/b')).success
		).toBe(true)
	})
})
