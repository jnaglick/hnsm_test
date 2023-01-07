import type { ActionHandlerParams, BroadcastAction } from "./typeDefs";
import { EncounterEventType } from "../events/typeDefs";
import { insertPromptForTurn } from "./helpers/insertPromptForTurn";

export function broadcast({
  context,
  action,
  actor,
}: ActionHandlerParams<BroadcastAction>) {
  const { eventTimer } = context;

  eventTimer.insertNext({
    __type: EncounterEventType.Exec,
    exec() {
      console.log(`> ${action.str}`);
    },
  });

  insertPromptForTurn(context, actor, 5);
}
