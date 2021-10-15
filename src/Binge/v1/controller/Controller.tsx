import { useEffect, useState } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { Credentials, Form_Credentials, Form_QuizMaster, Form_Player, Form_Audience, Action_Create, Action_Join, Action_Watch, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId } from '../pages/Credentials/Credentials'
import { WebSckts } from '../utils/_websockets'
import { Action } from "../utils/Action"
import './Controller.scss'
import './../pages/Board/Board.scss'
import './../pages/Landing/Landing.scss'
import { Lobby } from '../pages/Lobby/Lobby'
import { ROLE_AUDIENCE, ROLE_PLAYER, ROLE_QUIZMASTER } from '../../Features/Features'
import { Player, Team } from '../utils/_interfaces';
import { Board } from '../pages/Board/Board';
import { Landing } from '../pages/Landing/Landing';
import React from 'react'

type Props = {
	histor: History
}

export const Controller = (props: Props) => {
	const [role, setRole] = useState(ROLE_AUDIENCE)
	const [player, setPlayer] = useState({
		id: "5b0471c-5193-4707-b17b-9ad7f5628926",
		name: "Michael",
		email: "cat@gc.com"
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
		active: false
	})
	const [teams, setTeams] = useState([])
	const [playersTeamId, setPlayersTeamId] = useState('')
	const [snap, setSnap] = useState({
		quiz_id: '',
		round_no: 1,
		question_no: 1,
		question_id: '',
		team_s_turn: '',
		event_type: '',
		score: 0,
		timestamp: '',
		question: [''],
		answer: [''],
		hint: ['']
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

	useEffect(() => {
		if (role === ROLE_PLAYER) {
		var tems = teams.filter((team: Team) => team.players.filter((playr: Player) => playr.id === player.id).length === 1)
		console.log(teams)
		console.log(tems)
			if (tems.length === 1) {
				var tem: Team = tems[0]
				setPlayersTeamId(tem.id)
			}
	}
	}, [teams, player, role])

	const formEntered = (action: string, entries: Map<string, string>) => {
		switch (formType) {
			case Form_Credentials: onPlayerCreated(action); break;
			case Form_QuizMaster: createQuiz(entries); break;
			case Form_Player: joinPlayer(entries); break;
			case Form_Audience: joinAudience(entries); break;
		}
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

	const onResponsePlayer = (player: Player) => {
		setPlayer(player)
		setLaunched(true)
	}

	const onResponseCreateGame = (response: string) => {
		const res = JSON.parse(response)
		if (res.quiz.quizmaster.id === player.id) {
			setQuiz(res.quiz)
			setTeams(res.teams)
			setEntered(true)
		}
	}

	const onResponseJoinGame = (response: string, quizId: string) => {
		const res = JSON.parse(response)
			console.log(res)
			if (res.quiz.id === quizId) {
				setQuiz(res.quiz)
				setTeams(res.teams)
				if (res.quiz.quizmaster.id === player.id) {
					setRole(ROLE_QUIZMASTER)
				}
				if (res.quiz.active) {
					setSnap(res.snapshot)
					setReady(true)
				} else {
					setEntered(true)
				}
			}
	}
	
	const onResponseWatchGame = (response: string, quizId: string) => {
		const res = JSON.parse(response)
		if (res.quiz.id === quizId) {
			setQuiz(res.quiz)
			setTeams(res.teams)
			if (res.quiz.active) {
				setSnap(res.snapshot)
				setReady(true)
			} else {
				setEntered(true)
			}
		}
	}

	const onResponseStart = (response: string) => {
		const res = JSON.parse(response)
		if (res.quiz_id === quiz.id) {
			setTeams(res.teams)
			setSnap(res.snapshot)
			setReady(true)
		}
	}

	const onResponseHint = (response: string) => {
		const res = JSON.parse(response)
		if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
			setSnap(res)
			setHintRevealed(true)
		}
	}

	const onResponsePass = (response: string) => {
		const res = JSON.parse(response)
		if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
			setSnap(res)
		}
	}

	const onResponseRight = (response: string) => {
		const res = JSON.parse(response)
		if (res.quiz_id === snap.quiz_id && res.question_id === snap.question_id) {
			setSnap(res)
			setTeams(res.teams)
			setAnswerRevealed(true)
		}
	}

	const onResponseNext = (response: string) => {
		const res = JSON.parse(response)
		if (res.quiz_id === snap.quiz_id) {
			setSnap(res)
			setAnswerRevealed(false)
			setHintRevealed(false)
		}
	}

	const onResponseScore = (response: string) => {
		const res = JSON.parse(response)
		setScore(res)
	}

	const onResponseActive = (response: string) => {

	}

	const onResponseRefresh = () => {
		const obj = { person: player, quiz_id: quiz.id }
		WebSckts.send(Action.REFRESH,  JSON.stringify(obj))
	}

	const handlerActiveQuiz = () => {
		WebSckts.register(Action.S_ACTIVE, onResponseActive)
		WebSckts.register(Action.S_REFRESH, onResponseRefresh)
	}

	const handlerQuizmaster = () => {
		WebSckts.register(Action.S_GAME, onResponseCreateGame)
	}

	const handlerJoinPlayer = (quizId: string) => {
		WebSckts.register(Action.S_GAME, (res) => onResponseJoinGame(res, quizId))
	}

	const handlerAudience = (quizId: string) => {
		WebSckts.register(Action.S_GAME, (res) => onResponseWatchGame(res, quizId))
	}

	const handlersQuestions = () => {
		WebSckts.register(Action.S_START, onResponseStart)
		WebSckts.register(Action.S_HINT, onResponseHint)
		WebSckts.register(Action.S_PASS, onResponsePass)
		WebSckts.register(Action.S_RIGHT, onResponseRight)
		WebSckts.register(Action.S_NEXT, onResponseNext)
		WebSckts.register(Action.S_SCORE, onResponseScore)
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

	const joinPlayer = (entries: Map<string, string>) => {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { person: player, quiz_id: quizId }
		handlerJoinPlayer(quizId)
		WebSckts.send(Action.JOIN, JSON.stringify(obj))
	}

	const joinAudience = (entries: Map<string, string>) => {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { person: player, quiz_id: quizId }
		handlerAudience(quizId)
		WebSckts.send(Action.WATCH, JSON.stringify(obj))
	}

	const start = () => {
		const obj = { quiz_id: quiz.id }
		WebSckts.send(Action.START, JSON.stringify(obj))
	}

	const queryActive = () => {
		WebSckts.send(Action.ACTIVE, "")
	}

	const queryHint = () => {
		const obj = { quiz_id: quiz.id, team_s_turn: snap.team_s_turn, question_id: snap.question_id }
		WebSckts.send(Action.HINT, JSON.stringify(obj))
	}

	const queryRight = () => {
		const obj = { quiz_id: quiz.id, team_s_turn: snap.team_s_turn, question_id: snap.question_id }
		WebSckts.send(Action.RIGHT, JSON.stringify(obj))
	}

	const queryNext = () => {
		const obj = { quiz_id: quiz.id, team_s_turn: snap.team_s_turn, question_id: snap.question_id }
		WebSckts.send(Action.NEXT, JSON.stringify(obj))
	}

	const queryPass = () => {
		const obj = { quiz_id: quiz.id, team_s_turn: snap.team_s_turn, question_id: snap.question_id }
		WebSckts.send(Action.PASS, JSON.stringify(obj))
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

	type SwitchProps = {

	}

	type SwitchState = {

	}

	class Switcher extends React.Component<SwitchProps, SwitchState> {
		
		handlerPlayer = (email: string) => {
			WebSckts.register(Action.S_PLAYER, (response: string) => {
				const res = JSON.parse(response)
				if (res.email === email) {
					onResponsePlayer(res)
					console.log(res, this.context)
					this.context.router.push('/reception')
				}	
			})
		}
		
		onLoginSuccess = (obj: Player) => {
			this.handlerPlayer(obj.email)
			WebSckts.send(Action.BEGIN, JSON.stringify(obj))
		}

		render = () => (
			<Router>
				<div>
					<Switch >
						<Route path="/reception" render={() => <Credentials 
									enter={formEntered} 
									type={formType} />} />
						<Route path='/quiz' render={() => <Board
									role={role}
									teams={teams}
									playersTeamId={playersTeamId} 
									currentTeamId={snap.team_s_turn}	
									snap={snap} 
									answerRevealed={answerRevealed} 
									hintRevealed={hintRevealed}  
									queryHint={queryHint}
									queryNext={queryNext}
									queryPass={queryPass}
									queryRight={queryRight}
									playerName={player.name} />} />
						<Route path='/lobby' render={() => <Lobby
									start={start}
									quiz={quiz}
									role={role}
									teams={teams}
									playerId={player.id} />} />
						<Route exact path="/" render={() => <Landing 
									onLoginSuccess={this.onLoginSuccess}/>} />
					</Switch>
				</div>
			</Router>
		)
	}

	return (
		<div className='quiz__wrapper'>
			<Switcher />
		</div>
	)
}
