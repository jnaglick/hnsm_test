/* eslint-disable @typescript-eslint/no-unused-vars */
interface Coordinate {
  x: number;
  y: number;
}

function serializeCoordinate(coord: Coordinate) {
  return `${coord.x.toString()}:${coord.y.toString()}`;
}

// coords need serialize/deserialize
class CoordinatedItems<T> {
  private items: Record<string, T> = {};

  get(coord: Coordinate): T {
    const key = serializeCoordinate(coord);

    return this.items[key];
  }

  set(coord: Coordinate, tile: T): T {
    const key = serializeCoordinate(coord);

    this.items[key] = tile;

    return this.items[key];
  }

  safeSet(coord: Coordinate, tile: T): T | undefined {
    const existing = this.get(coord);

    if (existing) {
      return undefined;
    }

    return this.set(coord, tile);
  }
}
