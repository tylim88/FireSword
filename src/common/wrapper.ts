import { ZodFirstPartyTypeKind } from 'zod'
import { Handler } from './types'

export const wrapWithZodTypeName = (
	zodTypename: ZodFirstPartyTypeKind,
	handler: Handler
) => {
	return { zodTypename, handler }
}
