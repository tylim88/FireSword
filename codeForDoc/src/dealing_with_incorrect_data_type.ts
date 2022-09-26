import { filter } from 'firesword/firestore'
import { z } from 'zod'

// {
// 	a: string
// 	b: 1 | 2 | 3
// 	g: { x: number, y: null }
// 	h: boolean[]
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	g: z.object({ x: z.number(), y: z.null() }),
	h: z.array(z.boolean()),
})

export const filteredData = filter({
	schema,
	data: {
		a: true, // expect string
		b: {}, // expect 1 | 2 | 3
		g: 1, // expect object
		h: null, // expect array of boolean
	},
})

// console.log(filteredData)
// {
// 	a: true, // data does not change
// 	b: {}, // data does not change
// 	g: {}, // replace with empty object
// 	h: [], // replace with empty array
// }
