import { useState } from 'react'
import { QueryBoard, QueryType } from '../Query/Query'
import { State } from '../State/State'
import Scoreboard from '../Scoreboard/Scoreboard'
import Prompt from '../Prompt/Prompt'
import './Landing.scss'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../Features/Features'
import { Header } from '../Header/Header'
import Game from '../Data/game.json'

type Props = {
  gameOver: () => void
}

export const Board = (props: Props) => {

  const [attempts, setAttempts] = useState(Game.attempts)
  const [players, setPlayers] = useState(Game.players)
  const [questions, setQuestions] = useState(Game.questions)

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
  const [scoreBoardVisibility, setScoreboardVisibility] = useState(false)

  const over = () => {
    setGameOver(true)
    setScoreboardVisibility(true)
  }

  const nextPlayer = () => (currentPlayerId + 1) % players.length

  const queryApprove = () => {
    if (questions.length === currentQuestionId + 1) {
      over()
    } else {
      players[currentPlayerId].score += currentPoints
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
    setScoreboardVisibility(true)
  }

  const queryReduce = () => {
    if (currentPoints === 10) setCurrentPoints(5)
    else setCurrentPoints(2)
  }

  const queryBonus = () => {
    players[currentPlayerId].score += bonus
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

  const closeScoreboard = () => {
    if (gameOver) {
      props.gameOver()
      return
    }
    setScoreboardVisibility(false)
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


  const renderScoreBoard = <Scoreboard visibility={scoreBoardVisibility} players={players} close={closeScoreboard} />

  return (
    <div className='board__wrapper'>
      <Header />
      {renderPrompt}
      {renderState}
      {renderQueryBoard()}
      {renderScoreBoard}
    </div>
  )


}