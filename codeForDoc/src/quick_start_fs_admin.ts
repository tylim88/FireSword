import {
	filter,
	zTimestamp,
	zDocumentReference,
	zGeoPoint,
	zArrayUnionAndRemove,
	zDelete,
	zIncrement,
} from 'firesword/firestore-admin'
import { z } from 'zod'
import { Timestamp, getFirestore, FieldValue } from 'firebase-admin/firestore'
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
	c: z.object({ d: zTimestamp(), e: zDocumentReference(), f: zGeoPoint() }),
	d: z.array(z.number()),
	e: z.array(
		z.object({
			i: z.boolean(),
			j: z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
		})
	),
	f: z.array(z.union([z.boolean(), z.number()])),
	g: zArrayUnionAndRemove(z.string()),
	h: z.union([zDelete(), z.number()]),
	i: z.union([zIncrement(), z.number()]),
	j: z.date(),
})

export const filteredData = filter({
	schema,
	data: {
		// 'a' is missing
		z: 'unknown member',
		b: 1,
		c: {
			d: new Timestamp(0, 0),
			e: getFirestore().doc('a/b'),
			// f is missing
			z: 'unknown member',
		},
		d: [100, 200, 300],
		e: [
			{
				i: true,
				// j is missing
			},
			{
				// i is missing
				j: 'a',
				z: 'unknown member',
			},
		],
		f: FieldValue.arrayRemove('abc'),
		g: FieldValue.delete(),
		h: FieldValue.increment(1),
		i: new Date(0),
	},
})

// console.log(filteredData)
// {
// 	b: 1,
// 	c: {
// 		d: new Timestamp(0, 0),
// 		e: doc(getFirestore(), 'a/b'),
// 	},
// 	d: [100, 200, 300],
// 	e: [{ i: true }, { j: 'a' }],
//  f: arrayRemove('abc'),
//  g: deleteField(),
//  h: increment(1),
//  i: new Date(0),
// }
