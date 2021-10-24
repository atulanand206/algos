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
import { Divider } from "../../components/Divider/Divider"

type BoardProps = {
}

export const Board = (props: BoardProps) => {

	const snap = useSnapshot(state)

	const quizIdCopied = () => {
		navigator.clipboard.writeText(snap.snapshot.quiz_id)
	}

	const visHint = () => {
		return snap.role === ROLE_QUIZMASTER && snap.snapshot.event_type !== "RIGHT"
	}

	const visPass = () => {
		return snap.role === ROLE_PLAYER && snap.snapshot.team_s_turn === getPlayersTeamId(snap) && snap.snapshot.can_pass
	}

	const visRight = () => {
		return snap.role === ROLE_QUIZMASTER && snap.snapshot.event_type !== "RIGHT"
	}

	const visNext = () => {
		return snap.role === ROLE_QUIZMASTER && snap.snapshot.event_type === "RIGHT"
	}

	const removePunctuations = (str: string) => {
		return str.replace('["-.,:;!@#$%^&*()_+="]', "").toUpperCase()
	}

	const queryHint = () => {
		WebSckts.send(Action.HINT, JSON.stringify(snapshotRequest(snap, Action.HINT)))
	}

	const queryRight = () => {
		WebSckts.send(Action.RIGHT, JSON.stringify(snapshotRequest(snap, Action.RIGHT)))
	}

	const queryNext = () => {
		WebSckts.send(Action.NEXT, JSON.stringify(snapshotRequest(snap, Action.NEXT)))
	}

	const queryPass = () => {
		WebSckts.send(Action.PASS, JSON.stringify(snapshotRequest(snap, Action.PASS)))
	}

	// const renderControlsLeft = <div className='board__controls'>
	// 	<div className='board__controls--right'>
	// 		<Query label={"Rules"} onClick={queryRules} visible={true} />
	// 		<Query label={"Guide"} onClick={queryGuide} visible={true} />
	// 	</div>
	// 	<div className='board__controls--right'>
	// 		<Query label={"Link"} onClick={queryLink} visible={true} />
	// 		<Query label={"Extend"} onClick={queryExtend} visible={true} />
	// 	</div>
	// </div>

	const renderControlsRight = <div className='board__controls'>
		<div className='board__controls--right'>
			<Query label={"Hint"} onClick={queryHint} visible={visHint()} />
			<Query label={"Pass"} onClick={queryPass} visible={visPass()} />
			<Query label={"Right"} onClick={queryRight} visible={visRight()} />
			<Query label={"Next"} onClick={queryNext} visible={visNext()} />
		</div>
	</div>

	const HeaderFixed = <div className='board__dets board__dets--fixed'>
		<Header />
		<div className='board__dets--sub'>
			<p className='board__info'>{`${snap.snapshot.question_no} - ${snap.snapshot.round_no}`}</p>
			<p className='board__name'>{snap.player.name}</p>
			<p className='board__quizid' onClick={quizIdCopied}>Quiz id: {removePunctuations(snap.snapshot.quiz_id)}</p>
		</div>
	</div>

	const FooterFixed = <div className='board__footer board__footer--fixed'>
		{renderControlsRight}
	</div>

	return <div className='board__wrapper'>

		{HeaderFixed}

		<div className='board__body'>
			<Divider />
			<div className='board__column board__column--left'>
				<div className='board__questions'>{snap.snapshot.question && snap.snapshot.question.map(line => <p className='board__questions--line'>{line}</p>)}</div>
			</div>
			<Divider />
			<div className='board__column board__column--left'>
				<p className='board__hint'>{snap.hintRevealed && snap.snapshot.hint}</p>
			</div>
			<Divider />
			<div className='board__answers'>
				<p className='board__answer'>{snap.answerRevealed && snap.snapshot.answer}</p>
			</div>
			<Divider />
			<div className='board__column board__column--right'>
				<State teams={snap.snapshot.teams} currentTeamId={snap.snapshot.team_s_turn} />
			</div>
			<Divider />
		</div>

		{FooterFixed}
	</div>
}