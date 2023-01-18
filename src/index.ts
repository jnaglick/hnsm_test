import { bot1, candleFactory } from "$encounter/actors";
// import { mech, WeaponCatalog } from "$entity/mech";
import { Encounter } from "$encounter/index";

/* const alphaMech = mech({
  name: "alpha",
  hp_max: 100,
  weaponDescriptors: [WeaponCatalog.Chaingun],
});

const betaMech = mech({
  name: "beta",
  hp_max: 50,
  weaponDescriptors: [WeaponCatalog.Chaingun, WeaponCatalog.Chaingun],
}); */

// mechActor

const candle = candleFactory("red");
const candle2 = candleFactory("yellow");

const game = new Encounter({
  [bot1.id]: bot1,
  [candle.id]: candle,
  [candle2.id]: candle2,
});

game.go();
