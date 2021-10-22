import { makeAutoObservable } from "mobx"
import { ROLE_AUDIENCE, ROLE_PLAYER } from "../../Features/Features";
import { Form_Audience } from "../pages/Credentials/Credentials";
import { Game, Player, Snap, Team } from '../utils/_interfaces';

export class DataStore {

  static _instance: DataStore

  formType = Form_Audience
  role = ROLE_AUDIENCE
  player = {
    id: "",
    name: "",
    email: ""
  }
  snapshot = {
    quiz_id: '',
    round_no: 1,
    roster: [{
      id: "",
      name: "",
      score: 0,
      players: [{
        id: "",
        name: "",
        email: ""
      }]
    }],
    question_no: 1,
    question_id: '',
    team_s_turn: '',
    event_type: '',
    score: 0,
    timestamp: '',
    question: [''],
    answer: [''],
    hint: ['']
  }
  quiz = {
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
  }
  launched = false
  entered = false
  ready = false
  finished = false
  answerRevealed = false
  hintRevealed = false

  constructor() {
    makeAutoObservable(this)
    if (DataStore._instance) {
      return DataStore._instance
    }
    DataStore._instance = this
  }

  setFormType(formType: string) {
    this.formType = formType
  }

  setRole(role: string) {
    this.role = role
  }

  setPlayer(player: Player) {
    this.player = player
  }

  setQuiz(quiz: Game) {
    this.quiz = quiz
  }

  setSnapshot(snapshot: Snap) {
    this.snapshot = snapshot
  }

  get quizId() {
    return this.snapshot.quiz_id
  }

  get questionId() {
    return this.snapshot.question_id
  }

  get snapshotRequest() {
    return { quiz_id: this.snapshot.quiz_id, team_s_turn: this.snapshot.team_s_turn, question_id: this.snapshot.question_id }
  }

  get getPlayersTeamId() {
    if (this.role === ROLE_PLAYER) {
      var tems = this.snapshot.roster.filter((team: Team) => team.players.filter((playr: Player) => playr.id === this.player.id).length === 1)
      if (tems.length === 1) {
        var tem: Team = tems[0]
        return tem.id
      }
    }
    return ""
  }

  setAnswerRevealed(revealed: boolean) {
    this.answerRevealed = revealed
  }

  setHintRevealed(revealed: boolean) {
    this.hintRevealed = revealed
  }

  setLaunched(launched: boolean) {
    this.launched = launched
  }

  setEntered(entered: boolean) {
    this.entered = entered
  }

  setReady(ready: boolean) {
    this.ready = ready
  }

  setFinished(finished: boolean) {
    this.finished = finished
  }
}
