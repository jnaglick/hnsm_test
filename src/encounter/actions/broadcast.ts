import type { ActionHandlerParams, BroadcastAction } from "./types";
import { insertExecuteNext } from "./helpers/insertExecuteNext";
import { insertPromptForTurn } from "./helpers/insertPromptForTurn";

export function broadcast({
  context,
  action: { str },
  actor,
}: ActionHandlerParams<BroadcastAction>) {
  const broadcastString = ["> ", str].join(" ");

  insertExecuteNext({
    context,
    exec: () => {
      console.log(broadcastString);
    },
  });

  insertPromptForTurn(context, actor, 5);
}
