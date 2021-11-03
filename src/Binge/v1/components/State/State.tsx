import classNames from 'classnames'
import 'font-awesome/css/font-awesome.min.css'
import { useState } from 'react';
import { TeamRoster } from '../../utils/_interfaces'
import './State.scss'

type AvatarProps = {
	team: TeamRoster
	active: boolean
}

const Avatar = (props: AvatarProps) => {
	return (
		<div key={props.team.name}
			className={classNames('state__team',
				props.active && 'state__team--active')}>
			<p className='state__team--name'>{props.team.name}</p>
			<p className='state__team--turn'>{props.active ? '...' : ''}</p>
			<p className='state__team--score'>{props.team.score}</p>
			<div className='state__team--players'>
				{props.team.players.map((player, index) => 
				<p className='state__team--player' key={index}>{player.name}</p>)}	
			</div>
		</div>
	)
}

type Props = {
	teams: TeamRoster[]
	currentTeamId: string
}

export const State = (props: Props) => {
	const [show, setShow] = useState(false)

	const toggle = (show: boolean) => {
		setShow(show)
	}

	// const currentTeamScore = props.teams.find(team => team.id === props.currentTeamId)?.score || 0

	// const currentTeamPresentInTeams = props.teams.find(team => team.id === props.currentTeamId)
	
	// const currentTeamRankAfterSortingTeams = currentTeamPresentInTeams ? props.teams.findIndex(team => team.id === props.currentTeamId) + 1 : 0 
	
	const arrow = show 
		?	<i className="fa fa-arrow-up state__header--icon" onClick={() => toggle(false)}></i> 
		: <i className="fa fa-arrow-left state__header--icon" onClick={() => toggle(true)}></i>;
	
	return (
		<div className='state__container'>
			<div className={show ? 'state__table' : 'state__table--hidden'}>
				{props.teams.map((ix) => <Avatar team={ix}
					active={ix.id === props.currentTeamId} />)}
			</div>
			<div className='state__header'>
				<p className='state__header--text'>scores</p>
				{arrow}
			</div>
			{/* <div className='state__team--current'>
				<p className='state__item'>Score {currentTeamScore}</p>
				<p className='state__item'>Rank {currentTeamRankAfterSortingTeams}</p>
			</div> */}
		</div>
	)
}