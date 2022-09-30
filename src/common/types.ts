import { ZodType, ZodFirstPartyTypeKind, z, ZodObject, ZodRawShape } from 'zod'

export type Schema = ZodType & {
	_def: { typeName: `${ZodFirstPartyTypeKind}` } & ZodType['_def']
}

export type HandlerRef = {
	upperLevelData: any
	upperLevelClonedData: any
	key: string | number
	schema: Schema
	matchCases: MatchCases
	exemptedObjectSchemas: ZodObject<ZodRawShape>[]
	typeOfUpperLevelData?: 'array' | undefined
}

export type Handler = (ref: HandlerRef) => void

export type MatchCases = Partial<Record<ZodFirstPartyTypeKind, Handler>>

export type Filter = <T extends ZodObject<ZodRawShape>>(
	ref: {
		schema: T
		data: Record<string, unknown>
		exemptedObjectSchemas: ZodObject<ZodRawShape>[]
	},
	...matchCasesArr: MatchCases[]
) => z.infer<T>

export type WrappedFilter = <T extends ZodObject<ZodRawShape>>(
	ref: {
		schema: T
		data: Record<string, unknown>
	},
	...matchCasesArr: MatchCases[]
) => z.infer<T>
