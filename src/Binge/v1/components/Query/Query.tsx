import './Query.scss'

export enum QueryType {
	HINT, APPROVE, PASS, REJECT, REDUCE_MAX, BONUS, REVEAL, HIDE, EXTEND, SCORE
}

export const queryPlaceholder = (queryType: QueryType) => {
	switch (queryType) {
		case QueryType.APPROVE: return 'Approve'
		case QueryType.EXTEND: return 'Extend'
		case QueryType.SCORE: return 'Score'
		case QueryType.REJECT: return 'Reject'
		case QueryType.PASS: return 'Pass'
		case QueryType.REDUCE_MAX: return 'Reduce'
		case QueryType.BONUS: return 'Bonus'
		case QueryType.HINT: return 'Hint'
		case QueryType.REVEAL: return 'Reveal'
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