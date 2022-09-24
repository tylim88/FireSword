import { MatchCases } from './types'

export const combineMatchCaseArr = (...matchCasesArr: MatchCases[]) =>
	matchCasesArr.reduce((acc, matchCases) => {
		return { ...acc, ...matchCases }
	}, {} as MatchCases)
