import { Button } from "@material-ui/core"
import { Player } from "../v1/utils/_interfaces"
import './Scene.scss'

type Props = {
  players: Player[]
  ready: () => void
}

export const Scene = (props: Props) => {

  return (
    <div className='scene__wrapper'>
      {props.players.map(_ => <div className='scene__player'>
        <p className='scene__player--name'>{_.name}</p>
        <p className='scene__player--email'>{_.email}</p>
      </div>)}
      <Button variant='contained' color='primary' onClick={props.ready}>Ready</Button>
    </div>
  )
}