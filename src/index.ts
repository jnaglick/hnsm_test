import { candleFactory } from "./encounter/actors/candle";
import { bot1, bot2 } from "./encounter/actors/dumb";
import { Encounter } from "./encounter";

const candle = candleFactory("red");
const candle2 = candleFactory("yellow");

const game = new Encounter({
  [bot1.id]: bot1,
  [bot2.id]: bot2,
  [candle.id]: candle,
  [candle2.id]: candle2,
});

game.go();
