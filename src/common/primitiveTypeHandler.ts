import { Handler, MatchCases } from './types'
import { wrapWithZodTypeName } from './wrapper'

export const primitiveTypeHandler: Handler = ({
	upperLevelData,
	upperLevelClonedData,
	key,
}) => {
	upperLevelClonedData[key] = upperLevelData[key]
}

export const primitiveMatchCases = (
	['ZodString', 'ZodBoolean', 'ZodNull', 'ZodNumber', 'ZodLiteral'] as const
).reduce((acc, item) => {
	return { ...acc, ...wrapWithZodTypeName(item, primitiveTypeHandler) }
}, {} as MatchCases)
