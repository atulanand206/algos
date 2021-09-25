import { Button } from "@material-ui/core"
import './Query.scss'

export enum QueryType {
	HINT, APPROVE, PASS, REJECT, REDUCE_MAX, BONUS, REVEAL, HIDE, EXTEND, SCORE
}

export const queryPlaceholder = (queryType: QueryType) => {
	switch (queryType) {
		case QueryType.APPROVE: return 'Approve'
		case QueryType.EXTEND: return 'Extend'
		case QueryType.SCORE: return 'Score'
		case QueryType.APPROVE: return 'Approve'
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
		<div className='query__button'>
			<Button variant='contained' color='primary' onClick={() => props.onQuery(props.queryType)}>{queryPlaceholder(props.queryType)}</Button>
		</div>
	)
}

type QueryBoardProps = {
	onQuery: (queryType: QueryType) => void
}

export const QueryBoard = (props: QueryBoardProps) => {
	return (
		<div className='query__board'>
			<Query {...props} queryType={QueryType.APPROVE} />
			<Query {...props} queryType={QueryType.REJECT} />
			<Query {...props} queryType={QueryType.PASS} />
			<Query {...props} queryType={QueryType.HINT} />
			<Query {...props} queryType={QueryType.REVEAL} />
			<Query {...props} queryType={QueryType.HIDE} />
			<Query {...props} queryType={QueryType.SCORE} />
			<Query {...props} queryType={QueryType.EXTEND} />
			<Query {...props} queryType={QueryType.BONUS} />
			<Query {...props} queryType={QueryType.REDUCE_MAX} />
		</div>
	)
}
