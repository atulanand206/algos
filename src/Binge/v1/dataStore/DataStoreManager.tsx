import { ROLE_PLAYER, ROLE_QUIZMASTER } from "../../Features/Features"
import { Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_QuizId, Action_Create, Action_Join, Action_Watch, Form_Audience, Form_Credentials, Form_Player, Form_QuizMaster } from "../pages/Credentials/Credentials"
import { Action } from "../utils/Action"
import { Player, Snap } from "../utils/_interfaces"
import { WebSckts } from "../utils/_websockets"
import { DataStore } from "./DataStore"

export class DataStoreManager {

  static _instance: DataStoreManager

  dataStore: DataStore = new DataStore()

  constructor() {
    if (DataStoreManager._instance) {
      return DataStoreManager._instance
    }
    DataStoreManager._instance = this
  }

  formEntered(action: string, entries: Map<string, string>) {
		switch (this.dataStore.formType) {
			case Form_Credentials: this.onPlayerCreated(action); break;
			case Form_QuizMaster: this.createQuiz(entries); break;
			case Form_Player: this.joinPlayer(entries); break;
			case Form_Audience: this.joinAudience(entries); break;
		}
	}
	
	onPlayerCreated(action: string){
		switch (action) {
			case Action_Create:
				this.dataStore.setFormType(Form_QuizMaster)
				this.dataStore.setRole(ROLE_QUIZMASTER)
				break
			case Action_Join:
				this.dataStore.setFormType(Form_Player)
        this.dataStore.setRole(ROLE_PLAYER)
				break
			case Action_Watch:
				this.dataStore.setFormType(Form_Audience)
				break
		}
	}

  onResponsePlayer(player: Player) {
		this.dataStore.setPlayer(player)
		this.dataStore.setLaunched(true)
	}

	onResponseCreateGame(response: string) {
		const res = JSON.parse(response)
		if (res.quiz.quizmaster.id === this.dataStore.player.id) {
			this.dataStore.setSnapshot(res)
			this.dataStore.setEntered(true)
		}
	}

	onResponseJoinGame(response: string, quizId: string) {
		const res = JSON.parse(response)
			console.log(res)
			if (DataStoreManager._instance.canAcceptQuizSnapshot(res)) {
				if (res.quiz.quizmaster.id === this.dataStore.player.id) {
					this.dataStore.setRole(ROLE_QUIZMASTER)
				}
				if (res.quiz.active) {
					this.dataStore.setSnapshot(res)
					this.dataStore.setReady(true)
				} else {
					this.dataStore.setEntered(true)
				}
			}
	}
	
	onResponseWatchGame(response: string, quizId: string) {
		const res = JSON.parse(response)
		if (DataStoreManager._instance.canAcceptQuizSnapshot(res)) {
			if (res.quiz.active) {
				this.dataStore.setSnapshot(res)
				this.dataStore.setReady(true)
			} else {
				this.dataStore.setEntered(true)
			}
		}
	}


	onResponseScore(response: string) {
	}

	onResponseActive(response: string) {

	}

	onResponseRefresh() {
		const obj = { person: DataStore._instance.player, quiz_id: DataStore._instance.quiz.id }
		WebSckts.send(Action.REFRESH,  JSON.stringify(obj))
	}
  
  handlerPlayer(email: string, x: () => void) {
    WebSckts.register(Action.S_PLAYER, (response: string) => {
      const res = JSON.parse(response)
      if (res.email === email) {
        this.onResponsePlayer(res)
        console.log(res)
        x()
      }	
    })
  }

  onLoginSuccess (player: Player, x: () => void){
    this.handlerPlayer(player.email, x)
    const obj = {action: Action.BEGIN, person: player}
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
		WebSckts.register(Action.S_GAME, (res) => this.onResponseWatchGame(res, quizId))
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
		const obj = { action:Action.SPECS, person: this.dataStore.player, specs: specs }
		this.handlerQuizmaster()
		WebSckts.send(Action.SPECS, JSON.stringify(obj))
	}

	joinPlayer(entries: Map<string, string>) {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { action: Action.JOIN, person: this.dataStore.player, quiz_id: quizId }
		this.handlerJoinPlayer(quizId)
		WebSckts.send(Action.JOIN, JSON.stringify(obj))
	}

	joinAudience(entries: Map<string, string>) {
		const quizId = entries.get(Entry_QuizId) || ''
		const obj = { action: Action.WATCH, person: this.dataStore.player, quiz_id: quizId }
		this.handlerAudience(quizId)
		WebSckts.send(Action.WATCH, JSON.stringify(obj))
	}

	start() {
    const obj = { action: Action.START, snapshot: this.dataStore.snapshotRequest }
		WebSckts.send(Action.START, JSON.stringify(obj))
	}

	queryActive() {
		WebSckts.send(Action.ACTIVE, JSON.stringify({ action: Action.ACTIVE }))
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
		WebSckts.send(Action.SCORE, JSON.stringify({ action: Action.SCORE, quiz_id: this.dataStore.quiz.id }))
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