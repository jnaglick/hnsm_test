import type { EncounterActor } from "$encounter/actors/typeDefs";
import type { EncounterContext } from "$encounter/engine/typeDefs";
import { EncounterEventType } from "$encounter/events/typeDefs";

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
