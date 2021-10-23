import { toJS } from "mobx"
import { ROLE_PLAYER, ROLE_QUIZMASTER } from "../../Features/Features"
import { Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId, Action_Create, Action_Join, Action_Watch, Form_Audience, Form_Player, Form_QuizMaster } from "../pages/Credentials/Credentials"
import { Action } from "../utils/Action"
import { Player, Snap } from "../utils/_interfaces"
import { Urls } from "../utils/_urls"
import { WebSckts } from "../utils/_websockets"
import { DataStore } from "./DataStore"

export class GameManager {

	static _instance: GameManager

	dataStore: DataStore = new DataStore()

	constructor() {
		if (GameManager._instance) {
			return GameManager._instance
		}
		GameManager._instance = this
	}

	formEntered(action: string, entries: Map<string, string>) {
		switch (action) {
			case Action_Create: this.createQuiz(entries); break;
			case Action_Join: this.joinPlayer(entries); break;
			case Action_Watch: this.joinAudience(entries); break;
		}
	}

	onPlayerCreated(action: string) {
		switch (action) {
			case Action_Create:
				this.dataStore.setFormType(Form_QuizMaster)
				this.dataStore.setRole(ROLE_QUIZMASTER)
				Urls.toCreate()
				break
			case Action_Join:
				this.dataStore.setFormType(Form_Player)
				this.dataStore.setRole(ROLE_PLAYER)
				Urls.toJoin()
				break
			case Action_Watch:
				this.dataStore.setFormType(Form_Audience)
				Urls.toWatch()
				break
		}
	}

	onResponsePlayer(player: Player) {
		console.log(player)
		this.dataStore.setPlayer(player)
		Urls.toReception()
	}

	onResponseCreateGame(response: string) {
		const res = JSON.parse(response)
		if (res.quiz.quizmaster.id === this.dataStore.player.id) {
			this.dataStore.setSnapshot(res)
			Urls.toLobby()
		}
	}

	onResponseJoinGame(response: string, quizId: string) {
		const res = JSON.parse(response)
		console.log(res)
		if (GameManager._instance.canAcceptQuizSnapshot(res)) {
			if (res.quiz.quizmaster.id === this.dataStore.player.id) {
				this.dataStore.setRole(ROLE_QUIZMASTER)
			}
			if (res.quiz.active) {
				this.dataStore.setSnapshot(res)
				Urls.toQuiz()
			} else {
				Urls.toLobby()
			}
		}
	}

	onResponseScore(response: string) {
	}

	onResponseActive(response: string) {

	}

	onResponseRefresh() {
		const obj = { action: Action.toString(Action.REFRESH), person: DataStore._instance.player, quiz_id: DataStore._instance.quiz.id }
		WebSckts.send(Action.REFRESH, JSON.stringify(obj))
	}

	handlerPlayer(email: string) {
		WebSckts.register(Action.S_PLAYER, (response: string) => {
			const res = JSON.parse(response)
			console.log(res)
			if (res.email === email) {
				this.onResponsePlayer(res)
			}
		})
	}

	onLoginSuccess(player: Player) {
		this.handlerPlayer(player.email)
		const obj = { action: Action.toString(Action.BEGIN), person: player }
		WebSckts.send(Action.BEGIN, JSON.stringify(obj))
	}

	handlers() {
		this.handlerActiveQuiz()
		this.handlersQuestions()
	}

	handlerActiveQuiz() {
		WebSckts.register(Action.S_ACTIVE, this.onResponseActive)
		WebSckts.register(Action.S_REFRESH, this.onResponseRefresh)
	}

	handlerQuizmaster() {
		WebSckts.register(Action.S_GAME, this.onResponseCreateGame)
	}

	handlerJoinPlayer(quizId: string) {
		WebSckts.register(Action.S_GAME, (res) => this.onResponseJoinGame(res, quizId))
	}

