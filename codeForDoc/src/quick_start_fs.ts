import {
	filter,
	zTimestamp,
	zDocumentReference,
	zGeoPoint,
} from 'firesword/firestore'
import { z } from 'zod'
import { Timestamp, getFirestore } from 'firebase-admin/firestore' // also work with web sdk.
import { initializeApp } from 'firebase-admin/app'

initializeApp({ projectId: 'any' })

// {
// 	a: string
// 	b: 1 | 2 | 3
// 	c: {
// 		d: Timestamp
// 		e: DocumentReference
// 		f: GeoPoint
// 	}
// 	g: number[]
// 	h: { i: boolean; j: 'a' | 'b' | 'c' }[]
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	c: z.object({ d: zTimestamp, e: zDocumentReference, f: zGeoPoint }),
	g: z.array(z.number()),
	h: z.array(
		z.object({
			i: z.boolean(),
			j: z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
		})
	),
})

export const filteredData = filter({
	schema,
	data: {
		z: 'unknown member',
		b: 1,
		c: {
			d: new Timestamp(0, 0),
			e: getFirestore().doc('a/b'),
			z: 'unknown member',
		},
		g: [100, 200, 300],
		h: [{ i: true }, { j: 'a', z: 'unknown member' }],
	},
})

console.log(filteredData)
// {
// 	b: 1,
// 	c: {
// 		d: new Timestamp(0, 0),
// 		e: getFirestore().doc('a/b'),
// 	},
// 	g: [100, 200, 300],
// 	h: [{ i: true }, { j: 'a' }],
// }
