import type { EncounterAction } from "$encounter/actions/types";
import { EncounterActions } from "$encounter/actions/types";
import { percentCheck } from "$util/rand";
import { StateMachine } from "$encounter/util/state";

export function candleFactory(identfier: string) {
  const machine = new StateMachine({
    initial: "INITIAL",
    links: {
      INITIAL: {
        NEXT: "WAIT_OR_FLICKER",
      },
      WAIT_OR_FLICKER: {
        WAIT: "WAIT",
        LEFT: "LEFT",
        RIGHT: "RIGHT",
      },
      WAIT: {
        NEXT: "INITIAL",
      },
      LEFT: {
        NEXT: "INITIAL",
        SMOLDERING: "SMOLDER1",
      },
      RIGHT: {
        NEXT: "INITIAL",
        SMOLDERING: "SMOLDER1",
      },
      SMOLDER1: { NEXT: "SMOLDER2" },
      SMOLDER2: { NEXT: "SMOLDER3" },
      SMOLDER3: { NEXT: "OFF" },
      OFF: {},
    },
  });

  const strs: Record<string, string> = {
    INITIAL: `the ${identfier} candle burns`,
    WAIT_OR_FLICKER: `the ${identfier} candle starts to flicker`,
    LEFT: `the ${identfier} candle flickers left`,
    RIGHT: `the ${identfier} candle flickers right`,
    SMOLDER1: `the ${identfier} candle flickers violently!`,
    SMOLDER2: `the ${identfier} candle dims`,
    SMOLDER3: `the ${identfier} candle goes out...`,
  };

  return {
    id: `Candle:${identfier}`,
    getAction(): EncounterAction {
      if (machine.state === "OFF") {
        return {
          __type: EncounterActions.SelfDestruct,
        };
      }

      if (machine.state === "WAIT") {
        machine.trigger("NEXT");
        return {
          __type: EncounterActions.Wait,
          waitForTicks: 5,
        };
      }

      const str = strs[machine.state];

      if (machine.state === "INITIAL") {
        machine.trigger("NEXT");
      } else if (machine.state === "WAIT_OR_FLICKER") {
        if (percentCheck(70)) {
          machine.trigger("WAIT");
        } else {
          machine.trigger(percentCheck(50) ? "LEFT" : "RIGHT");
        }
      } else if (machine.state === "LEFT" || machine.state === "RIGHT") {
        machine.trigger(percentCheck(70) ? "NEXT" : "SMOLDERING");
      } else {
        machine.trigger("NEXT");
      }

      return {
        __type: EncounterActions.Broadcast,
        str,
      };
    },
  };
}
