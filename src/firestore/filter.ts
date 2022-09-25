import {
	filter as filter_,
	genericMatchCases,
	Filter,
	wrappedArrayTypeHandler,
	toWrapObjectTypeHandler,
} from '../common'
import { documentReference, geoPoint, timestamp } from './specialTypes'

export const filter: Filter = ({ schema, data }) => {
	return filter_(
		{ schema, data },
		genericMatchCases,
		wrappedArrayTypeHandler,
		toWrapObjectTypeHandler(documentReference, geoPoint, timestamp)
	)
}
