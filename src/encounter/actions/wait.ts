import type { ActionHandlerParams, WaitAction } from "./typeDefs";
import { insertPromptForTurn } from "./helpers/insertPromptForTurn";

export function wait({
  context,
  action: { waitForTicks },
  actor,
}: ActionHandlerParams<WaitAction>) {
  insertPromptForTurn(context, actor, waitForTicks);
}
