import classNames from "classnames"
import { useState } from "react"
import { Box } from "../components/Box/Box"
import { Popover } from "../components/Popover/Popover"
import { TextField } from "../components/TextField/TextField"
import { Game, Player, Team } from "../utils/_interfaces"
import './Lobby.scss'

type Props = {
  quiz: Game
  playerId: string
}

export const Lobby = (props: Props) => {

  const [action, setAction] = useState('waiting...')

  const quizIdCopied = () => {
    navigator.clipboard.writeText(props.quiz.id)
  }

  const start = () => {

  }

  const renderPlayer = (player: Player, props: Props) => {
    return <TextField key={player.email} value={player.name} editable={props.playerId === player.id} />
  }

  const playerInTeam = (team: Team) => {
    return team.players.filter((player) => player.id === props.playerId).length !== 0
  }

  const emptyPlayer = () => {
    return { id: '', name: '', email: '' }
  }

  return (
    <div className='lobby__wrapper'>
      <p className='lobby__logo'>Binquiz</p>
      <p className='lobby__quiz--id--label'>Quiz Id</p>
      <p className='lobby__quiz--id--value' onClick={quizIdCopied}>{props.quiz.id}</p>
      <div className='lobby__teams'>
        {props.quiz.teams.map((team) =>
          <div className='lobby__team'>
            <p className={classNames('lobby__team--name', playerInTeam(team) && 'lobby__team--name--editable')}>{team.name}</p>
            {team.players.map((player) =>
              <Popover content={renderPlayer(player, props)} />)}
            {Array(props.quiz.specs.players - team.players.length).map(() =>
              <Popover content={renderPlayer(emptyPlayer(), props)} />)}
          </div>)}
      </div>
      <Box height='4em' />
      <button key='lobby' className='lobby__button' onClick={start}>{action}</button>
    </div>
  )
}