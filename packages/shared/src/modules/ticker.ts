import { StatePayload, InputPayload } from "../types/index.js";

class BaseTicker {
  protected timer: number;
  protected currentTick = 0;
  protected minTimeBetweenTicks: number;

  protected lastUpdate = 0;

  protected readonly SERVER_TICK_RATE = 2;
  protected readonly BUFFER_SIZE = 1024;

  protected stateBuffer: StatePayload[] = [];

  protected position: [number, number] = [0, 0];

  constructor() {
    this.stateBuffer = new Array<StatePayload>(this.BUFFER_SIZE);

    this.minTimeBetweenTicks = 1 / this.SERVER_TICK_RATE;
    this.timer = 0;

    this.lastUpdate = Date.now();
  }

  protected tickUpdate(processTick: () => void) {
    const now = Date.now();
    const delta = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;

    this.timer += delta;
    if (this.timer >= this.minTimeBetweenTicks) {
      this.timer -= this.minTimeBetweenTicks;
      processTick();

      console.log(this.position);
      this.currentTick++;
    }
  }

  getPosition() {
    return this.position;
  }

  protected processState(input: InputPayload): StatePayload {
    const [x, y] = this.position;
    const [horizontalInput, verticalInput] = input.inputVector;

    const newPosition: [number, number] = [
      x + horizontalInput * 5 * this.minTimeBetweenTicks,
      y + verticalInput * 5 * this.minTimeBetweenTicks
    ];

    this.position = newPosition;

    return {
      tick: input.tick,
      position: newPosition
    }
  }
}

export { BaseTicker };