import { useState } from 'react'
import { Player } from '../../utils/_interfaces'
import { Enter } from '../Chooser/Chooser'
import { Board } from '../Landing/Board'
import { Landing } from '../Landing/Landing'
import { Scene } from '../Scene/Scene'
import Game from '../Data/game.json'
import Scoreboard from '../Scoreboard/Scoreboard'

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
	}

	const start = () => {
		setReady(true)
	}

	const enter = (player: Player) => {
		setEntered(true)
	}

	const finish = () => {
		setFinished(true)
	}

	if (finished) return <Landing launch={launch} />
	if (ready) return <Board gameOver={finish} />
	if (entered) return <Scoreboard players={players} close={start} visibility={!ready} />
	if (launched) return <Enter enter={enter} />
	return <Landing launch={launch} />

}
