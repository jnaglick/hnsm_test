interface Coordinate {
  x: number;
  y: number;
}

interface MightHaveEqualsFunction<T> { // TODO why?
  equals?(other: T): boolean
}

function serializeCoordinate(coord: Coordinate) {
  return `${coord.x.toString()}:${coord.y.toString()}`;
}

function deserializeCoordinate(serializedCoord: string) {
  const [x, y] = serializedCoord.split(":");
  return {
    x: Number.parseInt(x),
    y: Number.parseInt(y),
  };
}

// coords need serialize/deserialize
class CoordinatedItems<T extends MightHaveEqualsFunction<T>> {
  private items: Record<string, T> = {};

  get(coord: Coordinate): T { // "at"
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

  find(matching: T): Coordinate[] {
    return Object.entries(this.items).filter(([_key, tile]) => this.equals(tile, matching)).map(([key]) => deserializeCoordinate(key));
  }

  private equals(a: T, b: T) {
    if ("equals" in a) {
      return (a as { equals(other: T): boolean }).equals(b);
    }
    return a === b;
  }
}
