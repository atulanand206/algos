import classNames from "classnames"
import { ROLE_QUIZMASTER } from "../../features/Features"
import { Box } from "../../components/Box/Box"
import { Popover } from "../../components/Popover/Popover"
import { Query } from "../../components/Query/Query"
import { TextField } from "../../components/TextField/TextField"
import * as GameManager from "../../dataStore/GameManager"
import { Player, Team, TeamRoster } from "../../utils/_interfaces"
import './Lobby.scss'
import { useSnapshot } from "valtio"
import { state } from "../../state/State"

type Props = {
}

export const Lobby = (props: Props) => {

  const snap = useSnapshot(state)

  const start = () => {
    if (!filled()) return;
    GameManager.start(snap)
  }

  const quizIdCopied = () => {
    navigator.clipboard.writeText(snap.quiz.id)
  }

  const renderPlayer = (player: Player, props: Props) => {
    return <TextField key={player.email} value={player.name} editable={snap.player.id === player.id} />
  }

  const playerInTeam = (team: Team) => {
    return team.players.filter((player) => player.id === snap.player.id).length !== 0
  }

  const emptyPlayer = () => {
    return { id: '', name: '-', email: '' }
  }

  const remainingItems = (team: Team) => {
    return snap.quiz.specs.players - team.players.length
  }

  const filled = () => {
    return snap.snapshot.teams.filter((team) => remainingItems(team) === 0).length === snap.quiz.specs.teams;
  }

  const empty = (team: Team) => {
    var s = []
    for (var i = 0; i < remainingItems(team); i++) {
      s.push(<Popover key={i} content={renderPlayer(emptyPlayer(), props)} />)
    }
    return s
  }

  const waiting = () => {
    if (filled()) return <p className='lobby__quiz--id--label'>waiting...</p>
    else return <></>
  }

  const removePunctuations = (str: string) => {
    return str.replace('["-.,:;!@#$%^&*()_+="]', "").toUpperCase()
  }

  const tm = (team: TeamRoster) => {
    return team.players.map((player, ix) => <Popover content={renderPlayer(player, props)} key={`popover container ${ix}`} />)
  }

  const teamRoster = (team: TeamRoster) => {
    return <div className='' key={`roster team ${team.id}`}>
      {tm(team)}
      {remainingItems(team) && empty(team).map(ent => ent)}
    </div>
  }

  const roster = () => {
    <div className='lobby__teams'>
      {snap.snapshot.teams.map((team, ix) =>
        <div className='lobby__team' key={`lobby ${ix}`}>
          <p className={classNames('lobby__team--name', playerInTeam(team) && 'lobby__team--name--editable')}>{team.name}</p>
          {teamRoster(team)}
        </div>)}
    </div>
  }

  return (
    <div className='lobby__wrapper'>
      <p className='lobby__logo'>Binquiz</p>
      <p className='lobby__quiz--id--value' onClick={quizIdCopied}>Quiz Id: {removePunctuations(snap.quiz.id)}</p>
      <p className='lobby__quiz--id--label'>Quizmaster: {snap.quiz.quizmaster.name}</p>
      {roster()}
      <Box height='4em' />
      {waiting}
      <Query
        label={!filled() ? 'waiting...' : (snap.role === ROLE_QUIZMASTER) ? 'start' : ''}
        visible={!(filled() && snap.role !== ROLE_QUIZMASTER)}
        onClick={() => {
          if (filled()) start()
        }}></Query>
    </div>
  )
}
