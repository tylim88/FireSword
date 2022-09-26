import { z } from 'zod'
import { constructor } from '../common'

export const zTimestamp = z.object({
	constructor,
	seconds: z.number(),
	nanoseconds: z.number(),
	isEqual: z.function(),
	toMillis: z.function(),
	valueOf: z.function(),
})

export const zDocumentReference = z.object({
	constructor,
	converter: z.any(),
	path: z.string(),
	id: z.string(),
	firestore: z.object({}),
	parent: z.object({}),
	withConverter: z.function(),
})

export const zGeoPoint = z.object({
	constructor,
	latitude: z.number(),
	longitude: z.number(),
	isEqual: z.function(),
})
