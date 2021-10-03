import classNames from 'classnames'
import { Score, Team } from '../../utils/_interfaces'
import './Scoreboard.scss'

type Props = {
  teams: Team[]
  score: Score
}

type TableProps = {
  teams: Team[]
}

const Table = (props: TableProps) => {
  return (
    <div className='table'>
      {props.teams.map((team, ix) => {
        return <div className='table--card' key={ix} >
          <div className='table--row'>{team.name}</div>
          <div className='table--subtable'>{team.players.map((player, iy) => {
            return (
              <div className='table--row'>
                <div className='table--cell'>{player.name}</div>
              </div>
            )
          })}</div>
        </div>
      })}
    </div>
  )
}

const Scoreboard = (props: Props) => {

  var teams = props.teams.map((team) => {
    return team
  })

  return (
    <div className={classNames(
      'scoreboard__wrapper',
      'scoreboard__wrapper-visible')} >
      <Table teams={teams} />
    </div>
  )
}

export default Scoreboard