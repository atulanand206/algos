import classNames from 'classnames'
import { TeamMini } from '../../utils/_interfaces'
import { Divider } from '../Divider/Divider'
import './State.scss'

type AvatarProps = {
	name: string
	score: number
	active: boolean
}

const Avatar = (props: AvatarProps) => {
	return (
		<div key={props.name} 
			className={classNames('state__team', 
				props.active && 'state__team--active')}>
			<p className='state__team--name'>{props.name}</p>
				<p className='state__team--turn'>{props.active ? '...' : ''}</p>
			<p className='state__team--score'>{props.score}</p>
		</div>
	)
}

type Props = {
	teams: TeamMini[]
	currentTeamId: string
}

export const State = (props: Props) => {
	return (
		<div className='state__container'>
			<p className='state__header'>scores</p>
			<Divider />
			<div className='state__table'>
				{props.teams.map((ix) => <Avatar name={ix.name}
					score={ix.score}
					active={ix.id === props.currentTeamId} />)}
			</div>
		</div>
	)
}