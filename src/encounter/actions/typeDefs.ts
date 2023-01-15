import type {
  EncounterActor,
  EncounterContext,
  HasEncounterMetadata,
} from "$encounter/typeDefs";

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
> = HasEncounterMetadata<T, Payload>;

/*
 *  Broadcast
 */
export type BroadcastAction = EncounterActionMeta<
  EncounterActionType.Broadcast,
  {
    str: string;
  }
>;

/*
 *  Self-destruct
 */
export type SelfDestructAction =
  EncounterActionMeta<EncounterActionType.SelfDestruct>;

/*
 *  Wait
 */
export type WaitAction = EncounterActionMeta<
  EncounterActionType.Wait,
  {
    waitForTicks: number;
  }
>;

export type EncounterAction = BroadcastAction | SelfDestructAction | WaitAction;

/*
 *  Other...
 */
export type ActionHandlerParams<T> = {
  context: EncounterContext;
  actor: EncounterActor;
  action: T;
};
