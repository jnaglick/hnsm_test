import { GameAction, GameActionType } from "./game/actions";
import { rand } from "./util/rand";
import { Timer } from "./util/timer";

enum GameEventType {
  PromptForTurn = "CHARACTER_TURN",
  Exec = "EXEC",
}

type GameEventMetadata<T extends GameEventType, Payload = {}> = {
  __type: T;
} & Payload;

type PromptForTurnEvent = GameEventMetadata<GameEventType.PromptForTurn, {
  actorToPromptId: string;
}>;

type ExecEvent = GameEventMetadata<GameEventType.Exec, {
  apply: () => void; // TODO param: Game
}>;

type GameEvent = PromptForTurnEvent | ExecEvent;

type GameActor = {
  id: string;
  getAction: () => GameAction;
};

class Game {
  private characters: Record<string, GameActor>;
  private eventTimer = new Timer<GameEvent>();
  private state = {
    turn: 0,
  };

  constructor(characters: Record<string, GameActor>) {
    this.characters = characters;
    this.init();
  }

  private init() {
    // TODO decide real order
    Object.entries(this.characters).forEach(([actorId]) => {
      this.eventTimer.insert({ at: 0 }, {
        __type: GameEventType.PromptForTurn,
        actorToPromptId: actorId,
      });
    });
  }

  public go() {
    do {
      //get next action:
      const maybeNextEvent = this.eventTimer.next();
  
      if (!maybeNextEvent) {
        console.log('> GAME OVER!');
        break;
      }
  
      const { item: event } = maybeNextEvent;
  
      // do turn (get char action and push event(s))
      if (event.__type === GameEventType.PromptForTurn) {      
        const character = this.characters[event.actorToPromptId];
        this.resolveTurn(character);
        this.state.turn += 1;
      }

      // process event
      if (event.__type === GameEventType.Exec) {
        event.apply();
      }
    } while (this.eventTimer.currentTime.at < 100);
  } 

  private resolveTurn(actor: GameActor) {
    const action = actor.getAction();
    const { __type: type, __actorId: actorId } = action;

    let cooldown = 0;

    // resolve SAY
    if (type === "SAY") {
      this.eventTimer.insert({ at: 0 }, {
        __type: GameEventType.Exec,
        apply() {
          console.log(`${actor.id} Sez: ${action.str}`)
        }
      });
  
      cooldown = action.str.length
    }
  
    // resolve CAST
    if (type === "CAST") {
      console.log(`> ${actorId} casts a spell!`)

      this.eventTimer.insert({ at: 3 }, { // <=== action to spell event
        __type: GameEventType.Exec,
        apply() {
          console.log(`${actorId}'s fireball goes blam-o!`)
        }
      });

      cooldown = 10 + rand(10);
    }

    // insert cooldown
    this.eventTimer.insert({ at: cooldown }, {
      __type: GameEventType.PromptForTurn,
      actorToPromptId: actorId,
    });
  }
}



// DEMO:

const bot1 = {
  id: "BOT1",
  getAction(): GameAction {
    const strs = [
      "Hello I am bot 1 this is a medium sentence",
      "Hi", "Yo", "Sup", "Hey", "Ayyo", "Hola", "Salut", "Nihao",
      "Im gonna make a very very long speech and then get tired and go away for a while now..."
    ];

    return {
      __type: GameActionType.Say,
      __actorId: this.id,
      str: strs[rand(strs.length)]
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

const game = new Game({
  "BOT1": bot1,
  "BOT2": bot2,
});
game.go();
