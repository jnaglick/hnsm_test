import actions from "./actions";
import type { EncounterAction } from "./actions/typeDefs";
import { EncounterActionType } from "./actions/typeDefs";
import type { EncounterActor } from "./actors/typeDefs";
import type { EncounterContext } from "./typeDefs";
import type { EncounterEvent } from "./events/typeDefs";
import { EncounterEventType } from "./events/typeDefs";
import { Timer } from "./util/timer";

function resolveAction(
  context: EncounterContext,
  actor: EncounterActor,
  action: EncounterAction
) {
  const { __type: actionType } = action;

  // TODO improve this so dont need to add cases for every action...
  switch (actionType) {
    case EncounterActionType.Broadcast:
      actions.broadcast({ context, actor, action });
      break;
    case EncounterActionType.Wait:
      actions.wait({ context, actor, action });
      break;
    case EncounterActionType.SelfDestruct:
      actions.selfDestruct();
      break;
    default:
  }
}

export class Encounter {
  private actors: Record<string, EncounterActor>;

  private eventTimer = new Timer<EncounterEvent>();

  constructor(actors: Record<string, EncounterActor>) {
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
        break;
      }
    }

    if (this.eventTimer.peekNext()) {
      console.log("timer has  events left ~~");
    }
  }

  private tick() {
    const maybeNextEvent = this.eventTimer.next();

    if (!maybeNextEvent) {
      console.log("> GAME OVER!");
      return false;
    }

    const event = maybeNextEvent.item;

    const { __type: eventType } = event;

    const context = {
      eventTimer: this.eventTimer,
      actors: this.actors,
    };

    if (eventType === EncounterEventType.PromptForTurn) {
      const actor = this.actors[event.actorId];

      const action = actor.getAction(); // TODO pass (abriged) ctx

      resolveAction(context, actor, action);
    }

    if (eventType === EncounterEventType.Exec) {
      event.exec(context);
    }

    return true;
  }
}
