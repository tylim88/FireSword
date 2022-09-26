<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<div align="center">
		<img src="https://raw.githubusercontent.com/tylim88/Firelord/main/img/ozai.png" width="200px"/>
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
				src="https://img.shields.io/badge/gzipped-4KB-brightgreen"
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
		Filter Firestore and RTDB Unknown Keys, Support Nest Filtering.
</div>

## Installation

```bash
npm i firesword zod lodash
```

## Note

1. FireSword filters out all unknown members, nested or not.
2. FireSword is a filter, not a validator, it doesn't care about missing members.
3. This library is built on top of Zod. Please read the Zod [documentation](https://github.com/colinhacks/zod) if you need validation.
4. Both Firestore and RTDB filters support `z.literal`, `z.string`, `z.number`, `z.null`, `z.boolean`, `z.array`, `z.union`, `z.object`.
5. Only work for read data and work with both web and admin sdk, mostly implement in admin environment(for triggers).
6. The filtered data is deep clone original data except for Firestore `Timestamp`, `DocumentReference` and `GeoPoint`.

## Limitation

1. do not union object type with any other type: `z.union([z.object({}), z.someOtherType])`
2. do not union array type with any other type: `z.union([z.array(z.any()), z.someOtherType])`

## Firestore Quick Start

1. `zTimestamp`, `zDocumentReference` and `zGeoPoint` are custom Firestore Zod types.
2. `Date`, `serverTimestamp` and `Timestamp` all share the same Zod type: `zTimestamp`.

```ts
import {
	filter,
	zTimestamp,
	zDocumentReference,
	zGeoPoint,
} from 'firesword/firestore'
import { z } from 'zod'
import { Timestamp, getFirestore } from 'firebase-admin/firestore' // this is admin sdk but you can also use web sdk

// {
// 	a: string
// 	b: 1 | 2 | 3
// 	c: {
// 		d: Timestamp
// 		e: DocumentReference
// 		f: GeoPoint
// 	}
// 	g: number[]
// 	h: { i: boolean; j: 'a' | 'b' | 'c' }[]
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	c: z.object({ d: zTimestamp, e: zDocumentReference, f: zGeoPoint }),
	g: z.array(z.number()),
	h: z.array(
		z.object({
			i: z.boolean(),
			j: z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
		})
	),
})

const filteredData = filter({
	schema,
	data: {
		z: 'unknown member',
		b: 1,
		c: {
			d: new Timestamp(0, 0),
			e: getFirestore().doc('a/b'),
			z: 'unknown member',
		},
		g: [5276471267, 924721744, 23712938],
		h: [{ i: true }, { j: 'a', z: 'unknown member' }],
	},
})

console.log(filteredData)
// {
// 	b: 1,
// 	c: {
// 		d: new Timestamp(0, 0),
// 		e: getFirestore().doc('a/b'),
// 	},
// 	g: [5276471267, 924721744, 23712938],
// 	h: [{ i: true }, { j: 'a' }],
// }
```

## RTDB Quick Start

1. `zTimestamp` custom RTDB Zod types.
2. Use `zTimestamp` for `serverTimestamp`.
3. RTDB's `zTimestamp` is not the same as Firestore's `zTimestamp`.
4. Keep in mind that RTDB [doesn't always return array type](https://firebase.blog/posts/2014/04/best-practices-arrays-in-firebase).

```ts
import { filter, zTimestamp } from 'firesword/database'
import { z } from 'zod'

// {
// 	a: string
// 	b: 1 | 2 | 3
// 	g: serverTimestamp[]
// 	h: { i: boolean; j: 'a' | 'b' | 'c' }[]
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	g: z.array(zTimestamp),
	h: z.array(
		z.object({
			i: z.boolean(),
			j: z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
		})
	),
})

const filteredData = filter({
	schema,
	data: {
		z: 'unknown member',
		b: 1,
		g: [100, 200, 300],
		h: [{ i: true }, { j: 'a', z: 'unknown member' }],
	},
})

console.log(filteredData)
// {
// 	b: 1,
// 	g: [5276471267, 924721744, 23712938],
// 	h: [{ i: true }, { j: 'a' }],
// }
```

## Dealing With Incorrect Data Type

```ts
import { filter } from 'firesword/firestore'
import { z } from 'zod'

// {
// 	a: string
// 	b: 1 | 2 | 3
// 	g: { x: number, y: null }
// 	h: boolean[]
// }
const schema = z.object({
	a: z.string(),
	b: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	g: z.object({ x: z.number(), y: z.null() }),
	h: z.array(z.boolean()),
})

const filteredData = filter({
	schema,
	data: {
		a: true, // expect string
		b: {}, // expect 1 | 2 | 3
		g: 1, // expect object
		h: null, // expect array of boolean
	},
})

console.log(filteredData)
// {
// 	a: true, // data does not change
// 	b: {}, // data does not change
// 	g: {}, // replace with empty object
// 	h: [], // replace with empty array
// }
```

1. If the expected data type is an object but received non-object, it will be replaced with an empty object.
2. If the expected data type is an array but received non-object, it will be replaced with an empty array.
3. For all the other cases, the original value is left untouched.
4. This could be problematic, which is why you need to validate them using Zod as mentioned if you are not confident with your data integrity.

## Filtered Data Static Typing

You need to type case Firestore `zTimestamp`, `zDocumentReference` and `zGeoPoint`.

```ts
import {
	filter,
	zTimestamp,
	zDocumentReference,
	zGeoPoint,
} from 'firesword/firestore'
import { z } from 'zod'
import {
	Timestamp,
	doc,
	GeoPoint,
	DocumentReference,
	getFirestore,
} from 'firebase/firestore' // this is web sdk but you can also use admin sdk

// {
// 	d: Timestamp
// 	e: DocumentReference
// 	f: GeoPoint
// }
const schema = z.object({ d: zTimestamp, e: zDocumentReference, f: zGeoPoint })

const filteredData = filter({
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

## In Case of Compiler Ignore Package.json Exports

If you see error like `Cannot find module 'firesword/firestore'` or `Cannot find module 'firesword/database'`, it means your compiler ignore `package.json` `exports` field.

The problem with `exports` is quite common, and I may remove the support for sub-module.

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
