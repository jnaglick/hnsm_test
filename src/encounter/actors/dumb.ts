import type { EncounterAction } from "$encounter/actions/typeDefs";
import { EncounterActionType } from "$encounter/actions/typeDefs";
import { rand } from "$encounter/util/rand";

export const bot1 = {
  id: "BOT1",
  strs: [
    "Hello I am bot 1 this is a medium sentence",
    "Hi",
    "Yo",
    "Sup",
    "Hey",
    "Ayyo",
    "Hola",
    "Salut",
    "Nihao",
    "Im gonna make a very very long speech and then get tired and go away for a while now...",
  ],
  getAction(): EncounterAction {
    return {
      __type: EncounterActionType.Broadcast,
      str: `${this.id} says: ${this.strs[rand(this.strs.length)]}`,
    };
  },
};
