import { ActionHandlerParams, WaitAction } from "./typeDefs";

export function wait({ action }: ActionHandlerParams<WaitAction>) {
  return {
    cooldown: action.waitForTicks
  }
}
