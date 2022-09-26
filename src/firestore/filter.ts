import {
	filter as filter_,
	genericMatchCases,
	Filter,
	wrappedArrayTypeHandler,
	toWrapObjectTypeHandler,
} from '../common'
import { zDocumentReference, zGeoPoint, zTimestamp } from './specialTypes'

export const filter: Filter = ({ schema, data }) => {
	return filter_(
		{ schema, data },
		genericMatchCases,
		wrappedArrayTypeHandler,
		toWrapObjectTypeHandler(zDocumentReference, zGeoPoint, zTimestamp)
	)
}
