import { EncounterContext } from "../typeDefs";
import { WaitAction } from "./typeDefs";

export function wait(_ctx: EncounterContext, action: WaitAction) {
  return {
    cooldown: action.waitForTicks
  }
}
