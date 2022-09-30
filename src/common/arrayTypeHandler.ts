import { Handler, Schema } from './types'
import { ZodArray } from 'zod'
import { wrapWithZodTypeName } from './wrapper'

// test together with filter
export const arrayTypeHandler: Handler = ({
	upperLevelData,
	upperLevelClonedData,
	key,
	schema,
	matchCases,
	exemptedObjectSchemas,
}) => {
	const schema_ = schema as ZodArray<Schema>
	const newSchema = schema_._def.type
	const newUpperLevelData = upperLevelData[key]
	if (Array.isArray(newUpperLevelData)) {
		const newUpperLevelClonedData = (upperLevelClonedData[key] = [])
		newUpperLevelData.forEach((item, index) => {
			matchCases[newSchema._def.typeName]!({
				upperLevelData: newUpperLevelData,
				upperLevelClonedData: newUpperLevelClonedData,
				key: index,
				schema: newSchema,
				matchCases,
				exemptedObjectSchemas,
				typeOfUpperLevelData: 'array',
			})
		})
	}
}

export const wrappedArrayTypeHandler = wrapWithZodTypeName(
	'ZodArray',
	arrayTypeHandler
)
