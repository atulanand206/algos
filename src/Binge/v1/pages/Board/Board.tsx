import { Query } from '../../components/Query/Query'
import { State } from '../../components/State/State'
import './Board.scss'
import { ROLE_QUIZMASTER } from '../../../Features/Features'
import { Header } from '../../components/Header/Header'
import { Game, Player, Question, TeamMini } from '../../utils/_interfaces'

type Props = {
  quiz: Game
  teams: TeamMini[]
  currentTeamId: string
  player: Player
  role: string
  currentRound: number
  extendRound: () => void
  timeElapsed: number
  question: Question
  currentQuestionNo: number
  answer: string
  answerRevealed: boolean
  hint: string
  hintRevealed: boolean
  hintQuestion: () => void
  passQuestion: () => void
  nextQuestion: () => void
  rightQuestion: () => void
  gameOver: () => void
}

export const Board = (props: Props) => {

  const queryRules = () => {
  }

  const queryGuide = () => {
  }

  const queryLink = () => {
  }

  const renderState = <State teams={props.teams} currentTeamId={props.currentTeamId} />

  const renderControlsLeft = <div className='board__controls'>
    <div className='board__controls--right'>
      <Query label={"Rules"} onClick={queryRules} />
      <Query label={"Guide"} onClick={queryGuide} />
    </div>
    <div className='board__controls--right'>
      <Query label={"Extend"} onClick={props.extendRound} />
      <Query label={"Link"} onClick={queryLink} />
    </div>
  </div>

  const renderControlsRight = <div className='board__controls'>
    <div className='board__controls--right'>
      <Query label={"Hint"} onClick={props.hintQuestion} hidden={props.role !== ROLE_QUIZMASTER} />
      <Query label={"Pass"} onClick={props.passQuestion} hidden={props.role !== ROLE_QUIZMASTER} />
    </div>
    <div className='board__controls--right'>
      <Query label={"Right"} onClick={props.rightQuestion} />
      <Query label={"Next"} onClick={props.nextQuestion} />
    </div>
  </div>

  return (
    <div className='board__wrapper'>
      <Header />
      <p className=''>{props.player.name}</p>
      <div className='board__columns'>
        <div className='board__column board__column--left'>
          <p className='board__quizid'>{props.quiz.id}</p>
          <p className='board__info'>{`${props.currentQuestionNo} - ${props.currentRound} - ${props.timeElapsed}`}</p>
          <div className='board__questions'>{props.question.statements.map(line => <p className='board__questions--line'>{line}</p>)}</div>
          {renderControlsLeft}
        </div>
        <div className='board__column board__column--right'>
          {renderState}
          <div className='board__answers'>
            <p className='board__answer'>{props.answerRevealed && props.answer}</p>
            <p className='board__hint'>{props.hintRevealed && props.hint}</p>
          </div>
          {props.role === ROLE_QUIZMASTER && renderControlsRight}
        </div>
      </div>
    </div>
  )
}