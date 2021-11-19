import { Action } from "../utils/Action"
import { findActiveQuizzes } from "../utils/_api"
import { Player, Snap, Specs } from "../utils/_interfaces"
import { Urls } from "../utils/_urls"
import { WebSckts } from "../utils/_websockets"
import { state } from './../state/State'

export const send = (requestAction: Action, requestObj: string) => {
	WebSckts.send(requestAction, requestObj)
}

export const register = (action: Action, handler: (msg: string) => void) => {
	WebSckts.register(action, handler)
}

export const beginRequest = (player: Player): string => {
	return JSON.stringify({ action: Action.toString(Action.BEGIN), person: player })
}

export const createQuizRequest = (snap: any, specs: Specs) => {
	return JSON.stringify({ action: Action.toString(Action.SPECS), person: snap.player, specs: specs })
}

export const joinRequest = (action: Action, snap: any, quizId: string) => {
	return JSON.stringify({ action: Action.toString(action), person: snap.player, quiz_id: quizId })
}

export const startRequest = (snap: any): string => {
	return JSON.stringify({ action: Action.toString(Action.START), person: snap.player, quiz_id: snap.quiz.id })
}

export const activeRequest = JSON.stringify({ action: Action.toString(Action.ACTIVE) })

export const snapshotRequest = (action: Action, quizId: string, questionId: string) => {
	return JSON.stringify({ action: Action.toString(action), quiz_id: quizId, question_id: questionId })
}

export const refreshRequest = (player: Player, snapshot: Snap): string => {
	return JSON.stringify({ action: Action.toString(Action.REFRESH), person: player, quiz_id: snapshot.quiz_id })
}

export const canAcceptQuizSnapshot = (snap: any, response: Snap): boolean => {
	return response.quiz_id === snap.quiz_id
}

export const onResponseLogin = (snap: any, response: string, email: string) => {
	const res = JSON.parse(response)
	console.log(res)
	if (res.tokens !== null) {
		sessionStorage.setItem('access_token', res.tokens.access_token)
		sessionStorage.setItem('refresh_token', res.tokens.refresh_token)
	}
	state.can_create_quiz = res.quizmaster
	if (res.player.email === email) {
		onResponsePlayer(snap, res.player)
	}
}

export const onResponsePlayer = async (snap: any, player: Player) => {
	console.log(player)
	state.player = player
	Urls.toReception()
	await findActiveQuizzes(player.id)
}

export const onResponseCreateGame = (snap: any, response: string) => {
	const res = JSON.parse(response)
	if (res.quiz.quizmaster.id === snap.player.id) {
		state.quiz = res.quiz
		state.snapshot = res.snapshot
		state.role = res.role
		handlers(snap.player, res.snapshot)
		Urls.toLobby()
		console.log(state)
	}
}

export const onResponseJoinGame = (snap: any, response: string, quizId: string) => {
	const res = JSON.parse(response)
	console.log(res)
	state.quiz = res.quiz
	state.role = res.role
	state.snapshot = res.snapshot
	handlers(snap.player, res.snapshot)
	refresh(snap.player, res.snapshot)
	if (res.quiz.started) {
		Urls.toQuiz()
	} else {
		Urls.toLobby()
	}
}

export const onResponseQuestion = (snapshot: Snap, response: string) => {
	const res = JSON.parse(response)
	console.log(res, canAcceptQuizSnapshot(snapshot, res.snapshot))
	state.snapshot = res.snapshot
	console.log(res)
	switch (res.action) {
		case Action.toString(Action.START): Urls.toQuiz(); break;
		case Action.toString(Action.HINT): state.hintRevealed = true; break;
		case Action.toString(Action.RIGHT): state.answerRevealed = true; break;
		case Action.toString(Action.NEXT): state.answerRevealed = false; state.hintRevealed = false; break;
		case Action.toString(Action.FINISH): state.answerRevealed = false; state.hintRevealed = false; Urls.toPodium(); break;
	}
}

export const refresh = (player: Player, snapshot: Snap) => {
	send(Action.REFRESH, refreshRequest(player, snapshot))
}

export const onResponseScore = (snap: any, response: string) => {
}

export const onResponseActive = (snapshot: Snap, response: string) => {

}

export const onLoginSuccess = (snap: any, player: Player) => {
	handlerPlayer(snap, player.email)
	send(Action.BEGIN, beginRequest(player))
}

export const handlerPlayer = (snap: any, email: string) => {
	register(Action.S_PLAYER, (response: string) => onResponseLogin(snap, response, email))
}

export const handlers = (player: Player, snapshot: Snap) => {
	handlerActiveQuiz(player, snapshot)
	handlersQuestions(player, snapshot)
}

export const handlerActiveQuiz = (player: Player, snapshot: Snap) => {
	register(Action.S_ACTIVE, (response: string) => onResponseActive(snapshot, response))
	register(Action.S_REFRESH, () => refresh(player, snapshot))
}

export const handlerQuizmaster = (snap: any) => {
	register(Action.S_JOIN, (response: string) => onResponseCreateGame(snap, response))
}

export const handlerJoinPlayer = (snap: any, quizId: string) => {
	register(Action.S_JOIN, (res) => onResponseJoinGame(snap, res, quizId))
}

export const handlerAudience = (snap: any, quizId: string) => {
	register(Action.S_JOIN, (res) => onResponseJoinGame(snap, res, quizId))
}

export const handlersQuestions = (player: Player, snapshot: Snap) => {
	register(Action.S_GAME, (response: string) => onResponseQuestion(snapshot, response))
	register(Action.S_SCORE, (response: string) => onResponseScore(snapshot, response))
}

export const createQuiz = (snap: any, specs: Specs) => {
	handlerQuizmaster(snap)
	send(Action.SPECS, createQuizRequest(snap, specs))
}

export const joinPlayer = (snap: any, quizId: string) => {
	handlerJoinPlayer(snap, quizId)
	send(Action.JOIN, joinRequest(Action.JOIN, snap, quizId))
}

export const joinAudience = (snap: any, quizId: string) => {
	handlerAudience(snap, quizId)
	send(Action.WATCH, joinRequest(Action.WATCH, snap, quizId))
}

export const start = (snap: any) => {
	send(Action.START, startRequest(snap))
}

export const queryActive = (snap: any) => {
	send(Action.ACTIVE, activeRequest)
}

export const queryPass = (snap: any) => {
	send(Action.PASS, snapshotRequest(Action.PASS, snap.quiz.id, snap.snapshot.question_id))
}

export const queryRight = (snap: any) => {
	send(Action.RIGHT, snapshotRequest(Action.RIGHT, snap.quiz.id, snap.snapshot.question_id))
}

export const queryFinish = (snap: any) => {
	send(Action.FINISH, snapshotRequest(Action.FINISH, snap.quiz.id, snap.snapshot.question_id))
}

export const queryNext = (snap: any) => {
	send(Action.NEXT, snapshotRequest(Action.NEXT, snap.quiz.id, snap.snapshot.question_id))
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
	send(Action.SCORE, JSON.stringify({ action: Action.toString(Action.SCORE), quiz_id: snap.quiz.id }))
}
