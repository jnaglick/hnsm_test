import type { EncounterAction } from "./actions/typeDefs";
import type { EncounterEvent } from "./events/typeDefs";
import type { Timer } from "./util/timer";

export type EncounterActor = {
  id: string;
  getAction: () => EncounterAction; // TODO pass (abriged) context
};

export type EncounterContext = {
  actors: Record<string, EncounterActor>;
  eventTimer: Timer<EncounterEvent>;
};

export type HasEncounterMetadata<
  T,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = {
  __type: T;
} & Payload;
