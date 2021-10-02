import classNames from "classnames"
import { Box } from "../../components/Box/Box"
import { Popover } from "../../components/Popover/Popover"
import { TextField } from "../../components/TextField/TextField"
import { Game, Player, Team } from "../../utils/_interfaces"
import './Lobby.scss'

type Props = {
  quiz: Game
  teams: Team[]
  playerId: string
  start: () => void
}

export const Lobby = (props: Props) => {

  const start = () => {
    if (!filled()) return;
    props.start()
  }

  const quizIdCopied = () => {
    navigator.clipboard.writeText(props.quiz.id)
  }

  const renderPlayer = (player: Player, props: Props) => {
    return <TextField key={player.email} value={player.name} editable={props.playerId === player.id} />
  }

  const playerInTeam = (team: Team) => {
    return team.players.filter((player) => player.id === props.playerId).length !== 0
  }

  const emptyPlayer = () => {
    return { id: '', name: '-', email: '' }
  }

  const remainingItems = (team: Team) => {
    const x = Array(props.quiz.specs.players - team.players.length)
    return x
  }

  const filled = () => {
    return props.teams.filter((team) => remainingItems(team).length === 0).length === props.quiz.teams.length;
  }

  const empty = (team: Team) => {
    var s = []
    for (var i = 0; i < remainingItems(team).length; i++) {
      console.log('dsadas')
      s.push(<Popover content={renderPlayer(emptyPlayer(), props)} />)
    }
    return s
  }

  return (
    <div className='lobby__wrapper'>
      <p className='lobby__logo'>Binquiz</p>
      <p className='lobby__quiz--id--label'>Quiz Id</p>
      <p className='lobby__quiz--id--value' onClick={quizIdCopied}>{props.quiz.id}</p>
      <div className='lobby__teams'>
        {props.teams.map((team) =>
          <div className='lobby__team'>
            <p className={classNames('lobby__team--name', playerInTeam(team) && 'lobby__team--name--editable')}>{team.name}</p>
            {team.players.map((player) =>
              <Popover content={renderPlayer(player, props)} />)}
            {empty(team).map(ent => ent)}
          </div>)}
      </div>
      <Box height='4em' />
      <button key='lobby' className='lobby__button' disabled={!props.quiz.ready} onClick={start}>{!props.quiz.ready ? 'waiting...' : 'start'}</button>
    </div>
  )
}
