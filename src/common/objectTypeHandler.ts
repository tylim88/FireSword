import { Handler, Schema, HandlerRef } from './types'
import { ZodObject, ZodRawShape, z } from 'zod'
import { wrapWithZodTypeName } from './wrapper'

export const objectTypeHandler: Handler = ({
	upperLevelData,
	upperLevelClonedData,
	key,
	schema,
	matchCases,
	exemptedObjectSchemas,
}) => {
	if (z.object({}).safeParse(upperLevelData[key]).success) {
		const schema_ = schema as ZodObject<ZodRawShape>
		const shape = schema_._def.shape()

		const found = exemptedObjectSchemas
			.map(expSch => {
				if (
					JSON.stringify(Object.keys(shape)) ===
					JSON.stringify(Object.keys(expSch._def.shape()))
				) {
					return schema_
				} else {
					return undefined
				}
			})
			.filter(sch => sch !== undefined)

		if (found.length > 0) {
			found.forEach(sch => {
				if (sch?.safeParse(upperLevelData[key]).success) {
					upperLevelClonedData[key] = upperLevelData[key]
				}
			})
			return
		}
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
					exemptedObjectSchemas,
				})
			}
		}
	}
}

export const wrappedObjectTypeHandler = wrapWithZodTypeName(
	'ZodObject',
	(ref: HandlerRef) => objectTypeHandler(ref)
)
