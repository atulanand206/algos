import classNames from "classnames"
import { ROLE_QUIZMASTER } from "../../features/Features"
import { Popover } from "../../components/Popover/Popover"
import { Query } from "../../components/Query/Query"
import { TextField } from "../../components/TextField/TextField"
import * as GameManager from "../../dataStore/GameManager"
import { Player, Team, TeamRoster } from "../../utils/_interfaces"
import './Lobby.scss'
import { useSnapshot } from "valtio"
import { state } from "../../state/State"
import { Header } from "../../components/Header/Header"

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

  // const emptyPlayer = () => {
  //   return { id: '', name: '-', email: '' }
  // }

  const remainingItems = (team: Team) => {
    return snap.quiz.specs.players - team.players.length
  }

  const filled = () => {
    return snap.snapshot.teams.filter((team) => remainingItems(team) === 0).length === snap.quiz.specs.teams;
  }

  // const empty = (team: Team) => {
  //   var s = []
  //   for (var i = 0; i < remainingItems(team); i++) {
  //     s.push(<Popover key={i} content={renderPlayer(emptyPlayer(), props)} />)
  //   }
  //   return s
  // }

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
    if (team.players.length === 0) return <></>
    return <div className='lobby__team--player' key={`roster team ${team.id}`}>
      {tm(team)}
      {/* {empty(team).map(ent => ent)} */}
    </div>
  }

  const roster = 
    <div className='lobby__teams'>
      {snap.snapshot.teams.map((team, ix) =>
        <div className='lobby__team' key={`lobby ${ix}`}>
          <p className={classNames('lobby__team--name', playerInTeam(team) && 'lobby__team--name--editable')}>{team.name} ({team.players.length}/{snap.quiz.specs.players})</p>
          {teamRoster(team)}
        </div>)}
    </div>

  return (
    <div className='lobby__wrapper'>
      <div className='lobby__header'>
        <Header />
      </div>
      <p className='lobby__quiz--id--value lobby__quiz--id' onClick={quizIdCopied}>Quiz Id: {removePunctuations(snap.quiz.id)}</p>
      <p className='lobby__quiz--id--label lobby__quizmaster'><span className='lobby__label'>Quizmaster</span><br/>{snap.quiz.quizmaster.name}</p>
      <p className='lobby__quiz--id--label lobby__player'><span className='lobby__label'>Player</span><br/>{snap.player.name}</p>
      {roster}
      {waiting}
      <div className='lobby__start'>
        <Query
          label={!filled() ? 'waiting...' : (snap.role === ROLE_QUIZMASTER) ? 'start' : ''}
          visible={!(filled() && snap.role !== ROLE_QUIZMASTER)}
          onClick={() => {
            if (filled()) start()
          }}></Query>
      </div>
    </div>
  )
}
