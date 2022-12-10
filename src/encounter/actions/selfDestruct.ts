import { ActionHandlerParams, SelfDestructAction } from "./typeDefs";

export function selfDestruct(_params: ActionHandlerParams<SelfDestructAction>) {
  return undefined;
}
