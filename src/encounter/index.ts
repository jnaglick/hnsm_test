import actions from "./actions";
import { EncounterActionType } from "./actions/typeDefs";
import { Timer } from "./util/timer";

import { EncounterActor, EncounterContext, EncounterEvent, EncounterEventType } from "./typeDefs";

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
      this.eventTimer.insert({ at: 0 }, {
        __type: EncounterEventType.PromptForTurn,
        actorId: actorId, // TODO eslint
      });
    });
  }

  public go() {
    while (this.eventTimer.currentTime.at < 100) {
      if (!this.tick()) {
        break;
      }
    }

    if (this.eventTimer.peekNext()) {
      console.log("timer has  events left ~~")
    }
  }

  private tick() {
    const maybeNextEvent = this.eventTimer.next();
  
    if (!maybeNextEvent) {
      console.log('> GAME OVER!');
      return false;
    }

    const { item: event } = maybeNextEvent;

    const { __type: eventType } = event;

    const context = {
      eventTimer: this.eventTimer,
      actors: this.actors,
    };
  
    if (eventType === EncounterEventType.PromptForTurn) {      
      const actor = this.actors[event.actorId];
      this.resolveTurn(context, actor);
    }

    if (eventType === EncounterEventType.Exec) {
      event.exec(context);
    }

    return true;
  }

  private resolveTurn(context: EncounterContext, actor: EncounterActor) {
    const action = actor.getAction(); // TODO pass (abriged) ctx

    const { __type: actionType } = action;

    let handlerResult;

    switch(actionType) { // TODO improve this so dont need to add cases for every action...
      case EncounterActionType.Broadcast:
        handlerResult = actions.broadcast(context, action); // TODO context, action, actor (def type?)
        break;
      case EncounterActionType.Wait:
        handlerResult = actions.wait(context, action); // TODO context, action, actor (def type?)
        break;
      case EncounterActionType.SelfDestruct:
      default:
    }

    if (handlerResult) {
      const { cooldown } = handlerResult;

      // insert next turn at cooldown
      this.eventTimer.insert({ at: cooldown }, {
        __type: EncounterEventType.PromptForTurn,
        actorId: actor.id,
      });
    }
  }
}