
export enum Action {
  BEGIN,
  SPECS,
  JOIN,
  WATCH,
  START,
  HINT,
  RIGHT,
  PASS,
  NEXT,
  SCORE,
  Over,
  Extend,
  REFRESH,
  ACTIVE,
  S_ACTIVE,
  S_JOIN,
  S_GAME,
  S_PLAYER,
  S_START,
  S_HINT,
  S_RIGHT,
  S_PASS,
  S_NEXT,
  S_SCORE,
  S_Question,
  S_Answer,
  S_Over,
  S_REFRESH,
  Failure
}

export namespace Action {
  export const toString = (action: Action): string => {
    return Action[action];
  }

  export const fromString = (action: string): Action => {
    return (Action as any)[action];
  }
}
