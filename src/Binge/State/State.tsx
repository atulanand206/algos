import classNames from 'classnames'
import { Player } from '../../utils/_interfaces'
import './State.scss'

type PlayerProps = {
	name: string
	score: number
	active: boolean
}

const Avatar = (props: PlayerProps) => {
	return (
		<div className='state__player'>
			<p className={classNames(
				'state__player--name',
				props.active && 'state__player--name--active'
			)}>{props.name}</p>
			<p className='state__player--name'>{props.score}</p>
		</div>
	)
}

type Props = {
	players: Player[]
	currentPlayerId: number
}

export const State = (props: Props) => {
	return (
		<div className='state__container'>
			{props.players.map((_, ix) => <Avatar name={_.name} score={_.scores.current} active={ix === props.currentPlayerId} />)}
		</div>
	)
}