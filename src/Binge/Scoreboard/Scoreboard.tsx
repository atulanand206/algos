import { Button } from '@material-ui/core'
import classNames from 'classnames/bind'
import { Team } from '../v1/utils/_interfaces'
import './Scoreboard.scss'

type Props = {
  teams: Team[]
  visibility: boolean
  close: () => void
}

type TableProps = {
  teams: Team[]
}

const Table = (props: TableProps) => {
  return (
    <div className='table'>
      {props.teams.map((player, ix) => {
        return <div className='table--row' key={ix} >
          <div className='table--cell'>{ix + 1}</div>
          <div className='table--cell'>{player.name}</div>
          {/* <div className='table--cell'>{player.scores}</div> */}
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
        <p className='scoreboard__header'>Scoreboard</p>
        <div className='scoreboard__close'>
          <Button variant='contained' color='primary' onClick={() => props.close()}>Close</Button>
        </div>
        <Table teams={props.teams} />
      </div>
    </div>
  )
}

export default Scoreboard