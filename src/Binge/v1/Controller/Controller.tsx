import { useState } from 'react'
import { Player } from '../utils/_interfaces'
import { Credentials, Form_Credentials, Form_QuizMaster, Form_Player, Form_Audience, Action_Create, Action_Join, Action_Watch, Entry_Handle, Entry_Name, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId } from '../Credentials/Credentials'
import { Landing } from '../Landing/Landing'
import Game from '../Data/game.json'
// import Scoreboard from '../Scoreboard/Scoreboard'
import { Action, WebSckts } from '../utils/_websockets'
import './Controller.scss'

export const Controller = () => {

	const [attempts, setAttempts] = useState(Game.attempts)
	const [players, setPlayers] = useState(Game.players)
	const [questions, setQuestions] = useState(Game.questions)

	const [formType, setFormType] = useState(Form_Credentials)
	const [player, setPlayer] = useState({})
	const [quiz, setQuiz] = useState({})

	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	const [ready, setReady] = useState(false)
	const [finished, setFinished] = useState(false)

	const enter = () => {
		setEntered(true)
	}

	const formEntered = (action: string, entries: Map<string, string>) => {
		switch (formType) {
			case Form_Credentials: createPlayer(action, entries); break;
			case Form_QuizMaster: updateMatchSpecs(entries); break;
			case Form_Player: joinPlayer(entries); break;
			case Form_Audience: joinAudience(entries); break;
		}
	}

	const createPlayer = (action: string, entries: Map<string, string>) => {
		const player = { id: "", name: entries.get(Entry_Name), email: entries.get(Entry_Handle) }
		const request = { action: Action.Begin, content: JSON.stringify(player) }
		WebSckts.register(Action.S_Player, (response) => {
			setPlayer(JSON.parse(response))
			switch (action) {
				case Action_Create: setFormType(Form_QuizMaster); break;
				case Action_Join: setFormType(Form_Player); break;
				case Action_Watch: setFormType(Form_Audience); break;
			}
		})
		WebSckts.send(JSON.stringify(request))
	}

	const updateMatchSpecs = (entries: Map<string, string>) => {
		const specs = { teams: entries.get(Entry_TeamsInAQuiz), players: entries.get(Entry_PlayersInATeam), questions: entries.get(Entry_Questions_Count) }
		const obj = { player: player, specs: specs }
		const request = { action: Action.Specs, content: JSON.stringify(player) }
		WebSckts.register(Action.S_Game, (response) => {
			setQuiz(JSON.parse(response))
		})
		WebSckts.send(JSON.stringify(request))
	}

	const joinPlayer = (entries: Map<string, string>) => {
		const obj = { player: player, quizId: entries.get(Entry_QuizId) }
		const request = { action: Action.Join, content: JSON.stringify(obj) }
		WebSckts.register(Action.S_Game, (response) => {
			setQuiz(JSON.parse(response))
		})
		WebSckts.send(JSON.stringify(request))
	}

	const joinAudience = (entries: Map<string, string>) => {
		const obj = { player: player, quizId: entries.get(Entry_QuizId) }
		const request = { action: Action.Watch, content: JSON.stringify(obj) }
		WebSckts.register(Action.S_Game, (response) => {
			setQuiz(JSON.parse(response))
		})
		WebSckts.send(JSON.stringify(request))
	}

	const body = () => {
		// if (finished) return <Landing launch={launch} />
		// if (ready) return <Board gameOver={finish} />
		// if (entered) return <Scoreboard players={players} close={start} visibility={!ready} />
		if (entered) return <Credentials enter={formEntered} type={formType} />
		return <Landing enter={enter} />
	}

	return (
		<div className='quiz__wrapper'>
			{body()}
		</div>
	)
}
