import { objectTypeHandler } from './objectTypeHandler'
import { boolean, z } from 'zod'
import { matchCases } from './wrapper'

const schema = z.object({
	a: z.string(),
	b: z.number(),
	c: z.object({ e: z.null() }),
})
describe('test objectTypeHandler', () => {
	it('test data same as schema', () => {
		const newObj = {}
		const upperLevelData = { z: { a: 'abc', b: 123, c: { e: null } } }

		objectTypeHandler({
			schema,
			matchCases,
			upperLevelClonedData: newObj,
			upperLevelData,
			key: 'z',
		})

		expect(newObj).toEqual(upperLevelData)
	})

	it('test data same member but value different', () => {
		const newObj = {}

		const upperLevelData = { z: { a: 123, b: 'abc', c: { e: true } } }

		objectTypeHandler({
			schema,
			matchCases,
			upperLevelClonedData: newObj,
			upperLevelData,
			key: 'z',
		})

		expect(newObj).toEqual(upperLevelData)
	})

	it('test data with missing member and extra member', () => {
		const newObj = {}

		const upperLevelData = {
			z: {
				a: 123,

				c: { j: null },
				f: { g: { h: '123' } },
				i: 999,
			},
			m: { n: boolean },
		}

		objectTypeHandler({
			schema,
			matchCases,
			upperLevelClonedData: newObj,
			upperLevelData,
			key: 'z',
		})
		expect(newObj).toEqual({ z: { a: 123, c: {} } })
	})
})
