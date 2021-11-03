import { useSnapshot } from "valtio"
import { Board } from "../pages/Board/Board"
import { QuizCreator, Reception } from "../pages/Credentials/Credentials"
import * as GameManager from "../dataStore/GameManager"
import { Landing } from "../pages/Landing/Landing"
import { Lobby } from "../pages/Lobby/Lobby"
import { state } from "../state/State"
import './../controller/Controller.scss'

type SwitchProps = {}

export const Switcher = (props: SwitchProps) => {

  const snap = useSnapshot(state)

  const view = () => {
    switch (snap.page) {
      case 'reception': return <Reception
        canCreateQuiz={snap.can_create_quiz}
        quizzes={snap.quizzes}
        onJoin={(quizId) => GameManager.joinPlayer(snap, quizId)}
        onWatch={(quizId) => GameManager.joinAudience(snap, quizId)} />
      case 'create': return <QuizCreator 
        onCreate={(specs) => GameManager.createQuiz(snap, specs)}/>
      case 'quiz': return <Board />
      case 'lobby': return <Lobby />
      case '': return <Landing />
    }
  }

  return (
    <div className='quiz__wrapper'>
      <div className='quiz__wrapper__background' />
      {view()}
    </div>
  )
}
