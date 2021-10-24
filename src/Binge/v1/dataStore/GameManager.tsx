import { toJS } from "mobx"
import { ROLE_PLAYER, ROLE_QUIZMASTER } from "../features/Features"
import { Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId, Action_Create, Action_Join, Action_Watch } from "../pages/Credentials/Credentials"
import { Action } from "../utils/Action"
import { Player, Snap } from "../utils/_interfaces"
import { Urls } from "../utils/_urls"
import { WebSckts } from "../utils/_websockets"
import { state } from './../state/State'

export const formEntered = (snap: any, action: string, entries: Map<string, string>) => {
	switch (action) {
		case Action_Create: createQuiz(snap, entries); break;
		case Action_Join: joinPlayer(snap, entries); break;
		case Action_Watch: joinAudience(snap, entries); break;
	}
}

export const onPlayerCreated = (snap: any, action: string) => {
	switch (action) {
		case Action_Create:
			state.role = ROLE_QUIZMASTER
			Urls.toCreate()
			break
		case Action_Join:
			state.role = ROLE_PLAYER
			Urls.toJoin()
			break
		case Action_Watch:
			Urls.toWatch()
			break
	}
}

export const onResponsePlayer = (snap: any, player: Player) => {
	console.log(player)
	state.player = player
	Urls.toReception()
}

export const onResponseCreateGame = (snap: any, response: string) => {
	const res = JSON.parse(response)
	if (res.quiz.quizmaster.id === snap.player.id) {
		state.snapshot = res.snapshot
		Urls.toLobby()
	}
}

export const onResponseJoinGame = (snap: any, response: string, quizId: string) => {
	const res = JSON.parse(response)
	console.log(res)
	if (canAcceptQuizSnapshot(snap, res)) {
		state.quiz = res.quiz
		if (res.quiz.quizmaster.id === snap.player.id) {
			state.role = ROLE_QUIZMASTER
		}
		if (res.quiz.active) {
			state.snapshot = res.snapshot
			Urls.toQuiz()
		} else {
			Urls.toLobby()
		}
	}
}

export const onResponseScore = (snap: any, response: string) => {
}

export const onResponseActive = (snap: any, response: string) => {

}

export const onResponseRefresh = (snap: any) => {
	const obj = { action: Action.toString(Action.REFRESH), person: snap.player, quiz_id: snap.quiz.id }
	WebSckts.send(Action.REFRESH, JSON.stringify(obj))
}

export const handlerPlayer = (snap: any, email: string) => {
	WebSckts.register(Action.S_PLAYER, (response: string) => {
		const res = JSON.parse(response)
		console.log(res)
		if (res.email === email) {
			onResponsePlayer(snap, res)
		}
	})
}

export const onLoginSuccess = (snap: any, player: Player) => {
	handlerPlayer(snap, player.email)
	const obj = { action: Action.toString(Action.BEGIN), person: player }
	WebSckts.send(Action.BEGIN, JSON.stringify(obj))
}

export const handlers = (snap: any) => {
	handlerActiveQuiz(snap)
	handlersQuestions(snap)
}

export const handlerActiveQuiz = (snap: any) => {
	WebSckts.register(Action.S_ACTIVE, (response: string) => onResponseActive(snap, response))
	WebSckts.register(Action.S_REFRESH, () => onResponseRefresh(snap))
}

export const handlerQuizmaster = (snap: any) => {
	WebSckts.register(Action.S_GAME, (response: string) => onResponseCreateGame(snap, response))
}

export const handlerJoinPlayer = (snap: any, quizId: string) => {
	WebSckts.register(Action.S_GAME, (res) => onResponseJoinGame(snap, res, quizId))
}

export const handlerAudience = (snap: any, quizId: string) => {
	WebSckts.register(Action.S_GAME, (res) => onResponseJoinGame(snap, res, quizId))
}

