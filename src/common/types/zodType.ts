import {
	ZodFirstPartyTypeKind,
	ZodType,
	ZodBoolean,
	ZodNumber,
	ZodNull,
	ZodString,
} from 'zod'

type TypeNames = `${ZodFirstPartyTypeKind}`

declare const BooleanSymbol: unique symbol
declare const NumberSymbol: unique symbol
declare const NullSymbol: unique symbol
declare const NullOnlySymbol: unique symbol
declare const StringSymbol: unique symbol
declare const numericKeyRecordSymbol: unique symbol
declare const possiblyReadAsNullableSymbol: unique symbol

type BooleanSymbol = typeof BooleanSymbol
type NumberSymbol = typeof NumberSymbol
type NullSymbol = typeof NullSymbol
type NullOnlySymbol = typeof NullOnlySymbol
type StringSymbol = typeof StringSymbol
type NumericKeyRecordSymbol = typeof numericKeyRecordSymbol
type PossiblyReadAsNullableSymbol = typeof possiblyReadAsNullableSymbol

declare class Type<T extends symbol, Y extends ZodType> {
	private constructor()
	// private symbol: T // ! this will get translated to "private symbol" only and it breaks the code, use protected instead!
	protected symbol: T
	type: Y
}

export interface Boolean extends Type<BooleanSymbol, ZodBoolean> {}

export interface Number extends Type<NumberSymbol, ZodNumber> {}
export interface Null<>extends Type<NullSymbol, ZodNull> {}

export interface Removable extends Type<StringSymbol> {}

export interface NullOnly<
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	T
> extends Type<NullOnlySymbol> {}
export interface NumericKeyRecord<
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	T
> extends Type<NumericKeyRecordSymbol> {}

export interface PossiblyReadAsNullable
	extends Type<PossiblyReadAsNullableSymbol> {}

export type AllFieldTypes =
	| Boolean
	| Number
	| Removable
	| Null<unknown>
	| NullOnly<unknown>
	| NumericKeyRecord<unknown>
	| PossiblyReadAsNullable
