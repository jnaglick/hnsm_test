import type { EncounterAction } from "$encounter/actions/typeDefs";
import type { EncounterContext } from "$encounter/typeDefs";

type GetActionParams = Pick<EncounterContext, "actors">;

export type EncounterActor = {
  id: string;
  getAction: (params: GetActionParams) => EncounterAction; // TODO pass (abriged) context
};
