import { EncounterAction } from "./actions/typeDefs";
import { Timer } from "./util/timer";

export enum EncounterEventType {
  PromptForTurn = "PROMPT_FOR_TURN",
  Exec = "EXEC",
}

type EncounterEventMeta<T extends EncounterEventType, Payload = {}> = {
  __type: T;
} & Payload;

type PromptForTurnEvent = EncounterEventMeta<EncounterEventType.PromptForTurn, {
  actorId: string;
}>;

type ExecEvent = EncounterEventMeta<EncounterEventType.Exec, {
  exec: (context: EncounterContext) => void;
}>;

export type EncounterEvent = PromptForTurnEvent | ExecEvent;

export type EncounterActor = {
  id: string;
  getAction: () => EncounterAction; // TODO pass (abriged) context
};

export type EncounterContext = {
  actors: Record<string, EncounterActor>;
  eventTimer: Timer<EncounterEvent>;
}