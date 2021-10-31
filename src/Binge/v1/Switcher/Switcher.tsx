import { useSnapshot } from "valtio"
import { Board } from "../pages/Board/Board"
import { QuizCreator, Reception } from "../pages/Credentials/Credentials"
import { Landing } from "../pages/Landing/Landing"
import { Lobby } from "../pages/Lobby/Lobby"
import { state } from "../state/State"
import './../controller/Controller.scss'

type SwitchProps = {}

export const Switcher = (props: SwitchProps) => {

  const snap = useSnapshot(state)

  const view = () => {
    switch(snap.page) {
      case 'reception': return <Reception />
      case 'create': return <QuizCreator />
      case 'quiz': return <Board />
      case 'lobby': return <Lobby />
      case '': return <Landing />
    }
  }
  
  return (
    <div className='quiz__wrapper'>
      {view()}
    </div>
  )
}
