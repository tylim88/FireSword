import { ObjectHandler, Schema, HandlerRef } from './types'
import { ZodObject, ZodRawShape } from 'zod'
import { wrapWithZodTypeName } from './wrapper'

export const objectTypeHandler: ObjectHandler = (
	{ upperLevelData, upperLevelClonedData, key, schema, matchCases },
	...exemptedObjectSchemas
) => {
	const schema_ = schema as ZodObject<ZodRawShape>
	const shape = schema_._def.shape()
	if (Object.prototype.hasOwnProperty.call(upperLevelData, key)) {
		if (
			exemptedObjectSchemas.some(sch => {
				return (
					JSON.stringify(Object.keys(shape)) ===
					JSON.stringify(Object.keys(sch._def.shape()))
				)
			})
		) {
			upperLevelClonedData[key] = upperLevelData[key]
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
				})
			}
		}
	}
}

export const toWrapObjectTypeHandler = (
	...exemptedObjectSchemas: ZodObject<ZodRawShape>[]
) =>
	wrapWithZodTypeName('ZodObject', (ref: HandlerRef) =>
		objectTypeHandler(ref, ...exemptedObjectSchemas)
	)
