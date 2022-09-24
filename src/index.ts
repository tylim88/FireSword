export * from './common/filter'

import { z } from 'zod'

export const a = z.union([z.object({ a: z.number() }), z.boolean()])
export const b = z.object({ a: z.number() })
console.log(b._def)
