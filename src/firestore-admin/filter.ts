import {
	filter as filter_,
	genericMatchCases,
	WrappedFilter,
	wrapWithZodTypeName,
	primitiveTypeHandler,
} from '../common'
import {
	zDocumentReference,
	zGeoPoint,
	zTimestamp,
	zArrayRemove,
	zArrayUnion,
	zDelete,
	zIncrement,
	zServerTimestamp,
} from './customTypes'
import { z } from 'zod'

export const filter: WrappedFilter = ({ schema, data }) => {
	return filter_(
		{
			schema,
			data,
			exemptedObjectSchemas: [
				zDocumentReference(),
				zGeoPoint(),
				zTimestamp(),
				zArrayRemove(z.any()),
				zArrayUnion(z.any()),
				zDelete(),
				zIncrement(),
				zServerTimestamp(),
			],
		},
		genericMatchCases,
		wrapWithZodTypeName('ZodDate', primitiveTypeHandler)
	)
}
