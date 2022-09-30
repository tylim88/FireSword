import { Handler, MatchCases } from './types'
import { wrapWithZodTypeName } from './wrapper'

export const primitiveTypeHandler: Handler = ({
	upperLevelData,
	upperLevelClonedData,
	key,
	schema,
	typeOfUpperLevelData,
}) => {
	if (schema.safeParse(upperLevelData[key]).success) {
		upperLevelClonedData[key] = upperLevelData[key]
	} else if (typeOfUpperLevelData === 'array') {
		upperLevelClonedData[key] = null
	}
}

export const primitiveMatchCases = (
	['ZodString', 'ZodBoolean', 'ZodNull', 'ZodNumber', 'ZodLiteral'] as const
).reduce((acc, item) => {
	return { ...acc, ...wrapWithZodTypeName(item, primitiveTypeHandler) }
}, {} as MatchCases)
