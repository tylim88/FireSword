import { Filter, Schema, MatchCases } from './types'
import { ZodObject, ZodRawShape } from 'zod'

export const filter: Filter = ({ schema, data }, ...matchCasesArr) => {
	const newObj = {}
	const matchCases = matchCasesArr.reduce((acc, matchCases) => {
		return { ...acc, ...matchCases }
	}, {} as MatchCases)

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
