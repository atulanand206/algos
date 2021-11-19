import { useSnapshot } from "valtio"
import { Board } from "../pages/Board/Board"
import { QuizCreator, Reception } from "../pages/Reception/Reception"
import * as GameManager from "../dataStore/GameManager"
import { Landing } from "../pages/Landing/Landing"
import { Podium } from "../pages/Podium/Podium"
import { Lobby } from "../pages/Lobby/Lobby"
import { state } from "../state/State"
import './../controller/Controller.scss'

type SwitchProps = {}

export const Switcher = (props: SwitchProps) => {

  const snap = useSnapshot(state)
  const { page, quizzes, can_create_quiz } = snap

  const view = () => {
    switch (page) {
      case '': return <Landing 
        onLogin={(player) => GameManager.onLoginSuccess(snap, player)} />
      case 'create': return <QuizCreator 
        onCreate={(specs) => GameManager.createQuiz(snap, specs)}/>
      case 'reception': return <Reception
        canCreateQuiz={can_create_quiz}
        quizzes={quizzes}
        onJoin={(quizId) => GameManager.joinPlayer(snap, quizId)}
        onWatch={(quizId) => GameManager.joinAudience(snap, quizId)} />
      case 'lobby': return <Lobby 
        player={snap.player} 
        quiz={snap.quiz}
        role={snap.role}
        teams={snap.snapshot.teams}
        onStart={() => GameManager.start(snap)} />
      case 'quiz': return <Board 
        player={snap.player}   
        quiz={snap.quiz}
        role={snap.role}
        snapshot={snap.snapshot}
        answerRevealed={snap.answerRevealed} 
        onPass={() => GameManager.queryPass(snap)}
        onNext={() => GameManager.queryNext(snap)}
        onRight={() => GameManager.queryRight(snap)}
        onFinish={() => GameManager.queryFinish(snap)} />
      case 'podium': return <Podium 
        player={snap.player}   
        quiz={snap.quiz}
        role={snap.role}
        snapshot={snap.snapshot}
        onNext={() => GameManager.queryNext(snap)} />
    }
  }

  return (
    <div className='quiz__wrapper'>
      <div className='quiz__wrapper__background' />
      {view()}
    </div>
  )
}
