import { z } from 'zod'

export const a = z.union([z.object({ a: z.number() }), z.boolean()])
export const b = z.object({ a: z.object({ a: 1 }) })
console.log(a._def)
