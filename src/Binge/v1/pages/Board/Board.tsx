import { ROLE_QUIZMASTER, ROLE_PLAYER } from "../../features/Features"
import { Header } from "../../components/Header/Header"
import { Query } from "../../components/Query/Query"
import { State } from "../../components/State/State"
import { snapshotRequest, getPlayersTeamId } from "../../dataStore/DataStore"
import { Action } from "../../utils/Action"
import { WebSckts } from "../../utils/_websockets"
import { state } from "./../../state/State"
import { useSnapshot } from "valtio"
import './Board.scss'

type BoardProps = {
}

export const Board = (props: BoardProps) => {

	const snap = useSnapshot(state)

	const quizIdCopied = () => {
		navigator.clipboard.writeText(snap.snapshot.quiz_id)
	}

	// const visHint = () => {
	// 	return snap.role === ROLE_QUIZMASTER && snap.snapshot.event_type !== "RIGHT"
	// }

	const visPass = () => {
		return snap.role === ROLE_PLAYER && snap.snapshot.team_s_turn === getPlayersTeamId(snap) && snap.snapshot.can_pass
	}

	const visRight = () => {
		return snap.role === ROLE_QUIZMASTER && snap.snapshot.event_type !== "RIGHT"
	}

	const visNext = () => {
		return snap.role === ROLE_QUIZMASTER && (snap.snapshot.event_type === "RIGHT" || !snap.snapshot.can_pass)
	}

	// const queryHint = () => {
	// 	WebSckts.send(Action.HINT, JSON.stringify(snapshotRequest(snap, Action.HINT)))
	// }

	const queryRight = () => {
		WebSckts.send(Action.RIGHT, JSON.stringify(snapshotRequest(snap, Action.RIGHT)))
	}

	const queryNext = () => {
		WebSckts.send(Action.NEXT, JSON.stringify(snapshotRequest(snap, Action.NEXT)))
	}

	const queryPass = () => {
		WebSckts.send(Action.PASS, JSON.stringify(snapshotRequest(snap, Action.PASS)))
	}

	const rankedTeams = () => {
		return teams.sort((a, b) => b.score - a.score)
	}
	
	const teams = [...snap.snapshot.teams]

	return <div className='board__wrapper'>
		<div className='board__wrapper--background'></div>
		<div className='board__header--background'></div>
		<div className='board__header--logo'><Header /></div>
		<div className='board__header--block board__header--top board__header--right'>
			<p className='board__header--value'>Question {snap.snapshot.question_no}</p>
		</div>
		<div className='board__header--block board__header--bottom board__header--right'>
			<p className='board__header--value'>Round {snap.snapshot.round_no}</p>
		</div>
		<div className='board__header--block board__header--bottom board__header--left'>
			<p className='board__header--value'>{snap.player.name}</p>
		</div>
		<div className='board__header--block board__header--top board__header--left board__header--quizid'>
			<p className='board__header--value' onClick={quizIdCopied}>{snap.quiz.specs.name}</p>
		</div>

		<div className='board__body'>
			<div className='board__column board__questions'>
				{snap.snapshot.question && snap.snapshot.question.map(line => <p className='board__questions--line'>{line}</p>)}
			</div>
			{/* <div className='board__column'>
				<p className='board__hint'>{snap.hintRevealed && snap.snapshot.hint.map(line => <p className='board__questions--line'>{line}</p>)}</p>
			</div> */}
			{/* <div></div> */}
			{snap.answerRevealed ? <div className='board__column'><p className='board__answer'>{snap.snapshot.answer.map(line => <p className='board__answers--line'>{line}</p>)}</p></div> : <div></div>} 
		</div>

		<div className='board__controls'>
			<Query label={"Pass"} onClick={queryPass} visible={visPass()} />
			<Query label={"Right"} onClick={queryRight} visible={visRight()} />
			<Query label={"Next"} onClick={queryNext} visible={visNext()} />
		</div>
		
		<div className='board__footer'>
			<State teams={rankedTeams()} currentTeamId={snap.snapshot.team_s_turn} />
		</div>

	</div>
}