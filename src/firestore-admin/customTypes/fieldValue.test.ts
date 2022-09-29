import {
	zArrayUnionAndRemove,
	zIncrement,
	zServerTimestamp,
	zDelete,
	zArrayRemove,
	zArrayUnion,
} from './fieldValue'
import { FieldValue } from 'firebase-admin/firestore'
import { z } from 'zod'

describe('test field value', () => {
	it('test', () => {
		expect(
			zServerTimestamp().safeParse(FieldValue.serverTimestamp()).success
		).toBe(true)
		expect(
			zArrayUnionAndRemove(z.number()).safeParse(FieldValue.arrayRemove(1))
				.success
		).toBe(true)
		expect(
			zArrayUnionAndRemove(z.null()).safeParse(FieldValue.arrayUnion(null))
				.success
		).toBe(true)
		expect(
			zArrayRemove(z.string()).safeParse(FieldValue.arrayRemove('123')).success
		).toBe(true)
		expect(
			zArrayUnion(z.boolean()).safeParse(FieldValue.arrayUnion(true)).success
		).toBe(true)
		expect(zDelete().safeParse(FieldValue.delete()).success).toBe(true)
		expect(zIncrement().safeParse(FieldValue.increment(1)).success).toBe(true)
	})
	it('test array', () => {
		expect(
			zArrayUnionAndRemove(z.number()).safeParse(FieldValue.arrayRemove('abc'))
				.success
		).toBe(false)
		expect(
			zArrayUnionAndRemove(z.string()).safeParse(FieldValue.arrayUnion(1))
				.success
		).toBe(false)
	})
})
