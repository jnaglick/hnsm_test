import type {
  EncounterContext,
  HasEncounterMetadata,
} from "$encounter/typeDefs";

import type { EncounterActor } from "$encounter/actors/typeDefs";

import type { Weapon } from "$entity/mech";

export enum EncounterActionType {
  Broadcast = "BROADCAST",
  SelfDestruct = "SELF_DESTRUCT",
  Wait = "WAIT",
  Attack = "ATT",
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

/*
 *  Attack
 */
export type AttackAction = EncounterActionMeta<
  EncounterActionType.Attack,
  {
    targetActorId: string;
    weapon: Weapon;
  }
>;

export type EncounterAction =
  | AttackAction
  | BroadcastAction
  | SelfDestructAction
  | WaitAction;

/*
 *  Other...
 */
export type ActionHandlerParams<T> = {
  context: EncounterContext;
  actor: EncounterActor;
  action: T;
};
