// has risk of collision, but chance is small
import { z, ZodTypeAny } from 'zod'
import { constructor } from '../../common'

const zFieldValue = (methodName: string) => ({
	constructor,
	isEqual: z.function(),
	includeInDocumentMask: z.boolean(),
	includeInDocumentTransform: z.boolean(),
	methodName: z.literal(methodName),
	toProto: z.function(),
	validate: z.function(),
})

export const zArrayUnion = (type: ZodTypeAny) =>
	z.object({
		...zFieldValue('FieldValue.arrayUnion'),
		elements: z.array(type),
	})

export const zArrayRemove = (type: ZodTypeAny) =>
	z.object({
		...zFieldValue('FieldValue.arrayRemove'),
		elements: z.array(type),
	})

export const zArrayUnionAndRemove = (type: ZodTypeAny) =>
	z.union([zArrayRemove(type), zArrayUnion(type)])

export const zServerTimestamp = () =>
	z.object(zFieldValue('FieldValue.serverTimestamp'))

export const zIncrement = () =>
	z.object({
		...zFieldValue('FieldValue.increment'),
		operand: z.number(),
	})

export const zDelete = () => z.object(zFieldValue('FieldValue.delete'))
