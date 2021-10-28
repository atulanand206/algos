import { proxy } from "valtio"
import { ROLE_AUDIENCE } from '../features/Features'

const state = proxy({
  page: '',
  role: ROLE_AUDIENCE,
  player: {
    id: "",
    name: "",
    email: ""
  },
  snapshot: {
    quiz_id: '',
    round_no: 1,
    teams: [{
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
    hint: [''],
    can_pass: false
  },
  quiz: {
    id: '',
    quizmaster: {
      id: '',
      name: '',
      email: ''
    },
    specs: {
      teams: 4,
      players: 4,
      questions: 4,
      rounds: 2
    },
    tags: [''],
    active: false
  },
  answerRevealed: false,
  hintRevealed: false
})

export { state }