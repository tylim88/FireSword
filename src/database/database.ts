import {
	filter as filter_,
	genericMatchCases,
	Filter,
	toWrapObjectTypeHandler,
	wrappedArrayTypeHandler,
} from '../common'

export const filter: Filter = ({ schema, data }) => {
	return filter_(
		{ schema, data },
		genericMatchCases,
		toWrapObjectTypeHandler(),
		wrappedArrayTypeHandler
	)
}
