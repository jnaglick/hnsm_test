import { GameAction, GameActionType } from "./actions";
import { rand } from "./util/rand";
import { Timer } from "./util/timer";

enum GameEventType {
  PromptForTurn = "PROMPT_FOR_TURN",
  Exec = "EXEC",
}

type GameEventMetadata<T extends GameEventType, Payload = {}> = {
  __type: T;
} & Payload;

type PromptForTurnEvent = GameEventMetadata<GameEventType.PromptForTurn, {
  actorId: string;
}>;

type ExecEvent = GameEventMetadata<GameEventType.Exec, {
  exec: () => void; // TODO param: Game
}>;

type GameEvent = PromptForTurnEvent | ExecEvent;

type GameActor = {
  id: string;
  getAction: () => GameAction;
};

export class Encounter {
  private actors: Record<string, GameActor>;
  private eventTimer = new Timer<GameEvent>();

  constructor(actors: Record<string, GameActor>) {
    this.actors = actors;
    this.init();
  }

  private init() {
    // TODO decide real order
    Object.entries(this.actors).forEach(([actorId]) => {
      this.eventTimer.insert({ at: 0 }, {
        __type: GameEventType.PromptForTurn,
        actorId: actorId, // TODO eslint
      });
    });
  }

  public go() {
    do {
      // get next action:
      const maybeNextEvent = this.eventTimer.next();
  
      if (!maybeNextEvent) {
        console.log('> GAME OVER!');
        break;
      }
  
      const { item: event } = maybeNextEvent;
  
      if (event.__type === GameEventType.PromptForTurn) {      
        const actor = this.actors[event.actorId];
        this.resolveTurn(actor);
      }

      if (event.__type === GameEventType.Exec) {
        event.exec();
      }
    } while (this.eventTimer.currentTime.at < 1000);
  } 

  private resolveTurn(actor: GameActor) {
    const action = actor.getAction();
    const { __type: type, __actorId: actorId } = action;

    let cooldown = 0;

    // * * * SAY
    if (type === GameActionType.Say) {
      this.eventTimer.insert({ at: 0 }, {
        __type: GameEventType.Exec,
        exec() {
          console.log(`[${actorId}] ${action.str}`)
        }
      });
  
      cooldown = action.str.length
    }

    // * * * CAST
    if (type === GameActionType.Cast) {
      console.log(`> ${actorId} casts a spell!`)

      this.eventTimer.insert({ at: 5 }, { // <=== action to spell event
        __type: GameEventType.Exec,
        exec() {
          console.log(`> ${actorId}'s fireball goes blam-o!`)
        }
      });

      cooldown = 10 + rand(10);
    }

    // * * * BROADCAST
    if (type === GameActionType.Broadcast) {
      this.eventTimer.insertNext({
        __type: GameEventType.Exec,
        exec() {
          console.log(`> ${action.str}`)
        }
      });
  
      cooldown = 5; // <=== TODO problem!
    }

    // * * * WAIT
    if (type === GameActionType.Wait) {
      cooldown = action.waitForTicks;
    }
    
    // * * * SELF DESTRUCT
    if (type === GameActionType.SelfDestruct) {
      // TODO kill? this.actors[action.__actorId] == undefined;
      return;
    }

    // insert next turn at cooldown
    this.eventTimer.insert({ at: cooldown }, {
      __type: GameEventType.PromptForTurn,
      actorId,
    });
  }
}