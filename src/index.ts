import { GameAction, GameActionType } from "./game/actions";
import { rand } from "./util/rand";
import { StateMachine } from "./util/state";
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

class Game {
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
    } while (this.eventTimer.currentTime.at < 100);
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
      return;
    }

    // insert next turn at cooldown
    this.eventTimer.insert({ at: cooldown }, {
      __type: GameEventType.PromptForTurn,
      actorId,
    });
  }
}

// DEMO:

const bot1 = {
  id: "BOT1",
  strs: [
    "Hello I am bot 1 this is a medium sentence",
    "Hi", "Yo", "Sup", "Hey", "Ayyo", "Hola", "Salut", "Nihao",
    "Im gonna make a very very long speech and then get tired and go away for a while now..."
  ],
  getAction(): GameAction {
    return {
      __type: GameActionType.Say,
      __actorId: this.id,
      str: this.strs[rand(this.strs.length)]
    }
  }
};

const bot2 = {
  id: "BOT2",
  getAction(): GameAction {
    return {
      __type: GameActionType.Cast,
      __actorId: this.id,
      spellId: "FIREBALL"
    }
  }
};

function candleFactory(identfier: string) {
  const machine = new StateMachine({
    initial: "INITIAL",
    links: {
      "INITIAL": {
        "0": "INITIAL",
        "1": "LEFT",
        "2": "RIGHT",
      },
      "LEFT": {
        "0": "INITIAL",
        "1": "INITIAL",
        "2": "SMOLDER",
      },
      "RIGHT": {
        "0": "INITIAL",
        "1": "INITIAL",
        "2": "SMOLDER",
      },
      "SMOLDER": {
        "0": "OFF",
        "1": "OFF",
        "2": "OFF",
      },
      "OFF": {}
    }
  })

  const strs: Record<string, string> = {
    "INITIAL": `the ${identfier} candle burns`,
    "LEFT": `the ${identfier} candle flickers left`,
    "RIGHT": `the ${identfier} candle flickers right`,
    "SMOLDER": `the ${identfier} candle flickers violently and goes out!`,
  };

  return {
    id: `Candle:${identfier}`,
    machine,
    strs,
    getAction(): GameAction { 
      if (this.machine.state === "OFF") {
        return {
          __type: GameActionType.SelfDestruct,
        __actorId: this.id,
        }
      }      

      const str = this.strs[this.machine.state];
      machine.next(rand(3).toString());

      return {
        __type: GameActionType.Broadcast,
        __actorId: this.id,
        str
      }
    }
  }
}

const candle = candleFactory("red");
const candle2 = candleFactory("yellow");

const game = new Game({
  [bot1.id]: bot1,
  [bot2.id]: bot2,
  [candle.id]: candle,
  [candle2.id]: candle2,
});
game.go();
