import type { ActionHandlerParams, BroadcastAction } from "./typeDefs";
import { EncounterEventType } from "../events/typeDefs";

export function broadcast({
  context,
  action,
}: ActionHandlerParams<BroadcastAction>) {
  const { eventTimer } = context;

  eventTimer.insertNext({
    __type: EncounterEventType.Exec,
    exec() {
      console.log(`> ${action.str}`);
    },
  });

  return {
    cooldown: 5,
  };
}
