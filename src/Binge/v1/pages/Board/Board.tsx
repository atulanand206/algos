import { Divider } from "@material-ui/core"
import { ROLE_QUIZMASTER, ROLE_PLAYER } from "../../../Features/Features"
import { Header } from "../../components/Header/Header"
import { Query } from "../../components/Query/Query"
import { State } from "../../components/State/State"
import { DataStoreManager } from "../../dataStore/DataStoreManager"
import { Action } from "../../utils/Action"
import { WebSckts } from "../../utils/_websockets"

type BoardProps = {
}

export const Board = (props: BoardProps) => {

	const quizIdCopied = () => {
		navigator.clipboard.writeText(DataStoreManager._instance.dataStore.snapshot.quiz_id)
	}

	const visHint = () => {
		return DataStoreManager._instance.dataStore.role === ROLE_QUIZMASTER
	}

	const visPass = () => {
		return DataStoreManager._instance.dataStore.role === ROLE_PLAYER && DataStoreManager._instance.dataStore.snapshot.team_s_turn === DataStoreManager._instance.dataStore.getPlayersTeamId	
	}

	const visRight = () => {
		return DataStoreManager._instance.dataStore.role === ROLE_QUIZMASTER && DataStoreManager._instance.dataStore.snapshot.event_type !== "RIGHT"
	}

	const visNext = () => {
		return DataStoreManager._instance.dataStore.role === ROLE_QUIZMASTER && DataStoreManager._instance.dataStore.snapshot.event_type === "RIGHT"
	}

	const removePunctuations = (str: string) => {
		return str.replace('["-.,:;!@#$%^&*()_+="]', "").toUpperCase()
	}

	const queryHint = () => {
		const obj = { action: Action.HINT, snapshot: DataStoreManager._instance.dataStore.snapshotRequest }
		WebSckts.send(Action.HINT, JSON.stringify(obj))
	}

	const queryRight = () => {
    const obj = { action: Action.RIGHT, snapshot: DataStoreManager._instance.dataStore.snapshotRequest }
		WebSckts.send(Action.RIGHT, JSON.stringify(obj))
	}

	const queryNext = () => {
    const obj = { action: Action.NEXT, snapshot: DataStoreManager._instance.dataStore.snapshotRequest }
		WebSckts.send(Action.NEXT, JSON.stringify(obj))
	}

	const queryPass = () => {
    const obj = { action: Action.PASS, snapshot: DataStoreManager._instance.dataStore.snapshotRequest }
		WebSckts.send(Action.PASS, JSON.stringify(obj))
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
			<p className='board__info'>{`${DataStoreManager._instance.dataStore.snapshot.question_no} - ${DataStoreManager._instance.dataStore.snapshot.round_no}`}</p>
			<p className='board__name'>{DataStoreManager._instance.dataStore.player.name}</p>
			<p className='board__quizid' onClick={quizIdCopied}>Quiz id: {removePunctuations(DataStoreManager._instance.dataStore.snapshot.quiz_id)}</p>
		</div>
	</div>

	const FooterFixed = <div className='board__footer board__footer--fixed'>
		<div className='board__column board__column--right'>
			{renderControlsRight}
		</div>
	</div>

  const HeaderSticky = <div className='board__dets board__dets--sticky' />

  const FooterSticky = <div className='board__footer board__footer--sticky' />
	
	return <div className='board__wrapper'>

		{HeaderFixed}
		{FooterFixed}

		{HeaderSticky}
			
		<div className='board__body'>
			<Divider />		
			<div className='board__column board__column--left'>
				<div className='board__questions'>{DataStoreManager._instance.dataStore.snapshot.question && DataStoreManager._instance.dataStore.snapshot.question.map(line => <p className='board__questions--line'>{line}</p>)}</div>
			</div>
			<Divider />
			<div className='board__column board__column--left'>
				<p className='board__hint'>{DataStoreManager._instance.dataStore.hintRevealed && DataStoreManager._instance.dataStore.snapshot.hint}</p>
			</div>
			<Divider />
			<div className='board__answers'>
				<p className='board__answer'>{DataStoreManager._instance.dataStore.answerRevealed && DataStoreManager._instance.dataStore.snapshot.answer}</p>
			</div>
			<Divider />
			<div className='board__column board__column--right'>
				<State teams={DataStoreManager._instance.dataStore.snapshot.roster} currentTeamId={DataStoreManager._instance.dataStore.snapshot.team_s_turn} />
			</div>
			<Divider />
		</div>

		{FooterSticky}

	</div>
}