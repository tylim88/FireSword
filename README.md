<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<div align="center">
		<img src="https://raw.githubusercontent.com/tylim88/FireSword/6eb62cd853d18e46fb667d991446f38b07a76960/logo.svg" width="200px"/>
		<h1>FireSword 烈火剑</h1>
</div>

<div align="center">
		<a href="https://www.npmjs.com/package/firesword" target="_blank">
				<img
					src="https://img.shields.io/npm/v/firesword"
					alt="Created by tylim88"
				/>
			</a>
			&nbsp;
			<a
				href="https://github.com/tylim88/firesword/blob/main/LICENSE"
				target="_blank"
			>
				<img
					src="https://img.shields.io/github/license/tylim88/firesword"
					alt="License"
				/>
			</a>
			&nbsp;
			<a
				href="https://www.npmjs.com/package/firesword?activeTab=dependencies"
				target="_blank"
			>
				<img
					src="https://img.shields.io/badge/dynamic/json?url=https://api.npmutil.com/package/firesword&label=dependencies&query=$.dependencies.count&color=brightgreen"
					alt="dependency count"
				/>
			</a>
			&nbsp;
			<img
				src="https://img.shields.io/badge/gzipped-6KB-brightgreen"
				alt="package size"
			/>
			&nbsp;
			<a href="https://github.com/tylim88/firesword/actions" target="_blank">
				<img
					src="https://github.com/tylim88/firesword/workflows/Main/badge.svg"
					alt="github action"
				/>
			</a>
			&nbsp;
			<a href="https://codecov.io/gh/tylim88/firesword" target="_blank">
				<img
					src="https://codecov.io/gh/tylim88/firesword/branch/main/graph/badge.svg"
					alt="code coverage"
				/>
			</a>
			&nbsp;
			<a href="https://github.com/tylim88/firesword/issues" target="_blank">
				<img
					alt="GitHub issues"
					src="https://img.shields.io/github/issues-raw/tylim88/firesword"
				></img>
			</a>
			&nbsp;
			<a href="https://snyk.io/test/github/tylim88/firesword" target="_blank">
				<img
					src="https://snyk.io/test/github/tylim88/firesword/badge.svg"
					alt="code coverage"
				/>
			</a>
</div>
<br/>
<div align="center">
		Filter Firestore and RTDB Unknown Keys Or Keys With Incorrect Data Types Recursively, Support All Field Values And Special Data Types.
</div>

## Installation

```bash
npm i firesword zod
```

## Note

