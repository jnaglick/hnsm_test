import type { EncounterContext } from "../typeDefs";

export enum EncounterEventType {
  PromptForTurn = "PROMPT_FOR_TURN",
  Exec = "EXEC",
}

type EncounterEventMeta<
  T extends EncounterEventType,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = {
  __type: T;
} & Payload;

type PromptForTurnEvent = EncounterEventMeta<
  EncounterEventType.PromptForTurn,
  {
    actorId: string;
  }
>;

type ExecEvent = EncounterEventMeta<
  EncounterEventType.Exec,
  {
    exec: (context: EncounterContext) => void;
  }
>;

export type EncounterEvent = PromptForTurnEvent | ExecEvent;
