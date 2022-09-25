export * from './common/filter'

import { z } from 'zod'

export const a = z.union([z.object({ a: z.number() }), z.boolean()])
export const b = z.object({ a: z.number() })
export const c = z.array(z.string())
console.log(c._def.type)
