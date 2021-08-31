import classNames from 'classnames/bind'
import { Player } from '../../utils/_interfaces'
import './Scoreboard.scss'

type Props = {
  players: Player[]
  visibility: Boolean
}

type TableProps = {
  players: Player[]
}

const Table = (props: TableProps) => {
  return (
    <div className='table'>
      {props.players.map((player, ix) => {
        return <div className='table--row'>
          <div className='table--cell'>{ix + 1}</div>
          <div className='table--cell'>{player.name}</div>
          <div className='table--cell'>{player.score}</div>
        </div>
      })}
    </div>
  )
}

const Scoreboard = (props: Props) => {

  return (
    <div className={classNames(
      'scoreboard__wrapper',
      props.visibility && 'scoreboard__wrapper-visible')} >
      <div className='scoreboard__foreground'>
        <p className='scoreboard__header'>Tally</p>
        <Table players={props.players} />
      </div>
    </div>
  )
}

export default Scoreboard