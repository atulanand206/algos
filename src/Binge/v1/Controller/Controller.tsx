import { useState } from 'react'
import { Credentials, Form_Credentials, Form_QuizMaster, Form_Player, Form_Audience, Entry_Name, Entry_Handle, Action_Create, Action_Join, Action_Watch, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId } from '../pages/Credentials/Credentials'
import { Landing } from '../pages/Landing/Landing'
import { WebSckts } from '../utils/_websockets'
import { Action } from "../utils/Action"
import './Controller.scss'
import { Lobby } from '../pages/Lobby/Lobby'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../Features/Features'
import { Board } from '../pages/Board/Board'
import Scoreboard from '../../Scoreboard/Scoreboard'
import { Team, Player, Game } from '../utils/_interfaces'

export const Controller = () => {

	// const [attempts, setAttempts] = useState(Game.attempts)
	// const [players, setPlayers] = useState(Game.players)
	// const [questions, setQuestions] = useState(Game.questions)

	const [formType, setFormType] = useState(Form_Credentials)
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
			}]
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
	const [role, setRole] = useState(ROLE_AUDIENCE)
	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	const [ready, setReady] = useState(false)
	const [scoreboard, setScoreboard] = useState(false)
	const [finished, setFinished] = useState(false)

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
			console.log(res)
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
		console.log(formType)
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
			console.log(res)
			if (res.quiz_id === quiz.id) {
				setQuestion(res.question)
				setTeams(res.teams)
				setReady(true)
			}
		})
	}

	const finish = () => {
		setFinished(true)
	}

	const body = () => {
		// if (scoreboard) return <Scoreboard teams={quiz.teams} close={close} visibility={!ready} />
		// if (finished) return <Landing launch={launch} />
		if (ready) return <Board
			gameOver={finish}
			quiz={quiz}
			teams={teams}
			currentTeamId={currentTeamId}
			player={player}
			role={role}
			question={question}
			setQuiz={setQuiz}
			setQuestion={setQuestion}
		/>
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
