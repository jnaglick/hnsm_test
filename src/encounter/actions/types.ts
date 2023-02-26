import type {
  EncounterContext,
  HasEncounterMetadata,
} from "$encounter/engine/types";

import type { EncounterActor } from "$encounter/actors/types";

import type { Weapon } from "$entity/mech";

export enum EncounterActions {
  Broadcast = "BROADCAST",
  SelfDestruct = "SELFDESTRUCT",
  Wait = "WAIT",
  Attack = "ATTACK",
}

type EncounterActionMeta<
  T extends EncounterActions,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = HasEncounterMetadata<T, Payload>;

/*
 *  Broadcast
 */
export type BroadcastAction = EncounterActionMeta<
  EncounterActions.Broadcast,
  {
    str: string;
  }
>;

/*
 *  Self-destruct
 */
export type SelfDestructAction =
  EncounterActionMeta<EncounterActions.SelfDestruct>;

/*
 *  Wait
 */
export type WaitAction = EncounterActionMeta<
  EncounterActions.Wait,
  {
    waitForTicks: number;
  }
>;

/*
 *  Attack
 */
export type AttackAction = EncounterActionMeta<
  EncounterActions.Attack,
  {
    actor: EncounterActor;
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
