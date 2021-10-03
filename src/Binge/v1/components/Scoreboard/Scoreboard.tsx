import { Team } from '../../utils/_interfaces'
import './Scoreboard.scss'

type Props = {
  teams: Team[]
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

  return <Table teams={props.teams} />
  // return (
  //   <div className={classNames(
  //     'scoreboard__wrapper',
  //     'scoreboard__wrapper-visible')} >
  //     <div className='scoreboard__foreground'>
  //       <p className='scoreboard__header'>Scoreboard</p>
  //       <div className='scoreboard__close'>
  //         <Button variant='contained' color='primary'>Close</Button>
  //       </div>
  //     </div>
  //   </div>
  // )
}

export default Scoreboard