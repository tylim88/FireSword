import { ZodFirstPartyTypeKind } from 'zod'
import { Handler } from './types'

export const wrapWithZodTypeName = <
	T extends `${ZodFirstPartyTypeKind}`,
	Y extends Handler
>(
	zodTypename: T,
	handler: Y
) => {
	return { [zodTypename]: handler } as { [x in T]: Y }
}
