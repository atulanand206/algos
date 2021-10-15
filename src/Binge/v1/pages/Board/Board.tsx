import { Divider } from "@material-ui/core"
import { ROLE_QUIZMASTER, ROLE_PLAYER } from "../../../Features/Features"
import { Header } from "../../components/Header/Header"
import { Query } from "../../components/Query/Query"
import { State } from "../../components/State/State"
import { TeamMini, Snap } from "../../utils/_interfaces"

type BoardProps = {
	teams: TeamMini[]
	currentTeamId: string
	role: string
	playerName: string
	playersTeamId: string
	snap: Snap
	answerRevealed: boolean
	hintRevealed: boolean
	queryHint: () => void
	queryPass: () => void
	queryRight: () => void
	queryNext: () => void
}

export const Board = (props: BoardProps) => {

	const quizIdCopied = () => {
		navigator.clipboard.writeText(props.snap.quiz_id)
	}

	const visHint = () => {
		return props.role === ROLE_QUIZMASTER
	}

	const visPass = () => {
		return props.role === ROLE_PLAYER && props.snap.team_s_turn === props.playersTeamId	
	}

	const visRight = () => {
		return props.role === ROLE_QUIZMASTER && props.snap.event_type !== "RIGHT"
	}

	const visNext = () => {
		return props.role === ROLE_QUIZMASTER && props.snap.event_type === "RIGHT"
	}

	const removePunctuations = (str: string) => {
		return str.replace('["-.,:;!@#$%^&*()_+="]', "").toUpperCase()
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
			<Query label={"Hint"} onClick={props.queryHint} visible={visHint()} />
			<Query label={"Pass"} onClick={props.queryPass} visible={visPass()} />
			<Query label={"Right"} onClick={props.queryRight} visible={visRight()} />
			<Query label={"Next"} onClick={props.queryNext} visible={visNext()} />
		</div>
	</div>

	const HeaderFixed = <div className='board__dets board__dets--fixed'>
		<Header />
		<div className='board__dets--sub'>
			<p className='board__info'>{`${props.snap.question_no} - ${props.snap.round_no}`}</p>
			<p className='board__name'>{props.playerName}</p>
			<p className='board__quizid' onClick={quizIdCopied}>Quiz id: {removePunctuations(props.snap.quiz_id)}</p>
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
				<div className='board__questions'>{props.snap.question && props.snap.question.map(line => <p className='board__questions--line'>{line}</p>)}</div>
			</div>
			<Divider />
			<div className='board__column board__column--left'>
				<p className='board__hint'>{props.hintRevealed && props.snap.hint}</p>
			</div>
			<Divider />
			<div className='board__answers'>
				<p className='board__answer'>{props.answerRevealed && props.snap.answer}</p>
			</div>
			<Divider />
			<div className='board__column board__column--right'>
				<State teams={props.teams} currentTeamId={props.currentTeamId} />
			</div>
			<Divider />
		</div>

		{FooterSticky}

	</div>
}