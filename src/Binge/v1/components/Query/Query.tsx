import './Query.scss'

export enum QueryType {
	HINT, RIGHT, PASS, NEXT, RULES, GUIDE, LINK, HIDE, EXTEND, SCORE
}

export const queryPlaceholder = (queryType: QueryType) => {
	switch (queryType) {
		case QueryType.RIGHT: return 'Right'
		case QueryType.EXTEND: return 'Extend'
		case QueryType.SCORE: return 'Score'
		case QueryType.NEXT: return 'Next'
		case QueryType.PASS: return 'Pass'
		case QueryType.RULES: return 'Rules'
		case QueryType.GUIDE: return 'Guide'
		case QueryType.HINT: return 'Hint'
		case QueryType.LINK: return 'Link'
		case QueryType.HIDE: return 'Hide'
	}
}

type QueryProps = {
	queryType: QueryType
	onQuery: (queryType: QueryType) => void
}

export const Query = (props: QueryProps) => {
	return (
		<button className='query__button' onClick={() => props.onQuery(props.queryType)}>{queryPlaceholder(props.queryType)}</button>
	)
}