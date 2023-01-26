import type { EncounterActor } from "$encounter/actors/types";
import type { EncounterContext } from "$encounter/engine/types";
import { EncounterEventType } from "$encounter/events/types";

export function insertPromptForTurn(
  context: EncounterContext,
  actor: EncounterActor,
  at: number
) {
  const { eventTimer } = context;

  eventTimer.insert(
    { at },
    {
      __type: EncounterEventType.PromptForTurn,
      actorId: actor.id,
    }
  );
}
