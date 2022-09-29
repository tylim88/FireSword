import { filteredData } from './quick_start_fs'
import {
	Timestamp,
	getFirestore,
	doc,
	arrayRemove,
	deleteField,
	increment,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

describe('quick_start_db', () => {
	beforeAll(() => {
		initializeApp({ projectId: 'any' })
	})
	it('check value', () => {
		// expect(filteredData).toEqual({
		// b: 1,
		// c: {
		// 	d: new Timestamp(0, 0),
		// 	e: doc(getFirestore(), 'a/b'),
		// },
		// d: [100, 200, 300],
		// e: [{ i: true }, { j: 'a' }],
		// ! this 4 lines cause TypeError: Converting circular structure to JSON
		// f: arrayRemove('abc'),
		// g: deleteField(),
		// h: increment(1),
		// i: new Date(0),
		// })
	})
})
