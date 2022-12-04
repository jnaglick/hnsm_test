import { GameAction, GameActionType } from "../actions";
import { percentCheck } from "../util/rand";
import { StateMachine } from "../util/state";

export function candleFactory(identfier: string) {
  const machine = new StateMachine({
    initial: "INITIAL",
    links: {
      "INITIAL": {
        "NEXT": "WAIT_OR_FLICKER",
      },
      "WAIT_OR_FLICKER": {
        "LEFT": "LEFT",
        "RIGHT": "RIGHT",
      },
      "LEFT": {
        "BACK": "INITIAL",
        "SMOLDERING": "SMOLDER1",
      },
      "RIGHT": {
        "BACK": "INITIAL",
        "SMOLDERING": "SMOLDER1",
      },
      "SMOLDER1": { "NEXT": "SMOLDER2" },
      "SMOLDER2": { "NEXT": "SMOLDER3" },
      "SMOLDER3": { "NEXT": "OFF" },
      "OFF": {}
    }
  })

  const strs: Record<string, string> = {
    "INITIAL": `the ${identfier} candle burns`,
    "WAIT_OR_FLICKER": `the ${identfier} candle starts to shake`,
    "LEFT": `the ${identfier} candle flickers left`,
    "RIGHT": `the ${identfier} candle flickers right`,
    "SMOLDER1": `the ${identfier} candle flickers violently!`,
    "SMOLDER2": `the ${identfier} candle dims`,
    "SMOLDER3": `the ${identfier} candle goes out...`,
  };

  return {
    id: `Candle:${identfier}`,
    getAction(): GameAction { 
      if (machine.state === "OFF") {
        return {
          __type: GameActionType.SelfDestruct,
        __actorId: this.id,
        }
      }      

      const str = strs[machine.state];

      if (machine.state === "INITIAL") {
        machine.next("NEXT");
      } else if (machine.state === "WAIT_OR_FLICKER") {
        if (percentCheck(90)) {
          return {
            __type: GameActionType.Wait,
           __actorId: this.id,
            waitForTicks: 5,
          }
        }
        machine.next(percentCheck(50) ? "LEFT" : "RIGHT"); 
      } else if (machine.state === "LEFT" || machine.state === "RIGHT") {
        machine.next(percentCheck(90) ? "BACK" : "SMOLDERING");
      } else {
        machine.next("NEXT");
      }

      return {
        __type: GameActionType.Broadcast,
        __actorId: this.id,
        str
      }
    }
  }
}