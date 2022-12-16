// has risk of collision, but chance is small
import { z } from 'zod'

export const zServerTimestamp = () =>
	z.object({
		'.sv': z.literal('timestamp'),
	})
export const zIncrement = () =>
	z.object({
		'.sv': z.object({ increment: z.number() }),
	})
