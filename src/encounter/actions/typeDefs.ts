import type { EncounterActor } from "../actors/typeDefs";
import type { EncounterContext } from "../typeDefs";

export enum EncounterActionType {
  Say = "SAY",
  Broadcast = "BROADCAST",
  Wait = "WAIT",
  SelfDestruct = "SELF_DESTRUCT",
  Attack = "ATT",
  Cast = "CAST",
}

type EncounterActionMeta<
  T extends EncounterActionType,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = {
  __type: T;
} & Payload;

// puts something in the logs
export type BroadcastAction = EncounterActionMeta<
  EncounterActionType.Broadcast,
  {
    str: string;
  }
>;

// self-destructs (for objects)
export type SelfDestructAction =
  EncounterActionMeta<EncounterActionType.SelfDestruct>;

// waits (for objects)
export type WaitAction = EncounterActionMeta<
  EncounterActionType.Wait,
  {
    waitForTicks: number;
  }
>;

export type EncounterAction = BroadcastAction | SelfDestructAction | WaitAction;

export type ActionHandlerParams<T> = {
  context: EncounterContext;
  actor: EncounterActor;
  action: T;
};
