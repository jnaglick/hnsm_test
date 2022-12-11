import type { EncounterAction } from "../actions/typeDefs";

export type EncounterActor = {
  id: string;
  getAction: () => EncounterAction; // TODO pass (abriged) context
};
