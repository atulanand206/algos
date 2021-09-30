import { useState } from 'react'
import { Player } from '../utils/_interfaces'
import { Credentials, Form_Credentials, Form_QuizMaster, Form_Player, Form_Audience, Action_Create, Action_Join, Action_Watch, Entry_Handle, Entry_Name, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId } from '../Credentials/Credentials'
import { Landing } from '../Landing/Landing'
import Game from '../Data/game.json'
import Quiz from '../Data/quiz.json'
// import Scoreboard from '../Scoreboard/Scoreboard'
import { WebSckts } from '../utils/_websockets'
import { Action } from "../utils/Action"
import './Controller.scss'
import { Lobby } from '../Lobby/Lobby'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../Features/Features'

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
	const [quiz, setQuiz] = useState({})
	const [role, setRole] = useState(ROLE_AUDIENCE)

	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	// const [ready, setReady] = useState(false)
	// const [finished, setFinished] = useState(false)

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
		const obj = { id: '1', name: entries.get(Entry_Name) || '', email: entries.get(Entry_Handle) || '' }
		WebSckts.sendAndReceive(Action.BEGIN, JSON.stringify(obj), Action.S_PLAYER, (response: string) => {
			setPlayer(JSON.parse(response))
			onPlayerCreated(action)
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
			setQuiz(JSON.parse(response))
			setEntered(true)
		})
	}

	const joinPlayer = (entries: Map<string, string>) => {
		const obj = { person: player, quiz_id: entries.get(Entry_QuizId) || '' }
		WebSckts.sendAndReceive(Action.JOIN, JSON.stringify(obj), Action.S_GAME, (response: string) => {
			setQuiz(JSON.parse(response))
			setEntered(true)
			console.log(JSON.parse(response))
		})
	}

	const joinAudience = (entries: Map<string, string>) => {
		const obj = { player: player, quiz_id: entries.get(Entry_QuizId) || '' }
		WebSckts.sendAndReceive(Action.WATCH, JSON.stringify(obj), Action.S_GAME, (response: string) => {
			setQuiz(JSON.parse(response))
			setEntered(true)
		})
	}

	const body = () => {
		// if (finished) return <Landing launch={launch} />
		// if (ready) return <Board gameOver={finish} />
		// if (entered) return <Scoreboard players={players} close={start} visibility={!ready} />
		if (entered) return <Lobby quiz={quiz} playerId={player.id} />
		if (launched) return <Credentials enter={formEntered} type={formType} />
		return <Landing launch={launch} />
	}

	return (
		<div className='quiz__wrapper'>
			{body()}
		</div>
	)
}
