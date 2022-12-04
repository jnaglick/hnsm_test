export enum EncounterActionType {
  Say = "SAY",
  Broadcast = "BROADCAST",
  Wait = "WAIT",
  SelfDestruct = "SELF_DESTRUCT",
  Attack = "ATT",
  Cast = "CAST",
}

type EncounterActionMeta<T extends EncounterActionType, Payload = {}> = {
  __type: T;
} & Payload;

/*
export type SayAction = EncounterActionMeta<EncounterActionType.Say, {
  str: string;
}>;

export type CastAction = EncounterActionMeta<EncounterActionType.Cast, {
  spellId: string;
}>;
*/

// puts something in the logs
export type BroadcastAction = EncounterActionMeta<EncounterActionType.Broadcast, {
  str: string;
}>;

// waits (for objects)
export type WaitAction = EncounterActionMeta<EncounterActionType.Wait, {
  waitForTicks: number;
}>;

// self-destructs (for objects)
type SelfDestructAction = EncounterActionMeta<EncounterActionType.SelfDestruct>;

export type EncounterAction = BroadcastAction | SelfDestructAction | WaitAction;
