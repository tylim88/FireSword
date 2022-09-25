import { primitiveMatchCases } from './primitiveTypeHandler'
import { wrappedUnion } from './unionTypeHandler'
import { z } from 'zod'

export const constructor = z.function()

export const genericMatchCases = {
	...primitiveMatchCases,
	...wrappedUnion,
}
