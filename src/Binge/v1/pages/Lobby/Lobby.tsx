import classNames from "classnames"
import { ROLE_QUIZMASTER } from "../../features/Features"
import { Popover } from "../../components/Popover/Popover"
import { Query } from "../../components/Query/Query"
import { TextField } from "../../components/TextField/TextField"
import { Game, Player, Team, TeamRoster } from "../../utils/_interfaces"
import './Lobby.scss'
import { Header } from "../../components/Header/Header"

type QueryButtonProps = {
  role: string
  filled: boolean
  onStart: () => void
}

export const StartButton = (props: QueryButtonProps) => {
  return <div className='lobby__start'>
    <Query
      label={!props.filled ? 'waiting...' : (props.role === ROLE_QUIZMASTER) ? 'start' : ''}
      visible={!(props.filled && props.role !== ROLE_QUIZMASTER)}
      onClick={() => {
        if (props.filled) props.onStart()
      }}></Query>
  </div>
}

type RosterProps = {
  teams: TeamRoster[]
  maxPerTeam: number
  playerId: string
}

export const Roster = (props: RosterProps) => {

  const renderPlayer = (player: Player) => {
    return <TextField key={player.email} value={player.name} editable={props.playerId === player.id} />
  }

  const tm = (team: TeamRoster) => {
    return team.players.map((player, ix) => <Popover content={renderPlayer(player)} key={`popover container ${ix}`} />)
  }

  const TeamRoster = (team: TeamRoster) => {
    if (team.players.length === 0) return <></>
    return <div className='lobby__team--player' key={`roster team ${team.id}`}>
      {tm(team)}
      {/* {empty(team).map(ent => ent)} */}
    </div>
  }
  
  const playerInTeam = (team: Team) => {
    return team.players.filter((player) => props.playerId === player.id).length !== 0
  }
  return <div className='lobby__teams'>
    {props.teams.map((team, ix) =>
      <div className='lobby__team' key={`lobby ${ix}`}>
        <p className={classNames('lobby__team--name', playerInTeam(team) && 'lobby__team--name--editable')}>{team.name} ({team.players.length}/{props.maxPerTeam})</p>
        {TeamRoster(team)}
      </div>)}
  </div>
}

type Props = {
  player: Player
  quiz: Game
  role: string
  teams: TeamRoster[]
  onStart: () => void
}

export const Lobby = (props: Props) => {

  const start = () => {
    if (!filled()) return;
    props.onStart()
  }

  const quizIdCopied = () => {
    navigator.clipboard.writeText(props.quiz.id)
  }

  const remainingItems = (team: Team) => {
    return props.quiz.specs.players - team.players.length
  }

  const filled = () => {
    return props.teams.filter((team) => remainingItems(team) === 0).length === props.quiz.specs.teams;
  }

  const PlayerLabel = () => <p className='lobby__quiz--id--label lobby__player'><span className='lobby__label'>Player</span><br/>{props.player.name}</p>

  return (
    <div className='lobby__wrapper'>
      <div className='lobby__header'>
        <Header />
      </div>
      <p className='lobby__quiz--id--value lobby__quiz--id' onClick={quizIdCopied}>{props.quiz.specs.name}</p>
      <p className='lobby__quiz--id--label lobby__quizmaster'><span className='lobby__label'>Quizmaster</span><br/>{props.quiz.quizmaster.name}</p>
      {props.role !== ROLE_QUIZMASTER ? <PlayerLabel /> : <></>}
      <Roster 
        playerId={props.player.id}
        teams={props.teams}
        maxPerTeam={props.quiz.specs.players} />
      <StartButton 
        role={props.role} 
        filled={filled()}
        onStart={start} />
    </div>
  )
}
