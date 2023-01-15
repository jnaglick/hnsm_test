import type { EncounterContext } from "$encounter/typeDefs";
import { EncounterEventType } from "$encounter/events/typeDefs";

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
