import {
	filter,
	zDocumentReference,
	zGeoPoint,
	zTimestamp,
} from 'firesword/firestore'
import { z } from 'zod'
import { Timestamp, getFirestore, GeoPoint } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'

initializeApp({ projectId: 'any' })

const docRef = getFirestore().doc('a/b')
const ts = new Timestamp(0, 0)
const gp = new GeoPoint(0, 0)

const schema = z.object({
	z: z.object({
		a: z.union([z.string(), z.number(), zGeoPoint]),
		b: z.number(),
		c: z.object({
			e: z.null(),
			f: z.union([z.literal('abc'), z.literal('efg')]),
			g: z.array(
				z.object({ h: z.number(), i: z.string(), j: zDocumentReference })
			),
			l: zTimestamp,
		}),
		d: z.array(z.union([z.boolean(), z.number()])),
	}),
})
describe('test filter', () => {
	it('test data same as schema', () => {
		const data = {
			z: {
				a: gp,
				b: 123,
				c: { e: null, f: 'efg', g: [{ h: 123, i: 'abc', j: docRef }], l: ts },
				d: [1, 2, 3],
			},
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual(data)
	})

	it('test data same member but wrong value type', () => {
		const data = {
			z: {
				a: 123,
				b: ts,
				c: { e: docRef, f: [gp], g: null, l: 'abc' },
				d: ['a', 'b', 'c'],
			},
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual({
			z: {
				a: 123,
				b: ts,
				c: { e: docRef, f: [gp], g: [], l: 'abc' },
				d: ['a', 'b', 'c'],
			},
		})
	})

	it('test data with missing member ', () => {
		const data = {
			z: {
				b: ts,
				c: { e: docRef, f: [gp], g: [{ i: 123 }], l: 'abc' },
				d: ['a', 'b', 'c'],
			},
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual(data)
	})
	it('test data with extra member', () => {
		const data = {
			z: {
				a: 123,
				b: ts,
				c: { e: docRef, j: null, f: [gp], g: [{ h: 'abc', i: 123, k: true }] },
				d: ['a', 'b', 'c'],
				f: { g: { h: '123' } },
				i: 999,
			},
			m: { n: true },
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual({
			z: {
				a: 123,
				b: ts,
				c: { e: docRef, f: [gp], g: [{ h: 'abc', i: 123 }] },
				d: ['a', 'b', 'c'],
			},
		})
	})
})
