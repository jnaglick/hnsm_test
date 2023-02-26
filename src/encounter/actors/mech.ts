import type { EncounterActor, GetActionParams } from "./types";

import type { EncounterAction } from "$encounter/actions/types";
import { EncounterActions } from "$encounter/actions/types";

import type { Mech } from "$entity/mech";

export function mechActorFactory(mech: Mech): EncounterActor {
  return {
    id: mech.descriptor.name,
    getAction({ actors }: GetActionParams): EncounterAction {
      // target = random target from context.actors
      const actor = actors[0];

      // weapon = random weapon
      const weapon = mech.weapons[0];

      // return attack action({target, weapon})
      return {
        __type: EncounterActions.Attack,
        actor,
        weapon,
      };
    },
  };
}
