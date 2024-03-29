import actions from "$encounter/actions/index";

import { EncounterActions } from "$encounter/actions/types";
import type { EncounterActor } from "$encounter/actors/types";
import type { EncounterContext } from "$encounter/engine/types";
import type { EncounterEvent } from "$encounter/events/types";
import { EncounterEventType } from "$encounter/events/types";

import { Timer } from "$encounter/util/timer";

function resolveTurn(context: EncounterContext, actor: EncounterActor) {
  // Get Action
  const action = actor.getAction(context);

  // Log/Store Action
  // TODO

  // Process Action
  // TODO improve this so dont need to add cases for every action...
  switch (action.__type) {
    case EncounterActions.Broadcast:
      actions.broadcast({ context, actor, action });
      break;
    case EncounterActions.Wait:
      actions.wait({ context, actor, action });
      break;
    case EncounterActions.SelfDestruct:
      actions.selfDestruct();
      break;
    default:
  }
}

export class Encounter {
  private actors: Record<string, EncounterActor>;

  private eventTimer = new Timer<EncounterEvent>();

  constructor(actors: Record<string, EncounterActor>) {
    // TODO take array of mechs and init mech actors and any internal actors
    this.actors = actors;
    this.init();
  }

  private init() {
    // TODO decide real order
    Object.entries(this.actors).forEach(([actorId]) => {
      this.eventTimer.insert(
        { at: 0 },
        {
          __type: EncounterEventType.PromptForTurn,
          actorId,
        }
      );
    });
  }

  public go() {
    while (this.eventTimer.currentTime.at < 100) {
      if (!this.tick()) {
        console.log("GAME OVER!");
        break;
      }
    }

    if (this.eventTimer.peekNext()) {
      console.log("(Timer has  events left)");
    }
  }

  private tick() {
    const maybeNextEvent = this.eventTimer.next();

    if (!maybeNextEvent) {
      return false;
    }

    const { item: event } = maybeNextEvent;

    const context = this.context();

    if (event.__type === EncounterEventType.PromptForTurn) {
      const actor = this.actors[event.actorId];
      resolveTurn(context, actor);
    }

    if (event.__type === EncounterEventType.Exec) {
      event.exec(context);
    }

    return true;
  }

  private context(): EncounterContext {
    return {
      eventTimer: this.eventTimer,
      actors: this.actors,
    };
  }
}
