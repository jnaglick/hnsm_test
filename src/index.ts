import { Timer } from "./util/timer";

const rand = (i: number) => Math.floor(Math.random() * i);

type Metadata<T, Payload = {}> = {
  __type: T;
} & Payload;

// actions 

enum GameActionType {
  Say = "SAY",
  Cast = "CAST",
}

type GameActionMetadata<T, Payload = {}> = Metadata<T, {
  __actorId: string;
} & Payload>;

type SayAction = GameActionMetadata<GameActionType.Say, {
  str: string;
}>;

type CastAction = GameActionMetadata<GameActionType.Cast, {
  spellId: string;
}>;

type GameAction = SayAction | CastAction;

// events

enum GameEventType {
  PromptForTurn = "PROMPT_FOR_TURN",
  ApplyDamage = "APPLY_DAMAGE",
  BroadcastText = "BROADCAST_TEXT",
  Explode = "KABLAM",
}

type PromptForTurnEvent = Metadata<GameEventType.PromptForTurn, {
  actorId: string;
}>;

type ApplyDamageEvent = Metadata<GameEventType.ApplyDamage, {
  targetId: string;
  type: string;
  amount: number;
}>;

type BroadcastTextEvent = Metadata<GameEventType.BroadcastText, {
  str: string;
}>;

type ExplodeEvent = Metadata<GameEventType.Explode>;

type GameEvent = PromptForTurnEvent | ApplyDamageEvent | BroadcastTextEvent | ExplodeEvent;

// bots
type Actor = {
  id: string;
  getAction: () => GameAction;
};

const bot1 = {
  id: "BOT1",
  getAction(): GameAction {
    const strs = [
      "Hello I am bot 1",
      "Hi",
      "Yo",
      "Sup",
      "Wasshup mah dude",
      "Ayyo",
      "Hai this is a bit longer",
      "Nihao",
      "Im gonna make a very very long speech and then get tired and go away for a while now..."
    ];

    const str = strs[rand(strs.length)];

    return {
      __type: GameActionType.Say,
      __actorId: this.id,
      str
    }
  }
};

const bot2 = {
  id: "BOT2",
  getAction(): GameAction {
    return {
      __type: GameActionType.Cast,
      __actorId: this.id,
      spellId: "FIREBALLZ!"
    }
  }
};

// engine
function doTurn(timer: Timer<GameEvent>, actor: Actor) {
  const action = actor.getAction();

  const { __type: type } = action;

  // console.log('> processAction', { action });

  if (type === "SAY") {
    timer.insert({ at: 0 }, {
      __type: GameEventType.BroadcastText,
      str: `${actor.id}: ${action.str}`,
    });

    timer.insert({ at: action.str.length }, {
      __type: GameEventType.PromptForTurn,
      actorId: actor.id,
    });
  }

  if (type === "CAST") {
    timer.insert({ at: 3 }, {
      __type: GameEventType.Explode,
    });

    timer.insert({ at: 10 + rand(10) }, {
      __type: GameEventType.PromptForTurn,
      actorId: actor.id,
    });
  }
}

function executeEvent(event: GameEvent) {
  const { __type: type } = event;

  if (type === "APPLY_DAMAGE") {
    console.log(`Applying ${event.amount} dmg to ${event.targetId} !`)
  }

  if (type === "KABLAM") {
    console.log(`KABLAAAAAMMM!!!`)
  }

  if (type === "BROADCAST_TEXT") {
    console.log(`> ${event.str}`)
  }
}
 
function game() {
  const timer = new Timer<GameEvent>();

  const players: Record<string, any> = {
    "BOT1": bot1,
    "BOT2": bot2,
  };

  // init (in whatever order):

  timer.insert({ at: 0 }, {
    __type: GameEventType.PromptForTurn,
    actorId: "BOT1",
  });
  
  timer.insert({ at: 0 }, {
    __type: GameEventType.PromptForTurn,
    actorId: "BOT2",
  });

  let turnCounter = 0;

  // Game Loop:
  while (timer.currentTime.at < 100) {
    // 1. get next action:
    const maybeNextEvent = timer.next();

    if (!maybeNextEvent) {
      console.log('> GAME OVER!');
      break;
    }

    const { item: event, time } = maybeNextEvent;

    // 2. do needful
    if (event.__type === GameEventType.PromptForTurn) {      
      const player = players[event.actorId];

      console.log(`[TURN ${turnCounter++}, TICK ${time.at}] Player's turn: ${player.id}`);

      doTurn(timer, player);
    } else {
      // console.log(`[TICK ${time.at}]`);
      executeEvent(event);
    }
  }
}

game();