export const handlersQuestions = (snap: any) => {
	WebSckts.register(Action.S_START, (response: string) => onResponseStart(snap, response))
	WebSckts.register(Action.S_HINT, (response: string) => onResponseHint(snap, response))
	WebSckts.register(Action.S_PASS, (response: string) => onResponsePass(snap, response))
	WebSckts.register(Action.S_RIGHT, (response: string) => onResponseRight(snap, response))
	WebSckts.register(Action.S_NEXT, (response: string) => onResponseNext(snap, response))
	WebSckts.register(Action.S_SCORE, (response: string) => onResponseScore(snap, response))
}

export const createQuiz = (snap: any, entries: Map<string, string>) => {
	const specs = {
		teams: parseInt(entries.get(Entry_TeamsInAQuiz) || '4'),
		players: parseInt(entries.get(Entry_PlayersInATeam) || '4'),
		questions: parseInt(entries.get(Entry_Questions_Count) || '20')
	}
	const obj = { action: Action.toString(Action.SPECS), person: toJS(snap.player), specs: specs }
	console.log(obj)
	handlerQuizmaster(snap)
	WebSckts.send(Action.SPECS, JSON.stringify(obj))
}

export const joinPlayer = (snap: any, entries: Map<string, string>) => {
	const quizId = entries.get(Entry_QuizId) || ''
	const obj = { action: Action.toString(Action.JOIN), person: snap.player, quiz_id: quizId }
	handlerJoinPlayer(snap, quizId)
	WebSckts.send(Action.JOIN, JSON.stringify(obj))
}

export const joinAudience = (snap: any, entries: Map<string, string>) => {
	const quizId = entries.get(Entry_QuizId) || ''
	const obj = { action: Action.toString(Action.WATCH), person: snap.player, quiz_id: quizId }
	handlerAudience(snap, quizId)
	WebSckts.send(Action.WATCH, JSON.stringify(obj))
}

export const start = (snap: any) => {
	const obj = { action: Action.toString(Action.START), snapshot: snap.snapshotRequest }
	WebSckts.send(Action.START, JSON.stringify(obj))
}

export const queryActive = (snap: any) => {
	WebSckts.send(Action.ACTIVE, JSON.stringify({ action: Action.toString(Action.ACTIVE) }))
}

export const queryExtend = (snap: any) => {
}

export const queryRules = (snap: any) => {
	queryActive(snap)
}

export const queryGuide = (snap: any) => {
}

export const queryLink = (snap: any) => {
}

export const queryScore = (snap: any) => {
	WebSckts.send(Action.SCORE, JSON.stringify({ action: Action.toString(Action.SCORE), quiz_id: snap.quiz.id }))
}

export const onResponseStart = (snap: any, response: string) => {
	const res = JSON.parse(response)
	if (canAcceptQuizSnapshot(snap, res)) {
		state.snapshot = res
		Urls.toQuiz()
	}
}

export const onResponseHint = (snap: any, response: string) => {
	const res = JSON.parse(response)
	if (canAcceptQuestionSnapshot(snap, res)) {
		state.snapshot = res
		state.hintRevealed = true
	}
}

export const onResponsePass = (snap: any, response: string) => {
	const res = JSON.parse(response)
	if (canAcceptQuestionSnapshot(snap, res)) {
		state.snapshot = res
	}
}

export const onResponseRight = (snap: any, response: string) => {
	const res = JSON.parse(response)
	if (canAcceptQuestionSnapshot(snap, res)) {
		state.snapshot = res
		state.answerRevealed = true
	}
}

export const onResponseNext = (snap: any, response: string) => {
	const res = JSON.parse(response)
	if (canAcceptQuizSnapshot(snap, res)) {
		state.snapshot = res
		state.answerRevealed = false
		state.hintRevealed = false
	}
}

export const canAcceptQuizSnapshot = (snap: any, response: Snap): boolean => {
	return response.quiz_id === snap.quizId
}

export const canAcceptQuestionSnapshot = (snap: any, response: Snap): boolean => {
	return response.quiz_id === snap.quizId && response.question_id === snap.questionId
}