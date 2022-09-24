import { Filter, Schema } from './types'
import { ZodObject, ZodRawShape } from 'zod'
import { combineMatchCaseArr } from './utils'

export const filter: Filter = ({ schema, data }, ...matchCasesArr) => {
	const newObj = {}
	const matchCases = combineMatchCaseArr(...matchCasesArr)

	const schema_ = schema as ZodObject<ZodRawShape>
	const shape = schema_._def.shape()
	for (const newKey in shape) {
		if (Object.prototype.hasOwnProperty.call(data, newKey)) {
			const newSchema = shape[newKey] as Schema
			matchCases[newSchema._def.typeName]!({
				upperLevelData: data,
				upperLevelClonedData: newObj,
				key: newKey,
				schema: newSchema,
				matchCases: matchCases,
			})
		}
	}
	return newObj
}
