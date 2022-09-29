import { primitiveMatchCases } from './primitiveTypeHandler'
import { wrappedUnion } from './unionTypeHandler'
import { z } from 'zod'
import { MatchCases } from './types'
import { wrappedObjectTypeHandler } from './objectTypeHandler'
import { wrappedArrayTypeHandler } from './arrayTypeHandler'

export const constructor = z.function()

export const genericMatchCases: MatchCases = {
	...primitiveMatchCases,
	...wrappedObjectTypeHandler,
	...wrappedUnion,
	...wrappedArrayTypeHandler,
}
