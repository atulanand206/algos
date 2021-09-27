import { useState } from 'react'
import { Player } from '../../utils/_interfaces'
import { Enter } from '../Chooser/Chooser'
import { Board } from '../Landing/Board'
import { Landing } from '../Landing/Landing'
import Game from '../Data/game.json'
import Scoreboard from '../Scoreboard/Scoreboard'
import { WebSckts } from './../../utils/_websockets'

export const Lobby = () => {

	const [attempts, setAttempts] = useState(Game.attempts)
	const [players, setPlayers] = useState(Game.players)
	const [questions, setQuestions] = useState(Game.questions)

	const [launched, setLaunched] = useState(false)
	const [entered, setEntered] = useState(false)
	const [ready, setReady] = useState(false)
	const [finished, setFinished] = useState(false)

	const launch = () => {
		setLaunched(true)
		if (WebSckts._instance !== undefined)
			WebSckts._instance.send("How's it going")
	}

	const start = () => {
		setReady(true)
		console.log(attempts)
		console.log(questions)
		setAttempts(attempts)
		setPlayers(players)
		setQuestions(questions)
	}

	const enter = (player: Player) => {
		setEntered(true)
		if (WebSckts._instance !== undefined)
			WebSckts._instance.send(JSON.stringify(player))
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
