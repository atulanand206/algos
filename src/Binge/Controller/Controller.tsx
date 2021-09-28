import { useState } from 'react'
import { Player } from '../../utils/_interfaces'
import { Enter } from '../Chooser/Chooser'
import { Board } from '../Landing/Board'
import { Landing } from '../Landing/Landing'
import Game from '../Data/game.json'
import Scoreboard from '../Scoreboard/Scoreboard'
import { Action, WebSckts } from '../../utils/_websockets'

export const Controller = () => {

	const [attempts, setAttempts] = useState(Game.attempts)
	const [players, setPlayers] = useState(Game.players)
	const [questions, setQuestions] = useState(Game.questions)

	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	const [ready, setReady] = useState(false)
	const [finished, setFinished] = useState(false)

	const sendLaunchRequest = () => {
		const obj = JSON.stringify({
			"action": 0,
			"content": JSON.stringify({
				"id": "5b0471ce-5193-4707-b17b-9ad7f5628926",
				"name": "James",
				"email": "cat@gc.com"
			})
		})
		console.log(obj)
		WebSckts.register(Action.S_Game, (msg: string) => {
			console.log("BEGIN", msg)
		})
		WebSckts.send(obj)
	}

	const launch = () => {
		setLaunched(true)
	}

	const start = () => {
		sendLaunchRequest()
	}

	const enter = (player: Player) => {
		setEntered(true)
		WebSckts.send(JSON.stringify(player))
	}

	const finish = () => {
		setFinished(true)
	}

	const body = () => {
		if (finished) return <Landing launch={launch} />
		if (ready) return <Board gameOver={finish} />
		if (entered) return <Scoreboard players={players} close={start} visibility={!ready} />
		if (launched) return <Enter enter={enter} />
		return <Landing launch={launch} />
	}

	return (
		body()
	)
}
