import { ZodType, ZodFirstPartyTypeKind, z, ZodObject, ZodRawShape } from 'zod'

export type DataType = ZodType & {
	_def: { typeName: `${ZodFirstPartyTypeKind}` } & ZodType['_def']
}

export type HandlerRef = {
	upperLevelData: any
	upperLevelClonedData: any
	key: string
	dataType: DataType
	matchCases: MatchCases
}

export type Handler = (ref: HandlerRef) => void

export type ObjectHandler = (ref: HandlerRef) => void

export type MatchCases = Record<ZodFirstPartyTypeKind, Handler | ObjectHandler>

export type Filter = <T extends ZodObject<ZodRawShape>>(
	ref: {
		dataType: T
		data: Record<string, unknown>
	},
	...matchCasesArr: MatchCases[]
) => z.infer<T>
