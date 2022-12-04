interface Time {
  at: number;
}

interface TimedItem<I> {
  time: Time;
  item: I;
}

export class PriorityQueue<I = any> {
  protected items: Array<TimedItem<I>> = [];

  insert(time: Time, item: I): I {
    this.items = [
      ...this.items,
      { time, item },
    ]

    return item; 
  }

  insertNext(item: I): I {
    this.items = [
      { time: { at: 0 }, item },
      ...this.items,
    ]

    return item; 
  }

  next(): TimedItem<I> | undefined {
    if (this.items.length === 0) {
      return undefined;
    }

    if (this.items.length === 1) {
      const item = this.items[0];
      this.items = [];
      return item;
    }

    let indexOfLowest = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].time.at < this.items[indexOfLowest].time.at) {
        indexOfLowest = i;
      }
    }

    const item = this.items[indexOfLowest];

    this.items = [
      ...this.items.slice(0, indexOfLowest),
      ...this.items.slice(indexOfLowest+1)
    ]

    return item;
  }

  // returns item with lowest time but doesnt change anything
  peekNext(): TimedItem<I> | undefined {
    if (this.items.length === 0) {
      return undefined;
    }

    if (this.items.length === 1) {
      return this.items[0];
    }

    const item = this.items.reduce((lowestSoFar, current) => {
      return current.time.at < lowestSoFar.time.at ? current : lowestSoFar;
    }, this.items[0]);

    return item;
  }
}

export class Timer<I = any> extends PriorityQueue<I> {
  public currentTime: Time = { at: 0 };

  insert(time: Time, item: I): I {
    return super.insert({ at: this.currentTime.at + time.at }, item);
  }

  next(): TimedItem<I> | undefined {
    const _next = super.next();

    if (!_next) {
      return _next;
    }

    // if items.length === 0 && this.options.resetTimerToZeroOnEmpty { this.currentTime = 0 }

    this.currentTime = {
      at:  _next.time.at
    };

    return _next;
  }
}