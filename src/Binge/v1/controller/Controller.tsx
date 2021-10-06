import { useEffect, useState } from 'react'
import GoogleLogin from 'react-google-login';
import { Credentials, Form_Credentials, Form_QuizMaster, Form_Player, Form_Audience, Action_Create, Action_Join, Action_Watch, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId } from '../pages/Credentials/Credentials'
import { WebSckts } from '../utils/_websockets'
import { Action } from "../utils/Action"
import './Controller.scss'
import './../pages/Board/Board.scss'
import './../pages/Landing/Landing.scss'
import { Lobby } from '../pages/Lobby/Lobby'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../Features/Features'
import Scoreboard from '../components/Scoreboard/Scoreboard'
import { Header } from '../components/Header/Header'
import { Query } from '../components/Query/Query'
import { State } from '../components/State/State'
import { Box } from '../components/Box/Box';

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
		active: false
	})
	const [teams, setTeams] = useState([])
	const [playersTeamId, setPlayersTeamId] = useState('')
	const [question, setQuestion] = useState([''])
	const [answer, setAnswer] = useState([""])
	const [hint, setHint] = useState([''])
	const [snap, setSnap] = useState({
		quiz_id: '',
		round_no: 1,
		question_no: 1,
		question_id: '',
		team_s_turn: '',
		event_type: '',
		score: 0,
		timestamp: '',
		content: [''],
	})
	const [score, setScore] = useState({
		quiz_id: '',
		snapshots: [snap]
	})

	const [formType, setFormType] = useState(Form_Credentials)
	const [rounds, setRounds] = useState(2)
	const [answerRevealed, setAnswerRevealed] = useState(false)
	const [hintRevealed, setHintRevealed] = useState(false)

	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	const [ready, setReady] = useState(false)
	const [finished] = useState(false)

	useEffect(() => {
		handlerActiveQuiz()
		handlersQuestions()
	})

	const formEntered = (action: string, entries: Map<string, string>) => {
		switch (formType) {
			case Form_Credentials: onPlayerCreated(action); break;
			case Form_QuizMaster: createQuiz(entries); break;
			case Form_Player: joinPlayer(entries); break;
			case Form_Audience: joinAudience(entries); break;
		}
	}

	const responseGoogle = (response: any) => {
		console.log(response)
		const profile = response.profileObj
		const obj = { id: profile.googleId, name: profile.name, email: profile.email }
		handlerPlayer(profile.email)
		WebSckts.send(Action.BEGIN, JSON.stringify(obj))
	}

	const glogin = () => {
		return <GoogleLogin
			clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
			buttonText="Let's Begin!"
			fetchBasicProfile
			onSuccess={responseGoogle}
			onFailure={responseGoogle}
			cookiePolicy={'single_host_origin'}
		/>
	}
	
	const handlerActiveQuiz = () => {
		WebSckts.register(Action.S_ACTIVE, (response: string) => {
			console.log(response)
		})
	}

	const handlerPlayer = (email: string) => {
		WebSckts.register(Action.S_PLAYER, (response: string) => {
			const res = JSON.parse(response)
			if (res.email === email) {
				setPlayer(res)
				setLaunched(true)
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
				if (res.quiz.quizmaster.id === player.id) {
					setRole(ROLE_QUIZMASTER)
				} else {
					setPlayersTeamId(res.player_team_id)
				}
				setSnap(res.snapshot)
				setQuestion(res.snapshot.content)
				if (res.quiz.active) {
					setReady(true)
				} else {
					setEntered(true)
				}
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
				setSnap(res.snapshot)
				setQuestion(res.snapshot.content)
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
				setTeams(res.teams)
				setSnap(res.snapshot)
				setQuestion(res.snapshot.content)
				setReady(true)
			}
		})
		WebSckts.register(Action.S_HINT, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				console.log(res)
				setSnap(res)
				setHint(res.content)
				setHintRevealed(true)
			}
		})
		WebSckts.register(Action.S_PASS, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				setSnap(res)
			}
		})
		WebSckts.register(Action.S_RIGHT, (response) => {
			const res = JSON.parse(response)
			if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
				console.log(res)
				setSnap(res)
				setAnswer(res.content)
				setAnswerRevealed(true)
			}
		})
		WebSckts.register(Action.S_NEXT, (response) => {
			const res = JSON.parse(response)
			console.log(res)
			console.log(snap)
			if (res.quiz_id === snap.quiz_id && res.last_question_id === snap.question_id) {
				setSnap(res)
				setQuestion(res.content)
				setAnswerRevealed(false)
				setHintRevealed(false)
			}
		})
		WebSckts.register(Action.S_SCORE, (response) => {
			console.log(response)
			const res = JSON.parse(response)
			console.log(res)
			setScore(res)
		})
	}

	const start = () => {
		const obj = { quiz_id: quiz.id }
		WebSckts.send(Action.START, JSON.stringify(obj))
	}

	const queryActive = () => {
		WebSckts.send(Action.ACTIVE, "")
	}

	const queryHint = () => {
		WebSckts.send(Action.HINT, JSON.stringify(snap))
	}

	const queryRight = () => {
		console.log(snap)
		WebSckts.send(Action.RIGHT, JSON.stringify(snap))
	}

	const queryNext = () => {
		WebSckts.send(Action.NEXT, JSON.stringify(snap))
	}

	const queryPass = () => {
		console.log(snap)
		WebSckts.send(Action.PASS, JSON.stringify(snap))
	}

	const queryExtend = () => {
		setRounds(rounds + 1)
	}

	const queryRules = () => {
		queryActive()
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

	const visHint = () => {
		return role === ROLE_QUIZMASTER
	}

	const visPass = () => {
		console.log(role)
		console.log(snap)
		console.log(playersTeamId)
		return role === ROLE_PLAYER && snap.team_s_turn === playersTeamId
	}

	const visRight = () => {
		return role === ROLE_QUIZMASTER
	}

	const visNext = () => {
		return role === ROLE_QUIZMASTER
	}

	const removePunctuations = (str: string) => {
		return str.replace('["-.,:;!@#$%^&*()_+="]', "").toUpperCase()
	}

	const renderState = <State teams={teams} currentTeamId={snap.team_s_turn} />

	const renderControlsLeft = <div className='board__controls'>
		<div className='board__controls--right'>
			<Query label={"Rules"} onClick={queryRules} visible={true} />
			<Query label={"Guide"} onClick={queryGuide} visible={true} />
		</div>
		<div className='board__controls--right'>
			<Query label={"Link"} onClick={queryLink} visible={true} />
			<Query label={"Extend"} onClick={queryExtend} visible={true} />
		</div>
	</div>

	const renderControlsRight = <div className='board__controls'>
		<div className='board__controls--right'>
			<Query label={"Hint"} onClick={queryHint} visible={visHint()} />
			<Query label={"Pass"} onClick={queryPass} visible={visPass()} />
		</div>
		<div className='board__controls--right'>
			<Query label={"Right"} onClick={queryRight} visible={visRight()} />
			<Query label={"Next"} onClick={queryNext} visible={visNext()} />
		</div>
	</div>

	const Board = <div className='board__wrapper'>
		<Header />
		<p className='board__name'>{player.name}</p>
		<div className='board__columns'>
			<div className='board__column board__column--left'>
				<p className='board__quizid' onClick={quizIdCopied}>Quiz id: {removePunctuations(quiz.id)}</p>
				<p className='board__info'>{`${snap.question_no} - ${snap.round_no}`}</p>
				<div className='board__questions'>{question.map(line => <p className='board__questions--line'>{line}</p>)}</div>
				{renderControlsLeft}
			</div>
			<div className='board__column board__column--right'>
				<Query label={"Score"} onClick={queryScore} />
				{renderState}
				<Scoreboard teams={teams} score={score} />
				<div className='board__answers'>
					<p className='board__answer'>{answerRevealed && answer}</p>
					<p className='board__hint'>{hintRevealed && hint}</p>
				</div>
				{renderControlsRight}
			</div>
		</div>
	</div>

	const Landing = () => {
		return (
			<div className='landing__wrapper'>
				<p className='landing__logo'>Binquiz</p>
				{glogin()}
				<Box height='16em' />
			</div>
		)
	}

	const body = () => {
		if (finished) return <Landing />
		if (ready) return Board
		if (entered) return <Lobby
			start={start}
			quiz={quiz}
			role={role}
			teams={teams}
			playerId={player.id} />
		if (launched) return <Credentials enter={formEntered} type={formType} />
		return <Landing />
	}

	return (
		<div className='quiz__wrapper'>
			{body()}
		</div>
	)
}