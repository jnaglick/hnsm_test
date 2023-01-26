import type { EncounterAction } from "$encounter/actions/typeDefs";
import { EncounterActionType } from "$encounter/actions/typeDefs";
 

import type { Mech } from "$entity/mech";

export function mechActorFactory(mech: Mech) {
  return {
    id: mech.descriptor.name,
    getAction(): EncounterAction {
      // target = random target from context.actors
      const targetActorId = "1";

      // weapon = random weapon
      const weapon = mech.weapons[0];

      // return attack action({target, weapon})
      return {
        __type: EncounterActionType.Attack,
        targetActorId,
        weapon,
      };
    },
  };
}
