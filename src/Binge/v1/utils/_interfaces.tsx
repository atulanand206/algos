export type Score = {
    current: number
    overall: number
}

export type Player = {
    id: string
    name: string
    email: string
    // scores: Score
}

export type Team = {
    id: string
    name: string
    players: Player[]
}

export type Specs = {
    teams: number
    players: number
    questions: number
}

export type Game = {
    id: string
    quizmaster: Player
    tags: string[]
    teams: Team[]
    specs: Specs
}

export type Question = {
    id: string
    statements: string[]
    tag: string
}

export type Answer = {
    id: string
    questionId: string
    answer: string
}
