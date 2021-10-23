export type BQUrl = {
  url: string
}

export class Urls {

  static toReception = () => this.toPage('/reception')

  static toLobby = () => this.toPage('/lobby')

  static toQuiz = () => this.toPage('/quiz')

  static toCreate = () => this.toPage('/create')

  static toJoin = () => this.toPage('/join')

  static toWatch= () => this.toPage('/watch')

  static toPage = (url: string) => window.location.href = url
}