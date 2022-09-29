import { objectTypeHandler } from './objectTypeHandler'
import { boolean, z } from 'zod'
import { genericMatchCases as matchCases } from './utils'
import { isEqualWith } from 'lodash'

const schema = z.object({
	a: z.string(),
	b: z.number(),
	c: z.object({ e: z.null(), f: z.object({ g: z.literal(1) }) }),
})

describe('test objectTypeHandler', () => {
	it('test isEqualWith comparing 2 schema', () => {
		expect(isEqualWith(schema, schema)).toBe(true)
		expect(
			isEqualWith(schema, {
				a: z.string(),
				b: z.number(),
				c: z.object({ e: z.null(), f: z.object({ g: z.literal(2) }) }),
			})
		).toBe(false)
	})
	it('test data same as schema', () => {
		const newObj = {}
		const upperLevelData = {
			z: { a: 'abc', b: 123, c: { e: null, f: { g: 1 } } },
		}

		objectTypeHandler({
			schema,
			matchCases,
			upperLevelClonedData: newObj,
			upperLevelData,
			key: 'z',
			exemptedObjectSchemas: [],
		})

		expect(newObj).toEqual(upperLevelData)
	})

	it('test data same member but wrong value type', () => {
		const newObj = {}

		const upperLevelData = { z: { a: 123, b: 'abc', c: { e: true, f: 'h' } } }

		objectTypeHandler({
			schema,
			matchCases,
			upperLevelClonedData: newObj,
			upperLevelData,
			key: 'z',
			exemptedObjectSchemas: [],
		})

		expect(newObj).toEqual({ z: { c: {} } })
	})

	it('test data with missing member', () => {
		const newObj = {}

		const upperLevelData = {
			z: {
				a: 'abc',
				c: { e: null },
			},
		}

		objectTypeHandler({
			schema,
			matchCases,
			upperLevelClonedData: newObj,
			upperLevelData,
			key: 'z',
			exemptedObjectSchemas: [],
		})
		expect(newObj).toEqual({ z: { a: 'abc', c: { e: null } } })
	})

	it('test data with  extra member', () => {
		const newObj = {}

		const upperLevelData = {
			z: {
				a: 'abc',
				b: 123,
				c: { e: null, j: null, f: { g: 1 } },
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
			exemptedObjectSchemas: [],
		})
		expect(newObj).toEqual({
			z: { a: 'abc', b: 123, c: { e: null, f: { g: 1 } } },
		})
	})
})
