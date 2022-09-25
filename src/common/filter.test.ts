import { filter } from './filter'
import { boolean, z } from 'zod'
import { wrappedAllHandler } from './utilsForTest'

const schema = z.object({
	z: z.object({
		a: z.union([z.string(), z.number()]),
		b: z.number(),
		c: z.object({
			e: z.null(),
			f: z.union([z.literal('abc'), z.literal('efg')]),
			g: z.array(z.object({ h: z.number(), i: z.string() })),
		}),
		d: z.array(z.union([z.boolean(), z.number()])),
	}),
})
describe('test filter', () => {
	it('test data same as schema', () => {
		const data = {
			z: {
				a: 'abc',
				b: 123,
				c: { e: null, f: 'efg', g: [{ h: 123, i: 'abc' }] },
				d: [1, 2, 3],
			},
		}

		const newObj = filter(
			{
				schema,
				data,
			},
			...wrappedAllHandler
		)

		expect(newObj).toEqual(data)
	})

	it('test data same member but wrong value type', () => {
		const data = {
			z: {
				a: 123,
				b: 'abc',
				c: { e: true, f: 123, g: null },
				d: ['a', 'b', 'c'],
			},
		}

		const newObj = filter(
			{
				schema,
				data,
			},
			...wrappedAllHandler
		)

		expect(newObj).toEqual({
			z: {
				a: 123,
				b: 'abc',
				c: { e: true, f: 123, g: [] },
				d: ['a', 'b', 'c'],
			},
		})
	})

	it('test data with missing member ', () => {
		const data = {
			z: {
				a: 123,
				c: { e: true, g: [{ i: 123 }] },
				d: ['a', 'b', 'c'],
			},
		}

		const newObj = filter(
			{
				schema,
				data,
			},
			...wrappedAllHandler
		)

		expect(newObj).toEqual({
			z: { a: 123, c: { e: true, g: [{ i: 123 }] }, d: ['a', 'b', 'c'] },
		})
	})
	it('test data with extra member', () => {
		const data = {
			z: {
				a: 123,
				b: 'abc',
				c: { e: true, j: null, f: 123, g: [{ h: 'abc', i: 123, k: true }] },
				d: ['a', 'b', 'c'],
				f: { g: { h: '123' } },
				i: 999,
			},
			m: { n: boolean },
		}

		const newObj = filter(
			{
				schema,
				data,
			},
			...wrappedAllHandler
		)

		expect(newObj).toEqual({
			z: {
				a: 123,
				b: 'abc',
				c: { e: true, f: 123, g: [{ h: 'abc', i: 123 }] },
				d: ['a', 'b', 'c'],
			},
		})
	})
})
