import { state } from "../state/State"

export type BQUrl = {
  url: string
}

export class Urls {

  static toReception = () => this.toPage('reception')

  static toLobby = () => this.toPage('lobby')

  static toQuiz = () => this.toPage('quiz')

  static toCreate = () => this.toPage('create')

  static toJoin = () => this.toPage('join')

  static toWatch = () => this.toPage('watch')
  
  static toPodium = () => this.toPage('podium')

  static toPage = (url: string) => state.page = url
}