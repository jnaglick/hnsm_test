import type { EncounterActor, EncounterContext } from "../../typeDefs";
import { EncounterEventType } from "../../events/typeDefs";

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
