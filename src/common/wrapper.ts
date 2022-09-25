import { ZodFirstPartyTypeKind } from 'zod'
import { Handler, ObjectHandler } from './types'

export const wrapWithZodTypeName = <
	T extends `${ZodFirstPartyTypeKind}`,
	Y extends Handler | ObjectHandler
>(
	zodTypename: T,
	handler: Y
) => {
	return { [zodTypename]: handler } as { [x in T]: Y }
}
