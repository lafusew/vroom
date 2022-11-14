import Client from "./client.js";

import { BaseTicker } from "./ticker.js";
import { StatePayload, InputPayload, Ticker } from "../types/index.js";

class Server extends BaseTicker implements Ticker {
  private inputQueue: InputPayload[] = [];

  constructor(id: string) {
    super(id);
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
      this.send(this.stateBuffer[bufferIndex]);
    }
  }

  private async fakeAsync(): Promise<unknown> {
    return new Promise((resolve) => setTimeout(() => resolve({}), 200));
  }

  async send(payload: StatePayload) {
    await this.fakeAsync();

    Client.getInstance(this.id).onServerState(payload);
  }

  public async onClientInput(input: InputPayload) {
    this.inputQueue.push(input);
  }
}

export default Server;