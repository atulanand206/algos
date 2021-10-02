import { useEffect, useState } from 'react'
import { Query } from '../../components/Query/Query'
import { State } from '../../components/State/State'
import Scoreboard from '../../../Scoreboard/Scoreboard'
import './Board.scss'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../../Features/Features'
import { Header } from '../../components/Header/Header'
import Games from '../../data/game.json'
import { Answer, Game, Player, Question, Team } from '../../utils/_interfaces'
import { format } from '../../utils/_helpers'
import { WebSckts } from '../../utils/_websockets'
import { Action } from '../../utils/Action'

type Props = {
  quiz: Game
  teams: Team[]
  currentTeamId: string
  player: Player
  role: string
  question: Question
  setQuiz: (quiz: Game) => void
  setQuestion: (question: Question) => void
  gameOver: () => void
}

export const Board = (props: Props) => {

  const [role] = useState(props.role)
  const [teams] = useState(props.teams)
  const [rounds, setRounds] = useState(2)
  const [question] = useState(props.question)
  const [answer, setAnswer] = useState('')
  const [hint, setHint] = useState('')

  const [currentQuestionNo, setCurrentQuestionNo] = useState(0)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [hintRevealed, setHintRevealed] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [passed, setPassed] = useState(0)
  const [currentPoints, setCurrentPoints] = useState(10)
  const [roundOpenerTeamIdx, setRoundOpenerTeamIdx] = useState(0)

  const [currentTeamId, setCurrentTeamId] = useState(props.currentTeamId)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    window.setTimeout(() => {
      setTimeElapsed(timeElapsed + 1)
    }, 1000);
  })

  useEffect(() => {
    if (props.quiz.tags) setCurrentQuestionNo(props.quiz.tags.length + 1)
    else setCurrentQuestionNo(1)
    setPassed(0)
    setTimeElapsed(0)
  }, [props.quiz.tags])

  const [snap, setSnap] = useState({
    quiz_id: '',
    team_s_turn: '',
    question_id: ''
  })

  useEffect(() => {
    return setSnap({ quiz_id: props.quiz.id, team_s_turn: currentTeamId, question_id: question.id })
  }, [props.quiz.id, question.id, currentTeamId])

  const currentTeamIdx = () => {
    for (var i = 0; i < teams.length; i++) {
      if (teams[i].id === currentTeamId)
        return i
    }
    return -1
  }

  const queryHint = () => {
    WebSckts.sendAndReceive(Action.HINT, JSON.stringify(snap), Action.S_HINT, (response) => {
      const res = JSON.parse(response)
      console.log(res)
      if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
        console.log(res)
        setHint(res.hint)
        setHintRevealed(true)
      }
    })
  }

  const queryRight = () => {
    WebSckts.sendAndReceive(Action.RIGHT, JSON.stringify(snap), Action.S_RIGHT, (response) => {
      const res = JSON.parse(response)
      console.log(res)
      if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
        console.log(res)
        setAnswer(res.answer)
        setAnswerRevealed(true)
      }
    })
  }

  const queryPass = () => {
    if (passed === rounds * teams.length) return
    WebSckts.sendAndReceive(Action.PASS, JSON.stringify(snap), Action.S_PASS, (response) => {
      const res = JSON.parse(response)
      if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
        setPassed(passed + 1)
        setCurrentTeamId(res.team_s_turn)
      }
    })
  }

  const queryNext = () => {
    WebSckts.sendAndReceive(Action.NEXT, JSON.stringify(snap), Action.S_NEXT, (response) => {
      const res = JSON.parse(response)
      if (res.quiz_id === snap.quiz_id && res.last_question_id === snap.question_id) {
        props.setQuestion(res.question)
        setRoundOpenerTeamIdx(res.team_s_turn)
        setCurrentTeamId(res.team_s_turn)
      }
    })
  }

  const queryRules = () => {
  }

  const queryGuide = () => {
  }

  const queryLink = () => {
  }

  const queryExtend = () => {
  }

  const renderState = <State teams={props.teams} currentTeamId={currentTeamIdx()} />

  const renderControlsLeft = <div className='board__controls'>
    <div className='board__controls--right'>
      <Query label={"Rules"} onClick={queryRules} />
      <Query label={"Guide"} onClick={queryGuide} />
    </div>
    <div className='board__controls--right'>
      <Query label={"Extend"} onClick={queryExtend} />
      <Query label={"Link"} onClick={queryLink} />
    </div>
  </div>

  const renderControlsRight = <div className='board__controls'>
    <div className='board__controls--right'>
      <Query label={"Hint"} onClick={queryHint} hidden={role !== ROLE_QUIZMASTER} />
      <Query label={"Pass"} onClick={queryPass} hidden={role !== ROLE_QUIZMASTER} />
    </div>
    <div className='board__controls--right'>
      <Query label={"Right"} onClick={queryRight} />
      <Query label={"Next"} onClick={queryNext} />
    </div>
  </div>

  return (
    <div className='board__wrapper'>
      <Header />
      <p className=''>{props.player.name}</p>
      <div className='board__columns'>
        <div className='board__column board__column--left'>
          <p className='board__quizid'>{props.quiz.id}</p>
          <p className='board__info'>{`${currentQuestionNo} - ${currentRound} - ${timeElapsed}`}</p>
          <div className='board__questions'>{question.statements.map(line => <p className='board__questions--line'>{line}</p>)}</div>
          {renderControlsLeft}
        </div>
        <div className='board__column board__column--right'>
          {renderState}
          <div className='board__answers'>
            <p className='board__answer'>{answerRevealed && answer}</p>
            <p className='board__hint'>{hintRevealed && hint}</p>
          </div>
          {role === ROLE_QUIZMASTER && renderControlsRight}
        </div>
      </div>
    </div>
  )
}