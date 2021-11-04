import { Action } from "../utils/Action"
import { findActiveQuizzes } from "../utils/_api"
import { Player, Snap, Specs } from "../utils/_interfaces"
import { Urls } from "../utils/_urls"
import { WebSckts } from "../utils/_websockets"
import { state } from './../state/State'

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
	if (res.quiz.started) {
		Urls.toQuiz()
	} else {
		Urls.toLobby()
	}
}

export const onResponseScore = (snap: any, response: string) => {
}

export const onResponseActive = (snapshot: Snap, response: string) => {

}

export const onResponseRefresh = (player: Player, snapshot: Snap) => {
	const obj = { action: Action.toString(Action.REFRESH), person: player, quiz_id: snapshot.quiz_id }
	WebSckts.send(Action.REFRESH, JSON.stringify(obj))
}

export const handlerPlayer = (snap: any, email: string) => {
	WebSckts.register(Action.S_PLAYER, (response: string) => {
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
	})
}

export const onLoginSuccess = (snap: any, player: Player) => {
	handlerPlayer(snap, player.email)
	const obj = { action: Action.toString(Action.BEGIN), person: player }
	WebSckts.send(Action.BEGIN, JSON.stringify(obj))
}

export const handlers = (player: Player, snapshot: Snap) => {
	handlerActiveQuiz(player, snapshot)
	handlersQuestions(player, snapshot)
}

export const handlerActiveQuiz = (player: Player, snapshot: Snap) => {
	WebSckts.register(Action.S_ACTIVE, (response: string) => onResponseActive(snapshot, response))
	WebSckts.register(Action.S_REFRESH, () => onResponseRefresh(player, snapshot))
}

export const handlerQuizmaster = (snap: any) => {
	WebSckts.register(Action.S_JOIN, (response: string) => onResponseCreateGame(snap, response))
}

export const handlerJoinPlayer = (snap: any, quizId: string) => {
	WebSckts.register(Action.S_JOIN, (res) => onResponseJoinGame(snap, res, quizId))
}

export const handlerAudience = (snap: any, quizId: string) => {
	WebSckts.register(Action.S_JOIN, (res) => onResponseJoinGame(snap, res, quizId))
}

export const handlersQuestions = (player: Player, snapshot: Snap) => {
	WebSckts.register(Action.S_GAME, (response: string) => onResponse(snapshot, response))
	WebSckts.register(Action.S_SCORE, (response: string) => onResponseScore(snapshot, response))
}

export const createQuiz = (snap: any, specs: Specs) => {
	const obj = { action: Action.toString(Action.SPECS), person: snap.player, specs: specs }
	console.log(obj)
	handlerQuizmaster(snap)
	WebSckts.send(Action.SPECS, JSON.stringify(obj))
}

export const joinPlayer = (snap: any, quizId: string) => {
	const obj = { action: Action.toString(Action.JOIN), person: snap.player, quiz_id: quizId }
	handlerJoinPlayer(snap, quizId)
	WebSckts.send(Action.JOIN, JSON.stringify(obj))
}

export const joinAudience = (snap: any, quizId: string) => {
	const obj = { action: Action.toString(Action.WATCH), person: snap.player, quiz_id: quizId }
	handlerAudience(snap, quizId)
	WebSckts.send(Action.WATCH, JSON.stringify(obj))
}

export const start = (snap: any) => {
	const obj = { action: Action.toString(Action.START), quiz_id: snap.quiz.id }
	WebSckts.send(Action.START, JSON.stringify(obj))
}

export const queryActive = (snap: any) => {
	WebSckts.send(Action.ACTIVE, JSON.stringify({ action: Action.toString(Action.ACTIVE) }))
}

export const snapshotRequest = (action: Action, quizId: string, questionId: string) => {
  return { action: Action.toString(action), quiz_id: quizId, question_id: questionId }
}

export const queryPass = (snap: any) => {
	WebSckts.send(Action.PASS, JSON.stringify(snapshotRequest(Action.PASS, snap.quiz.id, snap.snapshot.question_id)))
}

export const queryRight = (snap: any) => {
	WebSckts.send(Action.RIGHT, JSON.stringify(snapshotRequest(Action.RIGHT, snap.quiz.id, snap.snapshot.question_id)))
}

export const queryNext = (snap: any) => {
	WebSckts.send(Action.NEXT, JSON.stringify(snapshotRequest(Action.NEXT, snap.quiz.id, snap.snapshot.question_id)))
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

export const onResponse = (snapshot: Snap, response: string) => {
	const res = JSON.parse(response)
	console.log(res, canAcceptQuizSnapshot(snapshot, res.snapshot))
	state.snapshot = res.snapshot
	console.log(res)
	switch (res.action) {
		case Action.toString(Action.START): Urls.toQuiz(); break;
		case Action.toString(Action.HINT): state.hintRevealed = true; break;
		case Action.toString(Action.RIGHT): state.answerRevealed = true; break;
		case Action.toString(Action.NEXT): state.answerRevealed = false; state.hintRevealed = false; break;
	}
}

export const canAcceptQuizSnapshot = (snap: any, response: Snap): boolean => {
	return response.quiz_id === snap.quiz_id
}
