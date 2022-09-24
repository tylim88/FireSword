import { ObjectHandler, DataType } from './types'
import { ZodObject, ZodRawShape } from 'zod'

export const objectTypeHandler: ObjectHandler = ({
	upperLevelData,
	upperLevelClonedData,
	key,
	dataType,
	matchCases,
}) => {
	if (Object.prototype.hasOwnProperty.call(upperLevelData, key)) {
		const dataType_ = dataType as ZodObject<ZodRawShape>
		const shape = dataType_._def.shape()
		const newUpperLevelClonedData = (upperLevelClonedData[key] = {})

		for (const newKey in shape) {
			if (Object.prototype.hasOwnProperty.call(upperLevelData[key], newKey)) {
				const newDataType = shape[newKey] as DataType
				matchCases[newDataType._def.typeName]({
					upperLevelData: upperLevelData[key],
					upperLevelClonedData: newUpperLevelClonedData,
					key: newKey,
					dataType: newDataType,
					matchCases,
				})
			}
		}
	}
}
