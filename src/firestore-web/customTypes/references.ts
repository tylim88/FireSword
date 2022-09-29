import { z } from 'zod'
import { constructor } from '../../common'

export const zTimestamp = () =>
	z.object({
		constructor,
		seconds: z.number(),
		nanoseconds: z.number(),
		isEqual: z.function(),
		toMillis: z.function(),
		valueOf: z.function(),
		toJSON: z.function(),
		toDate: z.function(),
	})

export const zDocumentReference = () =>
	z.object({
		constructor,
		converter: z.union([z.object({}), z.null()]),
		firestore: z.object({ constructor }),
		id: z.string(),
		parent: z.object({ constructor }),
		path: z.string(),
		type: z.literal('document'),
		withConverter: z.function(),
	})

export const zGeoPoint = () =>
	z.object({
		constructor,
		latitude: z.number(),
		longitude: z.number(),
		isEqual: z.function(),
		toJSON: z.function(),
	})
