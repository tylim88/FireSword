import { filter } from './database'
import { boolean, z } from 'zod'

const schema = z.object({
	z: z.object({
		a: z.union([z.string(), z.number()]),
		b: z.number(),
		c: z.object({
			e: z.null(),
			f: z.union([z.literal('abc'), z.literal('efg')]),
		}),
	}),
})
describe('test filter', () => {
	it('test data same as schema', () => {
		const data = {
			z: {
				a: 'abc',
				b: 123,
				c: { e: null, f: 'efg' },
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
				b: 'abc',
				c: { e: true, f: 123 },
			},
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual({
			z: {
				a: 123,
				b: 'abc',
				c: { e: true, f: 123 },
			},
		})
	})

	it('test data with missing member ', () => {
		const data = {
			z: {
				a: 123,
				c: { e: true },
			},
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual({
			z: { a: 123, c: { e: true } },
		})
	})
	it('test data with extra member', () => {
		const data = {
			z: {
				a: 123,
				b: 'abc',
				c: { e: true, j: null, f: 123 },
				f: { g: { h: '123' } },
				i: 999,
			},
			m: { n: boolean },
		}

		const newObj = filter({
			schema,
			data,
		})

		expect(newObj).toEqual({
			z: {
				a: 123,
				b: 'abc',
				c: { e: true, f: 123 },
			},
		})
	})
})
