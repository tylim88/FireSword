import { ZodFirstPartyTypeKind } from 'zod'
import { Handler, MatchCases, ObjectHandler } from './types'
import { primitiveTypeHandler } from './primitiveTypeHandler'
import { unionTypeHandler } from './unionTypeHandler'
import { arrayTypeHandler } from './arrayTypeHandler'

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
	'ZodLiteral',
]

// generic
export const wrappedGenericTypeHandler: MatchCases[] = [
	...primitiveZodTypeName.map(name =>
		wrapWithZodTypeName(name, primitiveTypeHandler)
	),
	wrapWithZodTypeName('ZodUnion', unionTypeHandler),
	wrapWithZodTypeName('ZodArray', arrayTypeHandler),
]
