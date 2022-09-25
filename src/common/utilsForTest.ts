import { objectTypeHandler } from './objectTypeHandler'
import { combineMatchCaseArr } from './utils'
import { wrapWithZodTypeName, wrappedGenericTypeHandler } from './wrapper'

// basic wrappedObjectTypeHandler, not generic, for common's tests only
export const wrappedObjectTypeHandler = wrapWithZodTypeName(
	'ZodObject',
	objectTypeHandler
)

// basic wrappedAll, not generic, for common's tests only
export const wrappedAllHandler = [
	wrappedObjectTypeHandler,
	...wrappedGenericTypeHandler,
]

// basic matchCases, not generic, for common's tests only
export const matchCases = combineMatchCaseArr(...wrappedAllHandler)
