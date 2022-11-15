import { StatePayload, InputPayload } from "../types/index.js";

class Ticker {
  protected roomId: string;

  protected timer: number;
  protected currentTick = 0;
  protected minTimeBetweenTicks: number;

  protected lastUpdate = 0;

  protected readonly SERVER_TICK_RATE = 2;
  protected readonly BUFFER_SIZE = 1024;

  protected stateBuffer: StatePayload[] = [];

  protected position: [number, number] = [0, 0];

  constructor(roomId: string) {
    this.roomId = roomId;
    this.stateBuffer = new Array<StatePayload>(this.BUFFER_SIZE);

    this.minTimeBetweenTicks = 1 / this.SERVER_TICK_RATE;
    this.timer = 0;

    this.lastUpdate = Date.now();
  }

  protected onTick(processTick: (dt: number, serverTick: boolean) => void, ...args: any) {
    const now = Date.now();
    const delta = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;

    this.timer += delta;

    if (this.timer >= this.minTimeBetweenTicks) {
      this.timer -= this.minTimeBetweenTicks;
      processTick(this.minTimeBetweenTicks, true);

      this.currentTick++;

      return;
    }

    // NEED TO STORE IN BETWEEN TICKS INPUTS ARRAYS AND SEND THEM TO SERVER ON TICK
    // OTW CLIENT WILL DESYNC TOO EASILY
    // processTick(delta, false);
  }

  public getPosition() {
    return this.position;
  }

  public getRoomId() {
    return this.roomId;
  }

  protected processState(input: InputPayload, dt: number): StatePayload {
    const [x, y] = this.position;
    const [horizontalInput, verticalInput] = input.inputVector;

    const newPosition: [number, number] = [
      x + horizontalInput * 30 * dt, // * this.minTimeBetweenTicks,
      y + verticalInput * 30 * dt    // * this.minTimeBetweenTicks
    ];

    this.position = newPosition;

    return {
      tick: input.tick,
      position: newPosition
    }
  }
}

export { Ticker };