	handlerAudience(quizId: string) {
		WebSckts.register(Action.S_GAME, (res) => this.onResponseJoinGame(res, quizId))
	}

	handlersQuestions() {
		WebSckts.register(Action.S_START, this.onResponseStart)
		WebSckts.register(Action.S_HINT, this.onResponseHint)
		WebSckts.register(Action.S_PASS, this.onResponsePass)
		WebSckts.register(Action.S_RIGHT, this.onResponseRight)
		WebSckts.register(Action.S_NEXT, this.onResponseNext)
		WebSckts.register(Action.S_SCORE, this.onResponseScore)
	}

	createQuiz(entries: Map<string, string>) {
		const specs = {
			teams: parseInt(entries.get(Entry_TeamsInAQuiz) || '4'),
			players: parseInt(entries.get(Entry_PlayersInATeam) || '4'),
			questions: parseInt(entries.get(Entry_Questions_Count) || '20')
		}
		const obj = { action: Action.toString(Action.SPECS), person: toJS(this.dataStore.player), specs: specs }
		console.log(obj)
		this.handlerQuizmaster()
		WebSckts.send(Action.SPECS, JSON.stringify(obj))
	}

	joinPlayer(entries: Map<string, string>) {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { action: Action.toString(Action.JOIN), person: this.dataStore.player, quiz_id: quizId }
		this.handlerJoinPlayer(quizId)
		WebSckts.send(Action.JOIN, JSON.stringify(obj))
	}

	joinAudience(entries: Map<string, string>) {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { action: Action.toString(Action.WATCH), person: this.dataStore.player, quiz_id: quizId }
		this.handlerAudience(quizId)
		WebSckts.send(Action.WATCH, JSON.stringify(obj))
	}

	start() {
		const obj = { action: Action.toString(Action.START), snapshot: this.dataStore.snapshotRequest }
		WebSckts.send(Action.START, JSON.stringify(obj))
	}

	queryActive() {
		WebSckts.send(Action.ACTIVE, JSON.stringify({ action: Action.toString(Action.ACTIVE) }))
	}

	queryExtend() {
	}

	queryRules() {
		this.queryActive()
	}

	queryGuide() {
	}

	queryLink() {
	}

	queryScore() {
		WebSckts.send(Action.SCORE, JSON.stringify({ action: Action.toString(Action.SCORE), quiz_id: this.dataStore.quiz.id }))
	}

	onResponseStart(response: string) {
		const res = JSON.parse(response)
		if (this.canAcceptQuizSnapshot(res)) {
			this.dataStore.setSnapshot(res)
			this.dataStore.setReady(true)
		}
	}

	onResponseHint(response: string) {
		const res = JSON.parse(response)
		if (this.canAcceptQuestionSnapshot(res)) {
			this.dataStore.setSnapshot(res)
			this.dataStore.setHintRevealed(true)
		}
	}

	onResponsePass(response: string) {
		const res = JSON.parse(response)
		if (this.canAcceptQuestionSnapshot(res)) {
			this.dataStore.setSnapshot(res)
		}
	}

	onResponseRight(response: string) {
		const res = JSON.parse(response)
		if (this.canAcceptQuestionSnapshot(res)) {
			this.dataStore.setSnapshot(res)
			this.dataStore.setAnswerRevealed(true)
		}
	}

	onResponseNext(response: string) {
		const res = JSON.parse(response)
		if (this.canAcceptQuizSnapshot(res)) {
			this.dataStore.setSnapshot(res)
			this.dataStore.setAnswerRevealed(false)
			this.dataStore.setHintRevealed(false)
		}
	}

	canAcceptQuizSnapshot(response: Snap): boolean {
		return response.quiz_id === this.dataStore.quizId
	}

	canAcceptQuestionSnapshot(response: Snap): boolean {
		return response.quiz_id === this.dataStore.quizId && response.question_id === this.dataStore.questionId
	}
}