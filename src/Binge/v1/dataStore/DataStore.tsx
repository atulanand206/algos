import { ROLE_PLAYER } from "../features/Features";
import { Player, Snap, Team } from '../utils/_interfaces';

export const quizId = (snap: any) => {
  return snap.snapshot.quiz_id
}

export const questionId = (snap: any) => {
  return snap.snapshot.question_id
}

export const getPlayersTeamId = (role: string, snapshot: Snap, playerId: string) => {
  if (role === ROLE_PLAYER) {
    var tems = snapshot.teams.filter((team: Team) => team.players.filter((playr: Player) => playr.id === playerId).length === 1)
    if (tems.length === 1) {
      var tem: Team = tems[0]
      return tem.id
    }
  }
  return ""
}
