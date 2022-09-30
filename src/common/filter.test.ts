import { filter } from './filter'
import { z } from 'zod'
import { genericMatchCases as matchCases } from './utils'

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
	x: z.object({ y: z.literal('123') }),
})
describe('test filter', () => {
	it('top level is not object', () => {
		expect(
			filter(
				// @ts-expect-error
				'a'
			)
		).toEqual({})
	})
	it('test data same as schema', () => {
		const data = {
			z: {
				a: 'abc',
				b: 123,
				c: { e: null, f: 'efg', g: [{ h: 123, i: 'abc' }] },
				d: [1, 2, 3],
			},
			x: { y: '123' },
		}

		const newObj = filter(
			{
				schema,
				data,
				exemptedObjectSchemas: [],
			},
			matchCases
		)
		expect(newObj).toEqual(data)
	})

	it('test data same member but wrong value type', () => {
		const data = {
			z: {
				a: {},
				b: 'abc',
				c: { e: true, f: 123, g: null },
				d: ['a', 2, 'c', 4],
			},
			x: 123,
		}

		const newObj = filter(
			{
				schema,
				data,
				exemptedObjectSchemas: [],
			},
			matchCases
		)

		expect(newObj).toEqual({
			z: {
				c: {},
				d: [null, 2, null, 4],
			},
		})
	})

	it('test data with missing member ', () => {
		const data = {
			z: {
				a: 'abc',
				c: { e: null, g: [{ h: 123 }] },
				d: [1, 2, 3],
			},
			x: {},
		}

		const newObj = filter(
			{
				schema,
				data,
				exemptedObjectSchemas: [],
			},
			matchCases
		)

		expect(newObj).toEqual({
			z: {
				a: 'abc',
				c: { e: null, g: [{ h: 123 }] },
				d: [1, 2, 3],
			},
			x: {},
		})
	})
	it('test data with extra member', () => {
		const data = {
			z: {
				a: 'abc',
				b: 123,
				c: { e: null, j: null, f: 'efg', g: [{ h: 123, i: 'abc', k: true }] },
				d: [1, 2, 3],
				f: { g: { h: '123' } },
			},
			x: { y: '123' },
			m: { n: true },
		}

		const newObj = filter(
			{
				schema,
				data,
				exemptedObjectSchemas: [],
			},
			matchCases
		)

		expect(newObj).toEqual({
			z: {
				a: 'abc',
				b: 123,
				c: { e: null, f: 'efg', g: [{ h: 123, i: 'abc' }] },
				d: [1, 2, 3],
			},
			x: { y: '123' },
		})
	})
})
