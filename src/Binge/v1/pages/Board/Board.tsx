import { useEffect, useState } from 'react'
import { Query, QueryType } from '../../components/Query/Query'
import { State } from '../../../State/State'
import Scoreboard from '../../../Scoreboard/Scoreboard'
import './Board.scss'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../../Features/Features'
import { Header } from '../../components/Header/Header'
import Games from '../../data/game.json'
import { Game } from '../../utils/_interfaces'

type Props = {
  quiz: Game
  role: string
  gameOver: () => void
}

export const Board = (props: Props) => {

  const [attempts, setAttempts] = useState(Games.attempts)
  const [players, setPlayers] = useState(Games.players)
  const [questions, setQuestions] = useState(Games.questions)

  const [role, setRole] = useState(ROLE_QUIZMASTER)
  const [revealed, setRevealed] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [rounds, setRounds] = useState(2)
  const [roundOpener, setRoundOpener] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [currentPoints, setCurrentPoints] = useState(10)
  const [currentQuestionId, setCurrentQuestionId] = useState(0)
  const [currentPlayerId, setCurrentPlayerId] = useState(0)

  const [question, setQuestion] = useState(questions[currentQuestionId].question)
  const [answer, setAnswer] = useState(questions[currentQuestionId].answer)

  useEffect(() => {
    setQuestion(questions[currentQuestionId].question)
    setAnswer(questions[currentQuestionId].answer)
  }, [questions, currentQuestionId])

  const over = () => {
    setGameOver(true)
  }

  const nextPlayer = () => (currentPlayerId + 1) % players.length

  const queryApprove = () => {
    if (questions.length === currentQuestionId + 1) {
      over()
    } else {
      players[currentPlayerId].scores.current += currentPoints
      setPlayers(players)
      attempts.concat({ player: currentPlayerId, question: currentQuestionId, points: currentPoints })
      setAttempts(attempts)
      setCurrentQuestionId(currentQuestionId + 1)
      setRoundOpener(nextPlayer())
      setCurrentPlayerId(nextPlayer())
    }
  }

  const queryReject = () => {
    if (questions.length === currentQuestionId + 1) {
      over()
    } else {
      setRoundOpener(nextPlayer())
      setCurrentPlayerId(nextPlayer())
    }
  }

  const queryPass = () => {
    if (questions.length === currentQuestionId + 1) {
      over()
    } else {
      if (nextPlayer() === roundOpener) {
        if (currentRound === rounds) {
          queryReject()
        } else {
          setCurrentRound(currentRound + 1)
          setCurrentPlayerId(nextPlayer())
        }
      } else {
        setCurrentPlayerId(nextPlayer())
      }
    }
  }

  const queryHint = () => {
    //todo: fake
    setRole(ROLE_AUDIENCE)
    setRole(ROLE_PLAYER)
    setQuestions(questions)
  }

  const queryReveal = () => {
    setRevealed(true)
  }

  const queryHide = () => {
    setRevealed(false)
  }

  const toggleHint = () => {
    if (revealed) queryHide()
    else queryReveal()
  }

  const queryExtend = () => {
    setRounds(rounds + 1)
  }

  const queryScore = () => {
  }

  const renderState = <State players={players} currentPlayerId={currentPlayerId} />

  const renderControlsLeft = <div className='board__controls'>
    <Query queryType={QueryType.HINT} onQuery={function (queryType: QueryType): void {
      toggleHint()
    }} />
    <Query queryType={QueryType.EXTEND} onQuery={function (queryType: QueryType): void {
      queryExtend()
    }} />
  </div>

  const renderControlsRight = <div className='board__controls'>
    <Query queryType={QueryType.APPROVE} onQuery={function (queryType: QueryType): void {
      queryApprove()
    }} />
    <Query queryType={QueryType.PASS} onQuery={function (queryType: QueryType): void {
      queryPass()
    }} />
  </div>

  return (
    <div className='board__wrapper'>
      <Header />
      <div className='board__columns'>
        <div className='board__column board__column--left'>
          <p className='board__quizid'>{props.quiz.id}</p>
          {question.map(line => <p className='prompt__line'>{line}</p>)}
          {renderControlsLeft}
        </div>
        <div className='board__column board__column--right'>
          {renderState}
          <div className='board__answer'>{answer}</div>
          {renderControlsRight}
        </div>
      </div>
    </div>
  )
}