import { primitiveMatchCases } from './primitiveTypeHandler'
import { wrappedUnion } from './unionTypeHandler'
import { z } from 'zod'
import { MatchCases } from './types'

export const constructor = z.function()

export const genericMatchCases: MatchCases = {
	...primitiveMatchCases,
	...wrappedUnion,
}
