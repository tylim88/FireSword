import { ZodFirstPartyTypeKind } from 'zod'
import { Handler, MatchCases, ObjectHandler } from './types'
import { primitiveTypeHandler } from './primitiveTypeHandler'
import { objectTypeHandler } from './objectTypeHandler'
import { combineMatchCaseArr } from './utils'

export const wrapWithZodTypeName = <
	T extends `${ZodFirstPartyTypeKind}`,
	Y extends Handler | ObjectHandler
>(
	zodTypename: T,
	handler: Y
) => {
	return { [zodTypename]: handler } as { [x in T]: Y }
}

const primitiveZodTypeName: `${ZodFirstPartyTypeKind}`[] = [
	'ZodString',
	'ZodBoolean',
	'ZodNull',
	'ZodNumber',
]

// generic
export const wrappedPrimitiveTypeHandler: MatchCases[] =
	primitiveZodTypeName.map(name =>
		wrapWithZodTypeName(name, primitiveTypeHandler)
	)

// basic wrappedObjectTypeHandler, not generic, for common's tests only
export const wrappedObjectTypeHandler = wrapWithZodTypeName(
	'ZodObject',
	objectTypeHandler
)

// basic wrappedAll, not generic, for common's tests only
export const wrappedAllHandler = [
	wrappedObjectTypeHandler,
	...wrappedPrimitiveTypeHandler,
]

// basic matchCases, not generic, for common's tests only
export const matchCases = combineMatchCaseArr(...wrappedAllHandler)
