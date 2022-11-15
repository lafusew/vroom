import { Vector3 } from "three";
import { StatePayload, InputPayload, Input, State } from "../types/index.js";

class BaseTicker {
  protected roomId: string;

  protected timer: number;
  protected currentTick = 0;
  protected minTimeBetweenTicks: number;

  // protected lastUpdate = 0;

  protected readonly SERVER_TICK_RATE = 60;
  protected readonly BUFFER_SIZE = 1024;

  protected stateBuffer: StatePayload[] = [];

  protected states: { [playerId: string]: State } = {};

  constructor(roomId: string) {
    this.roomId = roomId;
    this.stateBuffer = new Array<StatePayload>(this.BUFFER_SIZE);

    this.minTimeBetweenTicks = 1 / this.SERVER_TICK_RATE;
    this.timer = 0;

    // this.lastUpdate = Date.now();
  }

  protected tickUpdate(dt: number) {
    // NE PAS TOUCHER -> A REVOIR

    // const now = Date.now();
    // const delta = (now - this.lastUpdate) / 1000;
    // this.lastUpdate = now;

    this.timer += dt;
    if (this.timer >= this.minTimeBetweenTicks) {
      this.timer -= this.minTimeBetweenTicks;
      this.processTick(dt);

      this.currentTick++;
    }
  }

  protected processTick(_dt: number) {
    throw 'Need to be implemented by either client or server';
  }

  public getStates() {
    return this.states;
  }

  public getRoomId() {
    return this.roomId;
  }

  protected processState(input: Input, state: State, dt: number): State {
    // A IMPLEMENTER AVEC LOGIC DE VROOM

    return {
      position: [(state?.position[0] || 0) + input.speed * dt, 0, 0],
      speed: 0.8,
    }
  }
}

export { BaseTicker };