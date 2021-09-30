
export enum Action {
  BEGIN,
  SPECS,
  JOIN,
  WATCH,
  Start,
  Reveal,
  Attempt,
  Score,
  Next,
  Over,
  Extend,
  S_GAME,
  S_PLAYER,
  S_START,
  S_Question,
  S_Answer,
  S_Over,
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
