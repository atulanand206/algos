import classNames from 'classnames'
import { Player, Team } from '../v1/utils/_interfaces'
import './State.scss'

type PlayerProps = {
	name: string
	score: number
	active: boolean
}

const Avatar = (props: PlayerProps) => {
	return (
		<div className={classNames('state__team', props.active && 'state__team--active')}>
			<p className={classNames(
				'state__team--name'
			)}>{props.name}</p>
			<p className='state__team--name'>{props.score}</p>
		</div>
	)
}

type Props = {
	teams: Team[]
	currentTeamId: number
}

export const State = (props: Props) => {
	return (
		<div className='state__container'>
			{props.teams.map((_, ix) => <Avatar name={_.name}
				score={_.score}
				active={ix === props.currentTeamId} />)}
		</div>
	)
}