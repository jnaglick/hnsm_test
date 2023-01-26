import type { EncounterActor } from "./actors/typeDefs";
import type { EncounterEvent } from "./events/typeDefs";
import type { Timer } from "./util/timer";

export type HasEncounterMetadata<
  T,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = {
  __type: T;
} & Payload;

export type EncounterContext = {
  actors: Record<string, EncounterActor>;
  eventTimer: Timer<EncounterEvent>;
};
