import { Button } from "@material-ui/core"
import './Query.scss'

export enum QueryType {
	HINT, 
	APPROVE, PASS, REJECT, REDUCE_MAX, BONUS, REVEAL, EXTEND, SCORE
}

export const queryPlaceholder = (queryType: QueryType) => {
	switch(queryType) {
		case QueryType.APPROVE: return 'Approve'
		case QueryType.EXTEND : return 'Extend'
		case QueryType.SCORE : return 'Score'
		case QueryType.APPROVE : return 'Approve'
		case QueryType.REJECT : return 'Reject'
		case QueryType.PASS : return 'Pass'
		case QueryType.REDUCE_MAX : return 'Reduce'
		case QueryType.BONUS : return 'Bonus'
		case QueryType.HINT : return 'Hint'
		case QueryType.REVEAL : return 'Reveal'
	}
}

type QueryProps = {
	queryType: QueryType
}

export const Query = (props: QueryProps) => {
	return (
		<div className='query__button'>
			<Button variant='contained' color='primary'>{queryPlaceholder(props.queryType)}</Button>
		</div>
	)
}

type QueryBoardProps = {

}

export const QueryBoard = (props: QueryBoardProps) => {
  return (
    <div className='query__board'>
      <div className='query__column'>  
        <Query queryType={QueryType.APPROVE} />
        <Query queryType={QueryType.REJECT} />
        <Query queryType={QueryType.PASS} />
      </div>
      <div className='query__column'>  
        <Query queryType={QueryType.HINT} />
        <Query queryType={QueryType.REVEAL} />
      </div>
      <div className='query__column'>  
        <Query queryType={QueryType.SCORE} />
        <Query queryType={QueryType.EXTEND} />
      </div>   
      <div className='query__column'>  
				<Query queryType={QueryType.BONUS} />
        <Query queryType={QueryType.REDUCE_MAX} />
      </div>    
    </div>
  )
}
