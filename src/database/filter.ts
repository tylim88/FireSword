import { filter as filter_, genericMatchCases, WrappedFilter } from '../common'

import { zIncrement, zServerTimestamp } from './customTypes'

export const filter: WrappedFilter = ({ schema, data }) => {
	return filter_(
		{ schema, data, exemptedObjectSchemas: [zIncrement(), zServerTimestamp()] },
		genericMatchCases
	)
}
