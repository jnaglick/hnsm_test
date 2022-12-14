import { bot1 } from "./encounter/actors/dumb";
import { candleFactory } from "./encounter/actors/candle";
import { Encounter } from "./encounter";

const candle = candleFactory("red");
const candle2 = candleFactory("yellow");

const game = new Encounter({
  [bot1.id]: bot1,
  [candle.id]: candle,
  [candle2.id]: candle2,
});

game.go();
