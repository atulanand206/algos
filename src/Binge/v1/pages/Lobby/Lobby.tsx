import classNames from "classnames"
import { ROLE_QUIZMASTER } from "../../../Features/Features"
import { Box } from "../../components/Box/Box"
import { Popover } from "../../components/Popover/Popover"
import { Query } from "../../components/Query/Query"
import { TextField } from "../../components/TextField/TextField"
import { Game, Player, Team } from "../../utils/_interfaces"
import './Lobby.scss'

type Props = {
  quiz: Game
  role: string
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
    return props.quiz.specs.players - team.players.length
  }

  const filled = () => {
    return props.teams.filter((team) => remainingItems(team) === 0).length === props.quiz.specs.teams;
  }

  const empty = (team: Team) => {
    var s = []
    for (var i = 0; i < remainingItems(team); i++) {
      s.push(<Popover key={i} content={renderPlayer(emptyPlayer(), props)} />)
    }
    return s
  }

  console.log(props.role)
  const waiting = () => {
    if (filled()) return <p className='lobby__quiz--id--label'>waiting...</p>
    else return <></>
  }
  
	const removePunctuations = (str: string) => {
		return str.replace('["-.,:;!@#$%^&*()_+="]', "").toUpperCase()
	}

  return (
    <div className='lobby__wrapper'>
      <p className='lobby__logo'>Binquiz</p>
      <p className='lobby__quiz--id--value' onClick={quizIdCopied}>Quiz Id: {removePunctuations(props.quiz.id)}</p>
      <p className='lobby__quiz--id--label'>Quizmaster: {props.quiz.quizmaster.name}</p>
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
      {waiting}
      <Query
        label={!filled() ? 'waiting...' : (props.role === ROLE_QUIZMASTER) ? 'start' : ''}
        visible={!(filled() && props.role !== ROLE_QUIZMASTER)}
        onClick={() => {
          if (filled()) start()
        }}></Query>
    </div>
  )
}
