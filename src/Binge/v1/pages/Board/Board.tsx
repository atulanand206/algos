import { useEffect, useState } from 'react'
import { Query, QueryType } from '../../components/Query/Query'
import { State } from '../../../State/State'
import Scoreboard from '../../../Scoreboard/Scoreboard'
import './Board.scss'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../../Features/Features'
import { Header } from '../../components/Header/Header'
import Games from '../../data/game.json'
import { Game } from '../../utils/_interfaces'
import { format } from '../../utils/_helpers'

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
  const [currentQuestionNo, setCurrentQuestionNo] = useState(1)
  const [currentQuestionId, setCurrentQuestionId] = useState(0)
  const [currentTeamId, setCurrentTeamId] = useState(0)
  const [timeStart, setTimeStart] = useState(new Date())
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    window.setTimeout(() => {
      setTimeElapsed(timeElapsed + 1)
    }, 1000);
  })

  useEffect(() => {
    setTimeElapsed((new Date().getSeconds() - timeStart.getSeconds()))
  }, [timeStart])

  const [question, setQuestion] = useState(questions[currentQuestionId].question)
  const [answer, setAnswer] = useState(questions[currentQuestionId].answer)
  const [hint, setHint] = useState(questions[currentQuestionId].hint)

  useEffect(() => {
    setQuestion(questions[currentQuestionId].question)
    setAnswer(questions[currentQuestionId].answer)
    setHint(questions[currentQuestionId].hint)
  }, [questions, currentQuestionId])

  const over = () => {
    setGameOver(true)
  }

  const nextPlayer = () => (currentTeamId + 1) % players.length

  const queryRight = () => {
    if (questions.length === currentQuestionId + 1) {
      over()
    } else {
      players[currentTeamId].scores.current += currentPoints
      setPlayers(players)
      attempts.concat({ player: currentTeamId, question: currentQuestionId, points: currentPoints })
      setAttempts(attempts)
    }
  }

  const queryReject = () => {
    if (questions.length === currentQuestionId + 1) {
      over()
    } else {
      setRoundOpener(nextPlayer())
      setCurrentTeamId(nextPlayer())
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
          setCurrentTeamId(nextPlayer())
        }
      } else {
        setCurrentTeamId(nextPlayer())
      }
    }
  }

  const queryNext = () => {
    setCurrentQuestionId(currentQuestionId + 1)
    setRoundOpener(nextPlayer())
    setCurrentTeamId(nextPlayer())
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

  const renderState = <State teams={props.quiz.teams} currentTeamId={currentTeamId} />

  const renderControlsLeft = <div className='board__controls'>
    <div className='board__controls--right'>
      <Query queryType={QueryType.RULES} onQuery={queryRight} />
      <Query queryType={QueryType.GUIDE} onQuery={queryPass} />
    </div>
    <div className='board__controls--right'>
      <Query queryType={QueryType.EXTEND} onQuery={queryExtend} />
      <Query queryType={QueryType.LINK} onQuery={queryNext} />
    </div>
  </div>

  const renderControlsRight = <div className='board__controls'>
    <div className='board__controls--right'>
      <Query queryType={QueryType.HINT} onQuery={toggleHint} />
      <Query queryType={QueryType.PASS} onQuery={queryPass} />
    </div>
    <div className='board__controls--right'>
      <Query queryType={QueryType.RIGHT} onQuery={queryRight} />
      <Query queryType={QueryType.NEXT} onQuery={queryNext} />
    </div>
  </div>

  return (
    <div className='board__wrapper'>
      <Header />
      <div className='board__columns'>
        <div className='board__column board__column--left'>
          <p className='board__quizid'>{props.quiz.id}</p>
          <p className='board__info'>{`${currentQuestionNo} - ${currentRound} - ${timeElapsed}`}</p>
          <div className='board__questions'>{question.map(line => <p className='board__questions--line'>{line}</p>)}</div>
          {renderControlsLeft}
        </div>
        <div className='board__column board__column--right'>
          {renderState}
          <div className='board__answers'>
            <p className='board__answer'>{answer}</p>
            <p className='board__hint'>{hint}</p>
          </div>
          {renderControlsRight}
        </div>
      </div>
    </div>
  )
}