import { Handler, Schema } from './types'
import { ZodUnion } from 'zod'
import { wrapWithZodTypeName } from './wrapper'

// does not work with object-any union or array-any union
// test together with filter
export const unionTypeHandler: Handler = ({
	upperLevelData,
	upperLevelClonedData,
	key,
	schema,
	matchCases,
}) => {
	if (Object.prototype.hasOwnProperty.call(upperLevelData, key)) {
		const schema_ = schema as ZodUnion<readonly [Schema, ...Schema[]]>
		const options = schema_._def.options
		options.forEach(option => {
			matchCases[option._def.typeName]!({
				upperLevelData: upperLevelData,
				upperLevelClonedData,
				key: key,
				schema: option,
				matchCases,
			})
		})
	}
}

export const wrappedUnion = wrapWithZodTypeName('ZodUnion', unionTypeHandler)
