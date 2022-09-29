import { zServerTimestamp } from './customTypes'
import { ServerValue } from 'firebase-admin/database'
import { serverTimestamp } from 'firebase/database'

describe('test zod parse special type for front end and back end', () => {
	it('test serverTimestamp', () => {
		expect(zServerTimestamp().safeParse(ServerValue.TIMESTAMP).success).toBe(
			true
		)
		expect(zServerTimestamp().safeParse(serverTimestamp()).success).toBe(true)
	})
})
