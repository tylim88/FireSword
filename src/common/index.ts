import { Filter, MatchCases, DataType } from './types'
import { ZodObject, ZodRawShape } from 'zod'

export const filter: Filter = ({ dataType, data }, ...matchCasesArr) => {
	const newObj = {}
	const matchCases = matchCasesArr.reduce((acc, matchCases) => {
		return { ...acc, ...matchCases }
	}, {} as MatchCases)

	const dataType_ = dataType as ZodObject<ZodRawShape>
	const shape = dataType_._def.shape()

	for (const newKey in shape) {
		if (Object.prototype.hasOwnProperty.call(data, newKey)) {
			const newDataType = shape[newKey] as DataType
			matchCases[newDataType._def.typeName]({
				upperLevelData: data,
				upperLevelClonedData: newObj,
				key: newKey,
				dataType: newDataType,
				matchCases: matchCases,
			})
		}
	}
	return newObj
}
