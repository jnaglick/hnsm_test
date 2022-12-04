import { EncounterContext, EncounterEventType } from "../typeDefs";
import { BroadcastAction } from "./typeDefs";

export function broadcast(ctx: EncounterContext, action: BroadcastAction) {
  const { eventTimer } = ctx;

  eventTimer.insertNext({
    __type: EncounterEventType.Exec,
    exec() {
      console.log(`> ${action.str}`)
    }
  });

  return {
    cooldown: 5
  }
}
