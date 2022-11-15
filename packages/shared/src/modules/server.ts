import Client from "./client.js";

import { BaseTicker } from "./ticker.js";
import { StatePayload, InputPayload, Ticker } from "../types/index.js";

class Server extends BaseTicker implements Ticker {
  private inputQueue: InputPayload[] = [];

  private send: (id: string, payload: StatePayload) => void;

  constructor(id: string, send: (id: string, payload: StatePayload) => void) {
    super(id);
    this.send = send
  }

  update() {
    this.tickUpdate();
  }

  processTick() {
    let bufferIndex = -1;

    while (this.inputQueue.length > 0) {
      const inputPaylaod = this.inputQueue.shift() as InputPayload;
      bufferIndex = inputPaylaod.tick % this.BUFFER_SIZE;

      let statePayload = this.processState(inputPaylaod);
      this.stateBuffer[bufferIndex] = statePayload;
    }

    if (bufferIndex !== -1) {
      this.dispatch(this.stateBuffer[bufferIndex]);
    }
  }

  private async fakeAsync(): Promise<unknown> {
    return new Promise((resolve) => setTimeout(() => resolve({}), 200));
  }

  async dispatch(payload: StatePayload) {
    console.log("SENDING STATE: ", payload);
    this.send(this.id, payload);
  }

  public async onClientInput(input: InputPayload) {
    console.log("RECEIVED INPUT: ", input);
    this.inputQueue.push(input);
  }
}

export default Server;