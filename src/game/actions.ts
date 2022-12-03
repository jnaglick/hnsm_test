export enum GameActionType {
  Say = "SAY",
  Attack = "ATT",
  Cast = "CAST",
}

export type GameActionMetadata<T extends GameActionType, Payload = {}> = {
  __type: T;
  __actorId: string;
} & Payload;

export type SayAction = GameActionMetadata<GameActionType.Say, {
  str: string;
}>;

export type AttackAction = GameActionMetadata<GameActionType.Attack, {
  targetId: string;
}>;

export type CastAction = GameActionMetadata<GameActionType.Cast, {
  spellId: string;
}>;

export type GameAction = SayAction | AttackAction | CastAction;
