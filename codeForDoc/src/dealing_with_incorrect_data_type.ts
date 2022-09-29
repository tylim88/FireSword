import { filter, zArrayUnionAndRemove } from 'firesword/firestore-web'
import { number, z } from 'zod'
import { arrayUnion } from 'firebase/firestore'
// {
// 	a: string
// 	b: 1 | 2 | 3
// 	g: { x: number, y: null }
// 	h: boolean[]
//  i: zArrayUnionAndRemove(string)
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	g: z.object({ x: z.number(), y: z.null() }),
	h: z.array(z.boolean()),
	i: zArrayUnionAndRemove(z.string()),
	j: z.array(
		z.object({ x: z.number(), y: z.object({ a: z.null(), b: z.number() }) })
	),
})

export const filteredData = filter({
	schema,
	data: {
		a: true, // expect string
		b: {}, // expect 1 | 2 | 3
		g: 1, // expect { x:number, y:null }
		h: null, // expect boolean[]
		i: arrayUnion(1), // expect arrayUnion(string)
		j: [{ x: 'abc', y: { a: null, b: 'abc' } }], // expect number for 'x' and 'b'
	},
})
// console.log(filteredData) // { j:[{y: { a:null }}] }

export const filteredData2 = filter({
	schema,
	data: {
		g: { a: {}, b: true, c: 'abc' }, // { x:number, y:null }
		h: [1, true, 3], // expect boolean[], only the 2nd element is correct
	},
})
// console.log(filteredData2) // { g: {}, h: [empty,true,empty] }
