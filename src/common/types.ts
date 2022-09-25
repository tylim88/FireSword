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
}

export type Handler = (ref: HandlerRef) => void

export type ObjectHandler = (
	ref: HandlerRef,
	...exemptedObjectSchemas: ZodObject<ZodRawShape>[]
) => void

export type MatchCases = Partial<
	Record<ZodFirstPartyTypeKind, Handler | ObjectHandler>
>

export type Filter = <T extends ZodObject<ZodRawShape>>(
	ref: {
		schema: T
		data: Record<string, unknown>
	},
	...matchCasesArr: MatchCases[]
) => z.infer<T>
