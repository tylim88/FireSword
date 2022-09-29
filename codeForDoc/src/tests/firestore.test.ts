import { z } from 'zod'
import {
	zDocumentReference,
	zGeoPoint,
	zTimestamp,
	zArrayUnionAndRemove,
	zDelete,
	zIncrement,
	zServerTimestamp,
	filter,
} from 'firesword/firestore-admin'
import {
	Timestamp,
	getFirestore,
	GeoPoint,
	FieldValue,
} from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'

initializeApp({ projectId: 'any' })

const docRef = getFirestore().doc('a/b')
const ts = new Timestamp(0, 0)
const gp = new GeoPoint(0, 0)

const schema = z.object({
	a: z.union([z.string(), z.number(), zGeoPoint()]),
	b: zServerTimestamp(),
	c: z.object({
		e: z.null(),
		f: z.union([z.literal('abc'), z.literal('efg')]),
		g: z.array(
			z.object({ h: z.number(), i: z.string(), j: zDocumentReference() })
		),
		l: zTimestamp(),
	}),
	d: z.array(z.union([z.boolean(), z.number()])),
	e: zArrayUnionAndRemove(z.string()),
	f: z.union([zDelete(), z.number()]),
	g: z.union([zIncrement(), z.number()]),
	h: z.date(),
})
describe('test filter', () => {
	it('test data same as schema', () => {
		const data = {
			a: gp,
			b: FieldValue.serverTimestamp(),
			c: { e: null, f: 'efg', g: [{ h: 123, i: 'abc', j: docRef }], l: ts },
			d: [1, 2, 3],
			e: FieldValue.arrayRemove('abc'),
			f: FieldValue.delete(),
			g: FieldValue.increment(1),
			h: new Date(0),
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual(data)
	})

	it('test data same member but wrong value type', () => {
		const data = {
			a: null,
			b: ts,
			c: { e: docRef, f: [gp], g: null, l: 'abc' },
			d: ['a', 123, 'c'],
			e: FieldValue.arrayRemove(1),
			f: FieldValue.increment(1),
			g: new Date(0),
			h: FieldValue.arrayRemove(['abc']),
		}
		const newObj = filter({
			schema,
			data,
		})
		expect(newObj).toEqual({
			c: {},
			d: [, 123],
		})
	})
	it('test data with missing member ', () => {
		const data = {
			a: gp,
			c: { e: null, f: 'efg', g: [{ h: 123, j: docRef }] },
			d: [1, 2, 3],
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual(data)
	})
	it('test data with extra member', () => {
		const data = {
			a: gp,
			b: FieldValue.serverTimestamp(),
			c: {
				e: null,
				f: 'efg',
				g: [{ h: 123, i: 'abc', j: docRef, x: true }],
				l: ts,
			},
			d: [1, 2, 3],
			e: FieldValue.arrayRemove('abc'),
			f: FieldValue.delete(),
			g: FieldValue.increment(1),
			h: new Date(0),
			x: { g: { h: '123' } },
			y: 999,
			m: { n: true },
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual({
			a: gp,
			b: FieldValue.serverTimestamp(),
			c: {
				e: null,
				f: 'efg',
				g: [{ h: 123, i: 'abc', j: docRef }],
				l: ts,
			},
			d: [1, 2, 3],
			e: FieldValue.arrayRemove('abc'),
			f: FieldValue.delete(),
			g: FieldValue.increment(1),
			h: new Date(0),
		})
	})
})
