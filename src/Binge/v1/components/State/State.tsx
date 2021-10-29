import classNames from 'classnames'
import 'font-awesome/css/font-awesome.min.css'
import { useState } from 'react';
import { TeamMini } from '../../utils/_interfaces'
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
	const [show, setShow] = useState(false)

	const toggle = (show: boolean) => {
		setShow(show)
	}
	
	const arrow = show 
		?	<i className="fa fa-arrow-up state__header--icon" onClick={() => toggle(false)}></i> 
		: <i className="fa fa-arrow-left state__header--icon" onClick={() => toggle(true)}></i>;
	
	return (
		<div className='state__container'>
			<div className={show ? 'state__table' : 'state__table--hidden'}>
				{props.teams.map((ix) => <Avatar name={ix.name}
					score={ix.score}
					active={ix.id === props.currentTeamId} />)}
			</div>
			<div className='state__header'>
				<p className='state__header--text'>scores</p>
				{arrow}
			</div>
		</div>
	)
}