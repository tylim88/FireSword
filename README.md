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
		Filter Unknown Keys Or Keys With Incorrect Data Types Recursively Before Saving into Firestore and RTDB, Support All Field Values And Special Data Types.
</div>
<br/>
<br/>

## Update

Do not use this library.

I will repurpose this library to support Firelord code first approach.

## Purpose

Some time our API data requirement is less strict, we **do not** want to reject the whole data just because:

1. some information is incorrect(correct key but incorrect value)
2. extra information(unknown keys)

At the same time we don't want to save them into database, we just want to save whatever that is correct.

This is where filtering come in handy.

## Installation

```bash
npm i firesword [zod strip](https://github.com/colinhacks/zod#strip) to filter, it will destroys the special data types. Always only use FireSword to filter.
```

## What It Does?

1. Remove all incorrect enumerable keys(members where key or value type is incorrect), which mean it works for array too.
2. Filters recursively, nothing can escape, it is a black hole.
3. Does not throw on missing members, the job is to filter, not validating. In case you need to throw(validate), see point 4.
4. To validate, simply call `yourSchema.parse(data)` or `yourSchema.safeParse(data)` depend on your use case. Keep in mind all members is required by default, you can set all members or certain members to partial, please read the Zod [documentation](https://github.com/colinhacks/zod) for more parsing options.
5. Both Firestore and RTDB filters support native Zod types: `z.literal`, `z.string`, `z.number`, `z.null`, `z.boolean`, `z.array`, `z.union`, `z.object`.
6. This library is structure in a way that it is possible to support other database(open an issue and I will expose the API, so you can create your own filter, or you can directly contribute to this repo).

Important: do not use zod st

## Limitations For Both RTDB and Firestore Filters

1. Do not union object type with any other type: `z.union([z.object({}), z.someOtherType])`
2. Do not union array type with any other type: `z.union([z.array(...), z.someOtherType])`
3. Top level data type must be an object type.

## Firestore Quick Start

1. `zTimestamp`, `zDocumentReference` and `zGeoPoint`, `zArrayUnionAndRemove`, `zDelete`, `zIncrement` and `zServerTimestamp` are custom Firestore Zod types.
2. Support native Zod Type: `z.date`.
3. The filtered data is deep clone of original data, will not clone Firestore `Timestamp`, `DocumentReference`, `GeoPoint` and all field values(`ServerTimestamp, ArrayRemove, ArrayUnion, Increment, Delete`).

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

// schema type
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

console.log(filteredData)
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
4. RTDB [doesn't always return array type](https://firebase.blog/posts/2014/04/best-practices-arrays-in-firebase). <-- this does not affect how you should use this library but something you should be aware of.
5. One api for both admin and web.

```ts
import { filter, zServerTimestamp, zIncrement } from 'firesword/database'
import { z } from 'zod'
import { serverTimestamp, increment } from 'firebase/database'

// schema type
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

This section use Firestore filter as example but the same logic is applied to RTDB filter.

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
		g: { a: {}, b: true, c: 'abc' }, // expect { x:number, y:null }
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
