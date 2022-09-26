import {
	filter,
	zTimestamp,
	zDocumentReference,
	zGeoPoint,
} from 'firesword/firestore'
import { z } from 'zod'
import {
	Timestamp,
	doc,
	GeoPoint,
	DocumentReference,
	getFirestore,
} from 'firebase/firestore' // also work with admin sdk.
import { initializeApp } from 'firebase/app'

initializeApp({ projectId: 'any' })

// {
// 	d: Timestamp
// 	e: DocumentReference
// 	f: GeoPoint
// }
const schema = z.object({ d: zTimestamp, e: zDocumentReference, f: zGeoPoint })

export const filteredData = filter({
	schema,
	data: {
		d: new Timestamp(0, 0),
		e: doc(getFirestore(), 'a/b'),
		f: new GeoPoint(0, 0),
	},
}) as unknown as {
	d: Timestamp
	e: DocumentReference
	f: GeoPoint
}
