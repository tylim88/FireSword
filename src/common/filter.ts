import { Filter, Schema, MatchCases } from './types'
import { ZodObject, ZodRawShape, z } from 'zod'

export const filter: Filter = (
	{ schema, data, exemptedObjectSchemas },
	...matchCasesArr
) => {
	const newObj: Record<string, unknown> = {}
	if (z.object({}).safeParse(data).success) {
		const matchCases = matchCasesArr.reduce((acc, matchCases) => {
			return { ...acc, ...matchCases }
		}, {} as MatchCases)

		const schema_ = schema as ZodObject<ZodRawShape>
		const shape = schema_._def.shape()
		for (const newKey in shape) {
			const newSchema = shape[newKey] as Schema
			if (Object.prototype.hasOwnProperty.call(data, newKey)) {
				const newSchema_ = newSchema as ZodObject<ZodRawShape>
				const found = exemptedObjectSchemas
					.map(expSch => {
						if (
							JSON.stringify(Object.keys(newSchema_)) ===
							JSON.stringify(Object.keys(expSch._def.shape()))
						) {
							return newSchema
						} else {
							return undefined
						}
					})
					.filter(sch => sch !== undefined)
				if (found.length > 0) {
					found.forEach(sch => {
						if (sch?.safeParse(data[newKey]).success)
							newObj[newKey] = data[newKey]
					})
				} else {
					matchCases[newSchema._def.typeName]!({
						upperLevelData: data,
						upperLevelClonedData: newObj,
						key: newKey,
						schema: newSchema,
						matchCases: matchCases,
						exemptedObjectSchemas,
					})
				}
			}
		}
	}
	return newObj
}
