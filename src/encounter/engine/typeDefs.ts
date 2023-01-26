import type { EncounterActor } from "$encounter/actors/typeDefs";
import type { EncounterEvent } from "$encounter/events/typeDefs";
import type { Timer } from "$encounter/util/timer";

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
