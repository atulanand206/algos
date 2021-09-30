import { useState } from 'react'
import { QueryBoard, QueryType } from '../../../Query/Query'
import { State } from '../../../State/State'
import Scoreboard from '../../../Scoreboard/Scoreboard'
import Prompt from '../../../Prompt/Prompt'
import './Board.scss'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../../Features/Features'
import { Header } from '../../../Header/Header'
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
  const [bonus, setBonus] = useState(10)

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

  const queryExtend = () => {
    setRounds(rounds + 1)
    setBonus(0)
  }

  const queryScore = () => {
  }

  const queryReduce = () => {
    if (currentPoints === 10) setCurrentPoints(5)
    else setCurrentPoints(2)
  }

  const queryBonus = () => {
    players[currentPlayerId].scores.current += bonus
    setPlayers(players)
  }

  const query = (queryType: QueryType) => {
    switch (queryType) {
      case QueryType.APPROVE: queryApprove(); break;
      case QueryType.EXTEND: queryExtend(); break;
      case QueryType.SCORE: queryScore(); break;
      case QueryType.REJECT: queryReject(); break;
      case QueryType.PASS: queryPass(); break;
      case QueryType.REDUCE_MAX: queryReduce(); break;
      case QueryType.BONUS: queryBonus(); break;
      case QueryType.HINT: queryHint(); break;
      case QueryType.REVEAL: queryReveal(); break;
      case QueryType.HIDE: queryHide(); break;
      default:
    }
  }

  const renderState = <State players={players} currentPlayerId={currentPlayerId} />

  const renderPrompt = <Prompt
    question={questions[currentQuestionId].question}
    answer={questions[currentQuestionId].answer}
    visibility={true}
    revealed={revealed} />

  const renderQueryBoard = () => {
    switch (role) {
      case ROLE_QUIZMASTER:
        return <QueryBoard onQuery={query} />
      default:
        return (<div></div>)
    }
  }



  return (
    <div className='board__wrapper'>
      <Header />
      {renderPrompt}
      {renderState}
      {renderQueryBoard()}
    </div>
  )


}