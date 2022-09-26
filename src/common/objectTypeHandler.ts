import { ObjectHandler, Schema, HandlerRef } from './types'
import { ZodObject, ZodRawShape } from 'zod'
import { wrapWithZodTypeName } from './wrapper'
import { isEqualWith } from 'lodash'

export const objectTypeHandler: ObjectHandler = (
	{ upperLevelData, upperLevelClonedData, key, schema, matchCases },
	...exemptedObjectSchemas
) => {
	const schema_ = schema as ZodObject<ZodRawShape>
	const shape = schema_._def.shape()
	if (exemptedObjectSchemas.some(sch => isEqualWith(sch, schema_))) {
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

export const toWrapObjectTypeHandler = (
	...exemptedObjectSchemas: ZodObject<ZodRawShape>[]
) =>
	wrapWithZodTypeName('ZodObject', (ref: HandlerRef) =>
		objectTypeHandler(ref, ...exemptedObjectSchemas)
	)
