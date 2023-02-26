import type { EncounterAction } from "$encounter/actions/types";
import type { EncounterContext } from "$encounter/engine/types";

export type GetActionParams = Pick<EncounterContext, "actors">;

export type EncounterActor = {
  id: string;
  getAction: (params: GetActionParams) => EncounterAction; // TODO pass (abriged) context
};
