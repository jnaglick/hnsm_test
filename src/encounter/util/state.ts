type StateMachineConstructorParams = {
  initial: string;
  links: Record<string, Record<string, string>>
}

export class StateMachine {
  public state: string;
  private links: Record<string, Record<string, string>>

  constructor({ initial, links }: StateMachineConstructorParams) {
    this.state = initial;
    this.links = links;
  }

  public trigger(trigger: string): string {
    const next = this.links[this.state][trigger]

    if (next) {
      this.state = next;
    }

    return this.state;
  }
}
