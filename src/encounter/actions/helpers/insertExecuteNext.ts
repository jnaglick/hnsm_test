import type { EncounterContext } from "$encounter/engine/types";
import { EncounterEventType } from "$encounter/events/types";

type InsertExecuteNextParams = {
  context: EncounterContext;
  exec: () => void;
};

export function insertExecuteNext({ context, exec }: InsertExecuteNextParams) {
  const { eventTimer } = context;

  eventTimer.insertNext({
    __type: EncounterEventType.Exec,
    exec,
  });
}
