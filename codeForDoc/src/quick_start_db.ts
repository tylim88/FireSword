import { filter, zTimestamp } from 'firesword/database'
import { z } from 'zod'

// {
// 	a: string
// 	b: 1 | 2 | 3
// 	g: serverTimestamp[]
// 	h: { i: boolean; j: 'a' | 'b' | 'c' }[]
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	g: z.array(zTimestamp),
	h: z.array(
		z.object({
			i: z.boolean(),
			j: z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
		})
	),
})

export const filteredData = filter({
	schema,
	data: {
		z: 'unknown member',
		b: 1,
		g: [5276471267, 924721744, 23712938],
		h: [{ i: true }, { j: 'a', z: 'unknown member' }],
	},
})

// console.log(filteredData)
// {
// 	b: 1,
// 	g: [5276471267, 924721744, 23712938],
// 	h: [{ i: true }, { j: 'a' }],
// }