1. Remove all incorrect enumerable keys, which mean it works for array too.
2. Filters recursively, nothing can escape, it is a black hole.
3. Does not throw on missing members, the job is to filter. In case you need to throw(validate), see the next point.
4. To validate, call `schema.parse(data)` or `schema.safeParse(data)` depend on your use case. Please read the Zod [documentation](https://github.com/colinhacks/zod) for more parsing options.
5. Both Firestore and RTDB filters support native Zod types: `z.literal`, `z.string`, `z.number`, `z.null`, `z.boolean`, `z.array`, `z.union`, `z.object`.

## Limitation

1. do not union object type with any other type: `z.union([z.object({}), z.someOtherType])`
2. do not union array type with any other type: `z.union([z.array(...), z.someOtherType])`
3. Top level data type must be an object type.

## Firestore Quick Start

1. `zTimestamp`, `zDocumentReference` and `zGeoPoint`, `zArrayUnionAndRemove`, `zDelete`, `zIncrement` and `zServerTimestamp` are custom Firestore Zod types.
2. Support native Zod Type: `z.date`.
3. The filtered data is deep clone original data except for Firestore `Timestamp`, `DocumentReference`, `GeoPoint` and all field values.

### Web

```ts
import {
	filter,
	zTimestamp,
	zDocumentReference,
	zGeoPoint,
	zArrayUnionAndRemove,
	zDelete,
	zIncrement,
} from 'firesword/firestore-web'
import { z } from 'zod'
import {
	Timestamp,
	getFirestore,
	doc,
	arrayRemove,
	deleteField,
	increment,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

initializeApp({ projectId: 'any' })

// {
// 	a: string
// 	b: 1 | 2 | 3
// 	c: {
// 		d: Timestamp
// 		e: DocumentReference
// 		f: GeoPoint
// 	}
// 	d: number[]
// 	e: { i: boolean; j: 'a' | 'b' | 'c' }[]
//  f: (number|boolean)[]
//  g: string[]
//  h: number
//  i: number
//  j: Date
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	c: z.object({ d: zTimestamp(), e: zDocumentReference(), f: zGeoPoint() }),
	d: z.array(z.number()),
	e: z.array(
		z.object({
			i: z.boolean(),
			j: z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
		})
	),
	f: z.array(z.union([z.boolean(), z.number()])),
	g: z.union([z.array(z.string()), zArrayUnionAndRemove(z.string())]),
	h: z.union([zDelete(), z.number()]),
	i: z.union([zIncrement(), z.number()]),
	j: z.date(),
})

export const filteredData = filter({
	schema,
	data: {
		// 'a' is missing
		z: 'unknown member',
		b: 1,
		c: {
			d: new Timestamp(0, 0),
			e: doc(getFirestore(), 'a/b'),
			// f is missing
			z: 'unknown member',
		},
		d: [100, 200, 300],
		e: [
			{
				i: true,
				// j is missing
			},
			{
				// i is missing
				j: 'a',
				z: 'unknown member',
			},
		],
		f: arrayRemove('abc'),
		g: deleteField(),
		h: increment(1),
		i: new Date(0),
	},
})

// console.log(filteredData)
// {
// 	b: 1,
// 	c: {
// 		d: new Timestamp(0, 0),
// 		e: doc(getFirestore(), 'a/b'),
// 	},
// 	d: [100, 200, 300],
// 	e: [{ i: true }, { j: 'a' }],
//  f: arrayRemove('abc'),
//  g: deleteField(),
//  h: increment(1),
//  i: new Date(0),
// }
```

### Admin

This is how you import the same thing in admin, the rest are similar to web.

```ts
import {
	filter,
	zTimestamp,
	zDocumentReference,
	zGeoPoint,
	zArrayUnionAndRemove,
	zDelete,
	zIncrement,
} from 'firesword/firestore-admin'
```

## RTDB Quick Start

1. `zServerTimestamp` and `zIncrement` are custom RTDB Zod types.
2. Use `zServerTimestamp` for `serverTimestamp` and `zIncrement` for `increment`.
3. RTDB's `zServerTimestamp` and `zIncrement` are not the same as Firestore's `zServerTimestamp` and `zIncrement`.
4. Keep in mind that RTDB [doesn't always return array type](https://firebase.blog/posts/2014/04/best-practices-arrays-in-firebase).
5. One api works for both admin and web.

```ts
import { filter, zServerTimestamp, zIncrement } from 'firesword/database'
import { z } from 'zod'
import { serverTimestamp, increment } from 'firebase/database'
// {
// 	a: string
// 	b: number
// 	g: serverTimestamp[]
// 	h: { i: boolean; j: 'a' | 'b' | 'c' }[]
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.number(), zIncrement()]),
	g: z.array(zServerTimestamp()),
	h: z.array(
		z.object({
			i: z.boolean(),
			j: z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
		})
	),
})

export const filteredData = filter({
	schema,
	data: {
		// missing 'a'
		z: 'unknown member',
		b: increment(1),
		g: [serverTimestamp(), serverTimestamp(), serverTimestamp()],
		h: [
			{
				i: true,
				// missing j
			},
			{
				// missing i
				j: 'a',
				z: 'unknown member',
			},
		],
	},
})

// console.log(filteredData)
// {
// 	b: increment(1),
// 	g: [ServerTimestamp, ServerTimestamp, ServerTimestamp],
// 	h: [{ i: true }, { j: 'a' }],
// }
```

## Dealing With Incorrect Data Type

```ts
import { filter, zArrayUnionAndRemove } from 'firesword/firestore-web'
import { number, z } from 'zod'
import { arrayUnion } from 'firebase/firestore'
// {
// 	a: string
// 	b: 1 | 2 | 3
// 	g: { x: number, y: null }
// 	h: boolean[]
//  i: zArrayUnionAndRemove(string)
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	g: z.object({ x: z.number(), y: z.null() }),
	h: z.array(z.boolean()),
	i: zArrayUnionAndRemove(z.string()),
	j: z.array(
		z.object({ x: z.number(), y: z.object({ a: z.null(), b: z.number() }) })
	),
})

export const filteredData = filter({
	schema,
	data: {
		a: true, // expect string
		b: {}, // expect 1 | 2 | 3
		g: 1, // expect { x:number, y:null }
		h: null, // expect boolean[]
		i: arrayUnion(1), // expect arrayUnion(string)
		j: [{ x: 'abc', y: { a: null, b: 'abc' } }], // expect number for 'x' and 'b'
	},
})
// console.log(filteredData) // { j:[{y: { a:null }}] }

export const filteredData2 = filter({
	schema,
	data: {
		g: { a: {}, b: true, c: 'abc' }, // { x:number, y:null }
		h: [1, true, 3], // expect boolean[], only the 2nd element is correct
	},
})
// console.log(filteredData2) // { g: {}, h: [null, true, null] }
```

## Special Types Type Casting

You need to type cast Firestore `zTimestamp`, `zDocumentReference` and `zGeoPoint`.

```ts
import {
	filter,
	zTimestamp,
	zDocumentReference,
	zGeoPoint,
} from 'firesword/firestore-web'
import { z } from 'zod'
import {
	Timestamp,
	doc,
	GeoPoint,
	DocumentReference,
	getFirestore,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

initializeApp({ projectId: 'any' })

// {
// 	d: Timestamp
// 	e: DocumentReference
// 	f: GeoPoint
// }
const schema = z.object({
	d: zTimestamp(),
	e: zDocumentReference(),
	f: zGeoPoint(),
})

export const filteredData = filter({
	schema,
	data: {
		d: new Timestamp(0, 0),
		e: doc(getFirestore(), 'a/b'),
		f: new GeoPoint(0, 0),
	},
}) as unknown as {
	d: Timestamp
	e: DocumentReference
	f: GeoPoint
}
```

## In Case of Compiler Ignoring Package.json Exports

If you see error like `Cannot find module 'firesword/firestore'` or `Cannot find module 'firesword/database'`, it means your compiler ignore `package.json` `exports` field.

Solution for Jest: [jest-node-exports-resolver](https://www.npmjs.com/package/jest-node-exports-resolver).

I am not aware of solution for other cases(eg webpack), please open issue if you are having similar issue.

## Trivial

1. The name FireSword is a reference to [Piandao of Avatar](https://avatar.fandom.com/wiki/Piandao).
2. This library is the successor of [FireLaw](https://github.com/tylim88/FireLaw).

## Related Projects

1. [FirelordJS](https://github.com/tylim88/FirelordJS) - Typescript wrapper for Firestore Web
2. [Firelord](https://github.com/tylim88/firelord) - Typescript wrapper for Firestore admin
3. [FireCall](https://github.com/tylim88/FireCall) - Helper Function to write easier and safer Firebase onCall function.
4. [FireSageJS](https://github.com/tylim88/FireSageJS) - Typescript wrapper for Realtime Database Web
