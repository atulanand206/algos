import { useEffect, useState } from 'react'
import { Credentials, Form_Credentials, Form_QuizMaster, Form_Player, Form_Audience, Entry_Name, Entry_Handle, Action_Create, Action_Join, Action_Watch, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId } from '../pages/Credentials/Credentials'
import { Landing } from '../pages/Landing/Landing'
import { WebSckts } from '../utils/_websockets'
import { Action } from "../utils/Action"
import './Controller.scss'
import './../pages/Board/Board.scss'
import { Lobby } from '../pages/Lobby/Lobby'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../Features/Features'
import Scoreboard from '../../Scoreboard/Scoreboard'
import { Header } from '../components/Header/Header'
import { Query } from '../components/Query/Query'
import { State } from '../components/State/State'

export const Controller = () => {

	const [role, setRole] = useState(ROLE_AUDIENCE)
	const [player, setPlayer] = useState({
		"id": "5b0471c-5193-4707-b17b-9ad7f5628926",
		"name": "Michael",
		"email": "cat@gc.com"
	})
	const [quiz, setQuiz] = useState({
		id: 'sdsadsadsads',
		quizmaster: {
			id: '',
			name: '',
			email: ''
		},
		specs: {
			teams: 4,
			players: 4,
			questions: 4
		},
		tags: [''],
		teams: [
			{
				"id": "08287ec4-7875-4d51-afe1-2eeace78d4d1",
				"name": "Team 0",
				"score": 1
			},
			{
				"id": "87f7caa5-4736-4310-9bd7-07ac3ddd219d",
				"name": "Team 1",
				"score": 1
			},
			{
				"id": "526f4127-8c47-49ec-a269-9da781a1a148",
				"name": "Team 2",
				"score": 1
			},
			{
				"id": "ba1d1f67-83b4-422d-863b-74336b8f7575",
				"name": "Team 3",
				"score": 1
			}],
		team_s_turn: "08287ec4-7875-4d51-afe1-2eeace78d4d1",
		ready: false
	})
	const [teams, setTeams] = useState([])
	const [currentTeamId, setCurrentTeamId] = useState('')
	const [question, setQuestion] = useState({
		id: "",
		statements: [''],
		tag: ""
	})
	const [answer, setAnswer] = useState({
		id: "",
		question_id: "",
		answer: "",
		hint: ""
	})
	const [hint, setHint] = useState('')

	const [snap, setSnap] = useState({
		quiz_id: '',
		team_s_turn: '',
		question_id: ''
	})

	const [formType, setFormType] = useState(Form_Credentials)
	const [rounds, setRounds] = useState(2)
	const [passed, setPassed] = useState(0)
	const [currentQuestionNo, setCurrentQuestionNo] = useState(0)
	const [answerRevealed, setAnswerRevealed] = useState(false)
	const [hintRevealed, setHintRevealed] = useState(false)
	const [currentRound, setCurrentRound] = useState(1)
	const [currentPoints, setCurrentPoints] = useState(10)

	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	const [ready, setReady] = useState(false)
	const [scoreboard, setScoreboard] = useState(false)
	const [finished, setFinished] = useState(false)

	useEffect(() => {
		if (quiz.tags) setCurrentQuestionNo(quiz.tags.length + 1)
		else setCurrentQuestionNo(1)
		setPassed(0)
	}, [quiz.tags])

	useEffect(() => {
		return setSnap({ quiz_id: quiz.id, team_s_turn: currentTeamId, question_id: question.id })
	}, [quiz.id, question.id, currentTeamId])

	const launch = () => {
		setLaunched(true)
	}

	const formEntered = (action: string, entries: Map<string, string>) => {
		switch (formType) {
			case Form_Credentials: createPlayer(action, entries); break;
			case Form_QuizMaster: createQuiz(entries); break;
			case Form_Player: joinPlayer(entries); break;
			case Form_Audience: joinAudience(entries); break;
		}
	}

	const createPlayer = (action: string, entries: Map<string, string>) => {
		const name = entries.get(Entry_Name) || ''
		const email = entries.get(Entry_Handle) || ''
		const obj = { id: '1', name: name, email: email }
		WebSckts.sendAndReceive(Action.BEGIN, JSON.stringify(obj), Action.S_PLAYER, (response: string) => {
			const res = JSON.parse(response)
			if (res.email === email) {
				setPlayer(res)
				onPlayerCreated(action)
			}
		})
	}

	const onPlayerCreated = (action: string) => {
		switch (action) {
			case Action_Create:
				setFormType(Form_QuizMaster)
				setRole(ROLE_QUIZMASTER)
				break
			case Action_Join:
				setFormType(Form_Player)
				setRole(ROLE_PLAYER)
				break
			case Action_Watch:
				setFormType(Form_Audience)
				break
		}
	}

	const createQuiz = (entries: Map<string, string>) => {
		const specs = {
			teams: parseInt(entries.get(Entry_TeamsInAQuiz) || '4'),
			players: parseInt(entries.get(Entry_PlayersInATeam) || '4'),
			questions: parseInt(entries.get(Entry_Questions_Count) || '20')
		}
		const obj = { quizmaster: player, specs: specs }
		WebSckts.sendAndReceive(Action.SPECS, JSON.stringify(obj), Action.S_GAME, (response: string) => {
			const res = JSON.parse(response)
			if (res.quiz.quizmaster.id === player.id) {
				setQuiz(res.quiz)
				setTeams(res.teams)
				setCurrentTeamId(res.teams[0].id)
				setEntered(true)
			}
		})
	}

	const joinPlayer = (entries: Map<string, string>) => {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { person: player, quiz_id: quizId }
		WebSckts.sendAndReceive(Action.JOIN, JSON.stringify(obj), Action.S_GAME, (response: string) => {
			const res = JSON.parse(response)
			if (res.quiz.id === quizId) {
				setQuiz(res.quiz)
				setTeams(res.teams)
				setEntered(true)
			}
		})
	}

	const joinAudience = (entries: Map<string, string>) => {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { person: player, quiz_id: quizId }
		WebSckts.sendAndReceive(Action.WATCH, JSON.stringify(obj), Action.S_GAME, (response: string) => {
			const res = JSON.parse(response)
			if (res.quiz.id === quizId) {
				setQuiz(res.quiz)
				setTeams(res.teams)
				setEntered(true)
			}
		})
	}

	const start = () => {
		const obj = { quiz_id: quiz.id }
		WebSckts.sendAndReceive(Action.START, JSON.stringify(obj), Action.S_START, (response: string) => {
			const res = JSON.parse(response)
			if (res.quiz_id === quiz.id) {
				setQuestion(res.question)
				setTeams(res.teams)
				setReady(true)
			}
		})
	}

	const queryHint = () => {
		WebSckts.sendAndReceive(Action.HINT, JSON.stringify(snap), Action.S_HINT, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				console.log(res)
				setHint(res.hint)
				setHintRevealed(true)
			}
		})
	}

	const queryRight = () => {
		WebSckts.sendAndReceive(Action.RIGHT, JSON.stringify(snap), Action.S_RIGHT, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				console.log(res)
				setAnswer(res.answer)
				setAnswerRevealed(true)
			}
		})
	}

	const queryNext = () => {
		setAnswerRevealed(false)
		setHintRevealed(false)
		WebSckts.sendAndReceive(Action.NEXT, JSON.stringify(snap), Action.S_NEXT, (response) => {
			const res = JSON.parse(response)
			console.log(res)
			console.log(snap)
			if (res.quiz_id === snap.quiz_id && res.last_question_id === snap.question_id) {
				setQuestion(res.question)
				setCurrentTeamId(res.team_s_turn)
			}
		})
	}

	const queryPass = () => {
		if (passed === rounds * teams.length) return
		if (passed % teams.length === 0) setCurrentRound(currentRound + 1)
		WebSckts.sendAndReceive(Action.PASS, JSON.stringify(snap), Action.S_PASS, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				setPassed(passed + 1)
				setCurrentTeamId(res.team_s_turn)
			}
		})
	}

	const queryExtend = () => {
		setRounds(rounds + 1)
	}

	const finish = () => {
		setFinished(true)
	}

	const queryRules = () => {
	}

	const queryGuide = () => {
	}

	const queryLink = () => {
	}

	const renderState = <State teams={teams} currentTeamId={currentTeamId} />

	const renderControlsLeft = <div className='board__controls'>
		<div className='board__controls--right'>
			<Query label={"Rules"} onClick={queryRules} />
			<Query label={"Guide"} onClick={queryGuide} />
		</div>
		<div className='board__controls--right'>
			<Query label={"Link"} onClick={queryLink} />
			<Query label={"Extend"} onClick={queryExtend} />
		</div>
	</div>

	const renderControlsRight = <div className='board__controls'>
		<div className='board__controls--right'>
			<Query label={"Hint"} onClick={queryHint} hidden={role !== ROLE_QUIZMASTER} />
			<Query label={"Pass"} onClick={queryPass} hidden={role !== ROLE_QUIZMASTER} />
		</div>
		<div className='board__controls--right'>
			<Query label={"Right"} onClick={queryRight} />
			<Query label={"Next"} onClick={queryNext} />
		</div>
	</div>

	const Board = <div className='board__wrapper'>
		<Header />
		<p className=''>{player.name}</p>
		<div className='board__columns'>
			<div className='board__column board__column--left'>
				<p className='board__quizid'>{quiz.id}</p>
				<p className='board__info'>{`${currentQuestionNo} - ${currentRound}`}</p>
				<div className='board__questions'>{question.statements.map(line => <p className='board__questions--line'>{line}</p>)}</div>
				{renderControlsLeft}
			</div>
			<div className='board__column board__column--right'>
				{renderState}
				<div className='board__answers'>
					<p className='board__answer'>{answerRevealed && answer}</p>
					<p className='board__hint'>{hintRevealed && hint}</p>
				</div>
				{role === ROLE_QUIZMASTER && renderControlsRight}
			</div>
		</div>
	</div>

	const body = () => {
		// if (scoreboard) return <Scoreboard teams={quiz.teams} close={close} visibility={!ready} />
		if (finished) return <Landing launch={launch} />
		if (ready) return Board
		if (entered) return <Lobby start={start} quiz={quiz} teams={teams} playerId={player.id} />
		if (launched) return <Credentials enter={formEntered} type={formType} />
		return <Landing launch={launch} />
	}

	return (
		<div className='quiz__wrapper'>
			{body()}
		</div>
	)
}
