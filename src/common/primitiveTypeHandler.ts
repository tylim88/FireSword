import { Handler } from './types'

export const primitiveTypeHandler: Handler = ({
	upperLevelData,
	upperLevelClonedData,
	key,
}) => {
	upperLevelClonedData[key] = upperLevelData[key]
}
