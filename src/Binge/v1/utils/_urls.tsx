export type BQUrl = {
  url: string
}

export class Urls {

  static toReception() {
    window.location.href = '/reception'
  }

  static toLobby() {
    window.location.href = '/lobby'
  }

  static toQuiz() {
    window.location.href = '/quiz'
  }

  static toCreate() {
    window.location.href = '/create'
  }

  static toJoin() {
    window.location.href = '/join'
  }

  static toWatch() {
    window.location.href = '/watch'
  }
}