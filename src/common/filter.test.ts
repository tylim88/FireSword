import { filter } from './filter'
import { boolean, z } from 'zod'
import { wrappedAllHandler } from './wrapper'

const schema = z.object({
	z: z.object({
		a: z.string(),
		b: z.number(),
		c: z.object({ e: z.null() }),
	}),
})
describe('test filter', () => {
	it('test data same as schema', () => {
		const data = { z: { a: 'abc', b: 123, c: { e: null } } }

		const newObj = filter(
			{
				schema,
				data,
			},
			...wrappedAllHandler
		)

		expect(newObj).toEqual(data)
	})

	it('test data same member but value different', () => {
		const data = { z: { a: 123, b: 'abc', c: { e: true } } }

		const newObj = filter(
			{
				schema,
				data,
			},
			...wrappedAllHandler
		)

		expect(newObj).toEqual(data)
	})

	it('test data with missing member and extra member', () => {
		const data = {
			z: {
				a: 123,
				b: 'abc',
				c: { e: true, j: null },
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

		expect(newObj).toEqual({ z: { a: 123, b: 'abc', c: { e: true } } })
	})
})
