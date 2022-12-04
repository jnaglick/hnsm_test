import { GameAction, GameActionType } from "../actions";
import { rand } from "../util/rand";

export const bot1 = {
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

export const bot2 = {
  id: "BOT2",
  getAction(): GameAction {
    return {
      __type: GameActionType.Cast,
      __actorId: this.id,
      spellId: "FIREBALL"
    }
  }
};
