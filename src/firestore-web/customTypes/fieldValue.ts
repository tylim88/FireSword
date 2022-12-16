// has risk of collision, but chance is small
import { z, ZodTypeAny } from 'zod'
import { constructor } from '../../common'

const zFieldValue = (methodName: string) => ({
	constructor,
	isEqual: z.function(),
	_toFieldTransform: z.function(),
	_methodName: z.literal(methodName),
})

export const zServerTimestamp = () => z.object(zFieldValue('serverTimestamp'))

export const zDelete = () => z.object(zFieldValue('deleteField'))

export const zIncrement = () =>
	z.object({
		...zFieldValue('increment'),
		_operand: z.number(),
	})
export const zArrayUnion = (type: ZodTypeAny) =>
	z.object({
		...zFieldValue('arrayUnion'),
		_elements: z.array(type),
	})

export const zArrayRemove = (type: ZodTypeAny) =>
	z.object({
		...zFieldValue('arrayRemove'),
		_elements: z.array(type),
	})

export const zArrayUnionAndRemove = (type: ZodTypeAny) =>
	z.union([zArrayRemove(type), zArrayUnion(type)])
