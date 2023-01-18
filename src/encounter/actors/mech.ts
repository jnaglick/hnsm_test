import type { EncounterAction } from "$encounter/actions/typeDefs";
import { EncounterActionType } from "$encounter/actions/typeDefs";

import type { Mech } from "$entity/mech";

export function mechActorFactory(mech: Mech) {
  return {
    id: mech.descriptor.name,
    getAction(): EncounterAction {
      // target = random target from context.actors
      // weapon = random weapon
      // return attack action({target, weapon})

      return {
        __type: EncounterActionType.Attack,
        targetActorId: "1",
      };
    },
  };
}
