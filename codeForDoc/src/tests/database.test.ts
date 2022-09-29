import { z } from 'zod'
import { zIncrement, zServerTimestamp, filter } from 'firesword/database'
import { ServerValue } from 'firebase-admin/database'

const schema = z.object({
	z: z.object({
		a: z.union([z.string(), z.number()]),
		b: z.number(),
		c: z.object({
			e: z.null(),
			f: z.union([z.literal('abc'), z.literal('efg')]),
			g: zServerTimestamp(),
			h: zIncrement(),
		}),
	}),
})
describe('test filter', () => {
	it('test data same as schema', () => {
		const data = {
			z: {
				a: 'abc',
				b: 123,
				c: {
					e: null,
					f: 'efg',
					g: ServerValue.TIMESTAMP,
					h: ServerValue.increment(1),
				},
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
				a: null,
				b: 'abc',
				c: { e: true, f: 123, g: null, h: 'abc' },
			},
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual({
			z: {
				c: {},
			},
		})
	})

	it('test data with missing member ', () => {
		const data = {
			z: {
				a: 'abc',
				c: {
					f: 'efg',
					h: ServerValue.increment(1),
				},
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
				a: 'abc',
				b: 123,
				c: {
					e: null,
					f: 'efg',
					g: ServerValue.TIMESTAMP,
					h: ServerValue.increment(1),
					z: null,
					i: true,
					j: 123,
					k: 1,
				},
				f: { g: { h: '123' } },
				k: 999,
			},
			m: { n: true },
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual({
			z: {
				a: 'abc',
				b: 123,
				c: {
					e: null,
					f: 'efg',
					g: ServerValue.TIMESTAMP,
					h: ServerValue.increment(1),
				},
			},
		})
	})
})
