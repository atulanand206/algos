import { ROLE_QUIZMASTER, ROLE_PLAYER } from "../../features/Features"
import { Header } from "../../components/Header/Header"
import { Query } from "../../components/Query/Query"
import { State } from "../../components/State/State"
import { getPlayersTeamId } from "../../dataStore/DataStore"
import './Board.scss'
import { Game, Player, Snap } from "../../utils/_interfaces"

type BoardProps = {
	player: Player
	quiz: Game
	role: string
	snapshot: Snap
	answerRevealed: boolean
	onPass: () => void
	onNext: () => void
	onRight: () => void
}

export const Board = (props: BoardProps) => {

	const quizIdCopied = () => {
		navigator.clipboard.writeText(props.snapshot.quiz_id)
	}

	const visPass = () => {
		return props.role === ROLE_PLAYER && props.snapshot.team_s_turn === getPlayersTeamId(props.role, props.snapshot, props.player.id) && props.snapshot.can_pass
	}

	const visRight = () => {
		return props.role === ROLE_QUIZMASTER && props.snapshot.event_type !== "RIGHT"
	}

	const visNext = () => {
		return props.role === ROLE_QUIZMASTER && (props.snapshot.event_type === "RIGHT" || !props.snapshot.can_pass)
	}
	
	const teams = [...props.snapshot.teams]

	const rankedTeams = () => {
		return teams.sort((a, b) => b.score - a.score)
	}

	return <div className='board__wrapper'>
		<div className='board__wrapper--background'></div>
		<div className='board__header--background'></div>
		<div className='board__header--logo'><Header /></div>
		<div className='board__header--block board__header--top board__header--right'>
			<p className='board__header--value'>Question {props.snapshot.question_no}</p>
		</div>
		<div className='board__header--block board__header--bottom board__header--right'>
			<p className='board__header--value'>Round {props.snapshot.round_no}</p>
		</div>
		<div className='board__header--block board__header--bottom board__header--left'>
			<p className='board__header--value'>{props.player.name}</p>
		</div>
		<div className='board__header--block board__header--top board__header--left board__header--quizid'>
			<p className='board__header--value' onClick={quizIdCopied}>{props.quiz.specs.name}</p>
		</div>

		<div className='board__body'>
			<div className='board__column board__questions'>
				{props.snapshot.question && props.snapshot.question.map(line => <p className='board__questions--line'>{line}</p>)}
			</div>
			{/* <div className='board__column'>
				<p className='board__hint'>{snap.hintRevealed && snap.snapshot.hint.map(line => <p className='board__questions--line'>{line}</p>)}</p>
			</div> */}
			{/* <div></div> */}
			{props.answerRevealed ? <div className='board__column'><p className='board__answer'>{props.snapshot.answer.map(line => <p className='board__answers--line'>{line}</p>)}</p></div> : <div></div>} 
		</div>

		<div className='board__controls'>
			<Query label={"Pass"} onClick={props.onPass} visible={visPass()} />
			<Query label={"Right"} onClick={props.onRight} visible={visRight()} />
			<Query label={"Next"} onClick={props.onNext} visible={visNext()} />
		</div>
		
		<div className='board__footer'>
			<State teams={rankedTeams()} currentTeamId={props.snapshot.team_s_turn} />
		</div>

	</div>
}