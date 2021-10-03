import { useEffect, useState } from 'react'
import { Credentials, Form_Credentials, Form_QuizMaster, Form_Player, Form_Audience, Entry_Name, Entry_Handle, Action_Create, Action_Join, Action_Watch, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId } from '../pages/Credentials/Credentials'
import { Landing } from '../pages/Landing/Landing'
import { WebSckts } from '../utils/_websockets'
import { Action } from "../utils/Action"
import './Controller.scss'
import './../pages/Board/Board.scss'
import { Lobby } from '../pages/Lobby/Lobby'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../Features/Features'
import Scoreboard from '../components/Scoreboard/Scoreboard'
import { Header } from '../components/Header/Header'
import { Query } from '../components/Query/Query'
import { State } from '../components/State/State'
import { Player, Team } from '../utils/_interfaces'

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
	const [playersTeamId, setPlayersTeamId] = useState('')
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

	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	const [ready, setReady] = useState(false)
	const [finished, setFinished] = useState(false)

	useEffect(() => {
		handlersQuestions()
	})

	useEffect(() => {
		const tms: Team[] = teams.filter((team: Team) => team.players.map((playr: Player) => playr.id === player.id))
		if (tms && tms.length === 1) setPlayersTeamId(tms[0].id)
	}, [player.id, teams])

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
		console.log(action, entries)
		switch (formType) {
			case Form_Credentials: createPlayer(action, entries); break;
			case Form_QuizMaster: createQuiz(entries); break;
			case Form_Player: joinPlayer(entries); break;
			case Form_Audience: joinAudience(entries); break;
		}
	}

	const handlerPlayer = (action: string, email: string) => {
		WebSckts.register(Action.S_PLAYER, (response: string) => {
			const res = JSON.parse(response)
			if (res.email === email) {
				setPlayer(res)
				onPlayerCreated(action)
			}
		})
	}

	const createPlayer = (action: string, entries: Map<string, string>) => {
		const name = entries.get(Entry_Name) || ''
		const email = entries.get(Entry_Handle) || ''
		const obj = { id: '1', name: name, email: email }
		handlerPlayer(action, email)
		WebSckts.send(Action.BEGIN, JSON.stringify(obj))
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

	const handlerQuizmaster = () => {
		WebSckts.register(Action.S_GAME, (response: string) => {
			const res = JSON.parse(response)
			if (res.quiz.quizmaster.id === player.id) {
				setQuiz(res.quiz)
				setTeams(res.teams)
				setEntered(true)
			}
		})
	}

	const createQuiz = (entries: Map<string, string>) => {
		const specs = {
			teams: parseInt(entries.get(Entry_TeamsInAQuiz) || '4'),
			players: parseInt(entries.get(Entry_PlayersInATeam) || '4'),
			questions: parseInt(entries.get(Entry_Questions_Count) || '20')
		}
		const obj = { quizmaster: player, specs: specs }
		handlerQuizmaster()
		WebSckts.send(Action.SPECS, JSON.stringify(obj))
	}

	const handlerJoinPlayer = (quizId: string) => {
		WebSckts.register(Action.S_GAME, (response: string) => {
			const res = JSON.parse(response)
			if (res.quiz.id === quizId) {
				setQuiz(res.quiz)
				setTeams(res.teams)
				setEntered(true)
			}
		})
	}

	const joinPlayer = (entries: Map<string, string>) => {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { person: player, quiz_id: quizId }
		handlerJoinPlayer(quizId)
		WebSckts.send(Action.JOIN, JSON.stringify(obj))
	}

	const handlerAudience = (quizId: string) => {
		WebSckts.register(Action.S_GAME, (response: string) => {
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
		handlerAudience(quizId)
		WebSckts.send(Action.WATCH, JSON.stringify(obj))
	}

	const handlersQuestions = () => {
		WebSckts.register(Action.S_START, (response: string) => {
			const res = JSON.parse(response)
			if (res.quiz_id === quiz.id) {
				setQuestion(res.question)
				setTeams(res.teams)
				setReady(true)
				setCurrentTeamId(res.team_s_turn)
				setCurrentQuestionNo(res.question_no)
				setCurrentRound(res.round_no)
			}
		})
		WebSckts.register(Action.S_HINT, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				console.log(res)
				setHint(res.hint)
				setHintRevealed(true)
				setCurrentTeamId(res.team_s_turn)
				setCurrentQuestionNo(res.question_no)
				setCurrentRound(res.round_no)
			}
		})
		WebSckts.register(Action.S_PASS, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				setPassed(passed + 1)
				setCurrentTeamId(res.team_s_turn)
				setCurrentQuestionNo(res.question_no)
				setCurrentRound(res.round_no)
			}
		})
		WebSckts.register(Action.S_RIGHT, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				console.log(res)
				setAnswer(res.answer)
				setAnswerRevealed(true)
				setCurrentTeamId(res.team_s_turn)
				setCurrentQuestionNo(res.question_no)
				setCurrentRound(res.round_no)
			}
		})
		WebSckts.register(Action.S_NEXT, (response) => {
			const res = JSON.parse(response)
			console.log(res)
			console.log(snap)
			if (res.quiz_id === snap.quiz_id && res.last_question_id === snap.question_id) {
				setAnswerRevealed(false)
				setHintRevealed(false)
				setQuestion(res.question)
				setCurrentTeamId(res.team_s_turn)
				setCurrentQuestionNo(res.question_no)
				setCurrentRound(res.round_no)
			}
		})
		WebSckts.register(Action.S_SCORE, (response) => {
			console.log(response)
			const res = JSON.parse(response)
			console.log(res)
		})
	}

	const start = () => {
		const obj = { quiz_id: quiz.id }
		WebSckts.send(Action.START, JSON.stringify(obj))
	}

	const queryHint = () => {
		WebSckts.send(Action.HINT, JSON.stringify(snap))
	}

	const queryRight = () => {
		WebSckts.send(Action.RIGHT, JSON.stringify(snap))
	}

	const queryNext = () => {
		WebSckts.send(Action.NEXT, JSON.stringify(snap))
	}

	const queryPass = () => {
		WebSckts.send(Action.PASS, JSON.stringify(snap))
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

	const queryScore = () => {
		WebSckts.send(Action.SCORE, JSON.stringify({ quiz_id: quiz.id }))
	}

	const quizIdCopied = () => {
		navigator.clipboard.writeText(quiz.id)
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
			<Query label={"Pass"} onClick={queryPass} hidden={role !== ROLE_PLAYER || currentTeamId !== playersTeamId} />
		</div>
		<div className='board__controls--right'>
			<Query label={"Right"} onClick={queryRight} />
			<Query label={"Next"} onClick={queryNext} />
		</div>
	</div>

	const Board = <div className='board__wrapper'>
		<Header />
		<p className='board__name'>{player.name}</p>
		<div className='board__columns'>
			<div className='board__column board__column--left'>
				<p className='board__quizid' onClick={quizIdCopied}>Quiz id: {quiz.id}</p>
				<p className='board__info'>{`${currentQuestionNo} - ${currentRound}`}</p>
				<div className='board__questions'>{question.statements.map(line => <p className='board__questions--line'>{line}</p>)}</div>
				{renderControlsLeft}
			</div>
			<div className='board__column board__column--right'>
				<Query label={"Score"} onClick={queryScore} />
				{renderState}
				<Scoreboard teams={teams} />
				<div className='board__answers'>
					<p className='board__answer'>{answerRevealed && answer}</p>
					<p className='board__hint'>{hintRevealed && hint}</p>
				</div>
				{role === ROLE_QUIZMASTER && renderControlsRight}
			</div>
		</div>
	</div>

	const body = () => {
		if (finished) return <Landing launch={finish} />
		if (ready) return Board
		if (entered) return <Lobby
			start={start}
			quiz={quiz}
			role={role}
			teams={teams}
			playerId={player.id} />
		if (launched) return <Credentials enter={formEntered} type={formType} />
		return <Landing launch={launch} />
	}

	return (
		<div className='quiz__wrapper'>
			{body()}
		</div>
	)
}
