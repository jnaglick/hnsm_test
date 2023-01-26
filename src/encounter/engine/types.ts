import type { EncounterActor } from "$encounter/actors/types";
import type { EncounterEvent } from "$encounter/events/types";
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
