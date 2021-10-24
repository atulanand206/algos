import { ROLE_PLAYER } from "../features/Features";
import { Player, Team } from '../utils/_interfaces';

export const quizId = (snap: any) => {
  return snap.snapshot.quiz_id
}

export const questionId = (snap: any) => {
  return snap.snapshot.question_id
}

export const getPlayersTeamId = (snap: any) => {
  if (snap.role === ROLE_PLAYER) {
    var tems = snap.snapshot.roster.filter((team: Team) => team.players.filter((playr: Player) => playr.id === snap.player.id).length === 1)
    if (tems.length === 1) {
      var tem: Team = tems[0]
      return tem.id
    }
  }
  return ""
}

export const snapshotRequest = (snap: any) => {
  return { quiz_id: snap.snapshot.quiz_id, team_s_turn: snap.snapshot.team_s_turn, question_id: snap.snapshot.question_id }
}
