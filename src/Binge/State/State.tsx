import { Player } from '../../utils/_interfaces'
import './State.scss'

type PlayerProps = {
	name: string
	score: number
}

const Avatar = (props: PlayerProps) => {
	return (
		<div className='state__player'>
			<p className='state__player--name'>{props.name}</p>
			<p className='state__player--name'>{props.score}</p>
		</div>
	)
}

type Props = {
	players: Player[]
}

export const State = (props: Props) => {
	return (
		<div className='state__container'>
			{props.players.map(_ => <Avatar name={_.name} score={_.score} />)}
		</div>
	)
}