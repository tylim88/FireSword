import { z } from 'zod'
import { constructor } from '../../common'

export const zTimestamp = () =>
	z.object({
		constructor,
		isEqual: z.function(),
		seconds: z.number(),
		nanoseconds: z.number(),
		toDate: z.function(),
		toMillis: z.function(),
		valueOf: z.function(),
	})

export const zDocumentReference = () =>
	z.object({
		constructor,
		collection: z.function(),
		create: z.function(),
		delete: z.function(),
		firestore: z.object({ constructor }),
		get: z.function(),
		id: z.string(),
		isEqual: z.function(),
		listCollections: z.function(),
		onSnapshot: z.function(),
		parent: z.object({ constructor }),
		path: z.string(),
		set: z.function(),
		update: z.function(),
		withConverter: z.function(),
	})

export const zGeoPoint = () =>
	z.object({
		constructor,
		latitude: z.number(),
		longitude: z.number(),
		isEqual: z.function(),
	})
