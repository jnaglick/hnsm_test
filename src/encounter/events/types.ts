import type {
  EncounterContext,
  HasEncounterMetadata,
} from "$encounter/engine/types";

export enum EncounterEventType {
  PromptForTurn = "PROMPT_FOR_TURN",
  Exec = "EXEC",
}

type EncounterEventMeta<
  T extends EncounterEventType,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = HasEncounterMetadata<T, Payload>;

/*
 *  Prompt for Turn
 */
type PromptForTurnEvent = EncounterEventMeta<
  EncounterEventType.PromptForTurn,
  {
    actorId: string;
  }
>;

/*
 *  Exec
 */
type ExecEvent = EncounterEventMeta<
  EncounterEventType.Exec,
  {
    exec: (context: EncounterContext) => void;
  }
>;

export type EncounterEvent = PromptForTurnEvent | ExecEvent;
