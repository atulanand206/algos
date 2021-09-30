import { Game } from "../utils/_interfaces"
import './Lobby.scss'

type Props = {
  quiz: Game
}

export const Lobby = (props: Props) => {

  return (
    <div className='lobby__wrapper'>
      <p className='lobby__logo'>Binquiz</p>


    </div>
  )
}