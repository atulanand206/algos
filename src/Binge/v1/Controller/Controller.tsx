import { useState } from 'react'
import * as Credentials from '../pages/Credentials/Credentials'
import { Landing } from '../pages/Landing/Landing'
import { WebSckts } from '../utils/_websockets'
import { Action } from "../utils/Action"
import './Controller.scss'
import { Lobby } from '../pages/Lobby/Lobby'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../Features/Features'
import { Board } from '../pages/Board/Board'
import Scoreboard from '../../Scoreboard/Scoreboard'

export const Controller = () => {

	// const [attempts, setAttempts] = useState(Game.attempts)
	// const [players, setPlayers] = useState(Game.players)
	// const [questions, setQuestions] = useState(Game.questions)

	const [formType, setFormType] = useState(Credentials.Form_Credentials)
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
		tags: [],
		teams: [
			{
				"id": "08287ec4-7875-4d51-afe1-2eeace78d4d1",
				"name": "Team 0",
				"score": 1,
				"players": [
					{
						"id": "ef60f971-f5ff-4772-9e83-ea6e65af2061",
						"name": "James",
						"email": "cat@ge.com"
					},
					{
						"id": "5b0471c-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					}
				]
			},
			{
				"id": "87f7caa5-4736-4310-9bd7-07ac3ddd219d",
				"name": "Team 1",
				"score": 1,
				"players": [
					{
						"id": "ef60f971-f5ff-4772-9e83-ea6e65af2061",
						"name": "Bond",
						"email": "cat@ge.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Williams",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					}
				]
			},
			{
				"id": "526f4127-8c47-49ec-a269-9da781a1a148",
				"name": "Team 2",
				"score": 1,
				"players": [
					{
						"id": "ef60f971-f5ff-4772-9e83-ea6e65af2061",
						"name": "James",
						"email": "cat@ge.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "James",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					}
				]
			},
			{
				"id": "ba1d1f67-83b4-422d-863b-74336b8f7575",
				"name": "Team 3",
				"score": 1,
				"players": [
					{
						"id": "ef60f971-f5ff-4772-9e83-ea6e65af2061",
						"name": "James",
						"email": "cat@ge.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "James",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					},
					{
						"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
						"name": "Michael",
						"email": "cat@gc.com"
					}
				]
			}]
	})
	const [role, setRole] = useState(ROLE_AUDIENCE)

	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	const [scoreboard, setScoreboard] = useState(false)
	const [finished, setFinished] = useState(false)

	const launch = () => {
		setLaunched(true)
	}

	const formEntered = (action: string, entries: Map<string, string>) => {
		switch (formType) {
			case Credentials.Form_Credentials: createPlayer(action, entries); break;
			case Credentials.Form_QuizMaster: createQuiz(entries); break;
			case Credentials.Form_Player: joinPlayer(entries); break;
			case Credentials.Form_Audience: joinAudience(entries); break;
		}
	}

	const createPlayer = (action: string, entries: Map<string, string>) => {
		const obj = { id: '1', name: entries.get(Credentials.Entry_Name) || '', email: entries.get(Credentials.Entry_Handle) || '' }
		WebSckts.sendAndReceive(Action.BEGIN, JSON.stringify(obj), Action.S_PLAYER, (response: string) => {
			setPlayer(JSON.parse(response))
			onPlayerCreated(action)
		})
	}

	const onPlayerCreated = (action: string) => {
		switch (action) {
			case Credentials.Action_Create:
				setFormType(Credentials.Form_QuizMaster)
				setRole(ROLE_QUIZMASTER)
				break
			case Credentials.Action_Join:
				setFormType(Credentials.Form_Player)
				setRole(ROLE_PLAYER)
				break
			case Credentials.Action_Watch:
				setFormType(Credentials.Form_Audience)
				break
		}
	}

	const createQuiz = (entries: Map<string, string>) => {
		const specs = {
			teams: parseInt(entries.get(Credentials.Entry_TeamsInAQuiz) || '4'),
			players: parseInt(entries.get(Credentials.Entry_PlayersInATeam) || '4'),
			questions: parseInt(entries.get(Credentials.Entry_Questions_Count) || '20')
		}
		const obj = { quizmaster: player, specs: specs }
		WebSckts.sendAndReceive(Action.SPECS, JSON.stringify(obj), Action.S_GAME, (response: string) => {
			setQuiz(JSON.parse(response))
			setEntered(true)
		})
	}

	const joinPlayer = (entries: Map<string, string>) => {
		const obj = { person: player, quiz_id: entries.get(Credentials.Entry_QuizId) || '' }
		WebSckts.sendAndReceive(Action.JOIN, JSON.stringify(obj), Action.S_GAME, (response: string) => {
			setQuiz(JSON.parse(response))
			setEntered(true)
			console.log(JSON.parse(response))
		})
	}

	const joinAudience = (entries: Map<string, string>) => {
		const obj = { player: player, quiz_id: entries.get(Credentials.Entry_QuizId) || '' }
		WebSckts.sendAndReceive(Action.WATCH, JSON.stringify(obj), Action.S_GAME, (response: string) => {
			setQuiz(JSON.parse(response))
			setEntered(true)
		})
	}

	const ready = () => {
		setEntered(true)
	}

	const finish = () => {
		setFinished(true)
	}

	const close = () => {
		setScoreboard(false)
	}

	const body = () => {
		// if (scoreboard) return <Scoreboard teams={quiz.teams} close={close} visibility={!ready} />
		// if (finished) return <Landing launch={launch} />
		// if (entered)
		return <Board gameOver={finish} quiz={quiz} role={ROLE_QUIZMASTER} />
		// if (entered) return <Lobby start={ready} quiz={quiz} playerId={player.id} />
		// if (launched) return <Credentials enter={formEntered} type={formType} />
		// return <Landing launch={launch} />
	}

	return (
		<div className='quiz__wrapper'>
			{body()}
		</div>
	)
}
