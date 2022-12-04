export enum GameActionType {
  Say = "SAY",
  Broadcast = "BROADCAST",
  Wait = "WAIT",
  SelfDestruct = "SELF_DESTRUCT",
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

export type CastAction = GameActionMetadata<GameActionType.Cast, {
  spellId: string;
}>;

// puts something in the logs
export type BroadcastAction = GameActionMetadata<GameActionType.Broadcast, {
  str: string;
}>;

// waits (for objects)
export type WaitAction = GameActionMetadata<GameActionType.Wait, {
  waitForTicks: number;
}>;

// self-destructs (for objects)
export type SelfDestructAction = GameActionMetadata<GameActionType.SelfDestruct>;

export type GameAction = SayAction | CastAction | BroadcastAction | WaitAction | SelfDestructAction;
