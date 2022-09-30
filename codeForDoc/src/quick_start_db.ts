import { filter, zServerTimestamp, zIncrement } from 'firesword/database'
import { z } from 'zod'
import { serverTimestamp, increment } from 'firebase/database'
// {
// 	a: string
// 	b: number
// 	g: serverTimestamp[]
// 	h: { i: boolean; j: 'a' | 'b' | 'c' }[]
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.number(), zIncrement()]),
	g: z.array(zServerTimestamp()),
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
		// missing 'a'
		z: 'unknown member',
		b: increment(1),
		g: [serverTimestamp(), serverTimestamp(), serverTimestamp()],
		h: [
			{
				i: true,
				// missing j
			},
			{
				// missing i
				j: 'a',
				z: 'unknown member',
			},
		],
	},
})

// console.log(filteredData)
// {
// 	b: increment(1),
// 	g: [ServerTimestamp, ServerTimestamp, ServerTimestamp],
// 	h: [{ i: true }, { j: 'a' }],
// }
