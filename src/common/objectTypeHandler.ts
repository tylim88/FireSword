import { ObjectHandler, Schema } from './types'
import { ZodObject, ZodRawShape } from 'zod'

export const objectTypeHandler: ObjectHandler = (
	{ upperLevelData, upperLevelClonedData, key, schema, matchCases },
	specialValueCallback
) => {
	if (Object.prototype.hasOwnProperty.call(upperLevelData, key)) {
		if (
			specialValueCallback?.({
				upperLevelData,
				upperLevelClonedData,
				key,
				schema,
				matchCases,
			})
		)
			return

		const schema_ = schema as ZodObject<ZodRawShape>
		const shape = schema_._def.shape()
		const newUpperLevelClonedData = (upperLevelClonedData[key] = {})
		for (const newKey in shape) {
			if (Object.prototype.hasOwnProperty.call(upperLevelData[key], newKey)) {
				const newSchema = shape[newKey] as Schema
				matchCases[newSchema._def.typeName]!({
					upperLevelData: upperLevelData[key],
					upperLevelClonedData: newUpperLevelClonedData,
					key: newKey,
					schema: newSchema,
					matchCases,
				})
			}
		}
	}
}
