import { genericMatchCases } from './utils'
import { wrappedArrayTypeHandler } from './arrayTypeHandler'
import { toWrapObjectTypeHandler } from './objectTypeHandler'

// not generic. only for common's test
export const allMatchCases = {
	...genericMatchCases,
	...wrappedArrayTypeHandler,
	...toWrapObjectTypeHandler(),
}
