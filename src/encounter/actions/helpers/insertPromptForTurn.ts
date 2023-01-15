import type { EncounterActor, EncounterContext } from "$encounter/typeDefs";
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
