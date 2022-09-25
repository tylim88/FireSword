import { z } from 'zod'
import { constructor } from '../common'

export const timestamp = z.object({
	constructor,
	seconds: z.number(),
	nanoseconds: z.number(),
})

export const documentReference = z.object({
	constructor,
	converter: z.any(),
	path: z.string(),
	id: z.string(),
	firestore: z.object({}),
	parent: z.object({}),
	withConverter: z.function(),
})

export const geoPoint = z.object({
	constructor,
	latitude: z.number(),
	longitude: z.number(),
	isEqual: z.function(),
})
