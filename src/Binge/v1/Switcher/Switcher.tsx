import { useSnapshot } from "valtio"
import { Board } from "../pages/Board/Board"
import { QuizCreator, Reception } from "../pages/Reception/Reception"
import * as GameManager from "../dataStore/GameManager"
import { Landing } from "../pages/Landing/Landing"
import { Lobby } from "../pages/Lobby/Lobby"
import { state } from "../state/State"
import './../controller/Controller.scss'

type SwitchProps = {}

export const Switcher = (props: SwitchProps) => {

  const snap = useSnapshot(state)
  const { page, quizzes, can_create_quiz } = snap

  const view = () => {
    switch (page) {
      case 'reception': return <Reception
        canCreateQuiz={can_create_quiz}
        quizzes={quizzes}
        onJoin={(quizId) => GameManager.joinPlayer(snap, quizId)}
        onWatch={(quizId) => GameManager.joinAudience(snap, quizId)} />
      case 'create': return <QuizCreator 
        onCreate={(specs) => GameManager.createQuiz(snap, specs)}/>
      case 'quiz': return <Board />
      case 'lobby': return <Lobby />
      case '': return <Landing 
        onLogin={(player) => GameManager.onLoginSuccess(snap, player)} />
    }
  }

  return (
    <div className='quiz__wrapper'>
      <div className='quiz__wrapper__background' />
      {view()}
    </div>
  )
}
