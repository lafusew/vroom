import Client from "./client.js";

import { Ticker } from "./ticker.js";
import { StatePayload, InputPayload, Game } from "../types/index.js";

class Server extends Ticker implements Game {
  private inputQueue: InputPayload[] = [];

  private send: (id: string, payload: StatePayload) => void;

  constructor(id: string, send: (id: string, payload: StatePayload) => void) {
    super(id);
    this.send = send
  }

  update() {
    this.onTick(
      (dt: number) => {
        let bufferIndex = -1;

        while (this.inputQueue.length > 0) {
          const inputPaylaod = this.inputQueue.shift() as InputPayload;
          bufferIndex = inputPaylaod.tick % this.BUFFER_SIZE;

          let statePayload = this.processState(inputPaylaod, dt);
          this.stateBuffer[bufferIndex] = statePayload;
        }

        if (bufferIndex !== -1) {
          console.log("SENDING STATE: ", this.stateBuffer[bufferIndex]);
          this.send(this.roomId, this.stateBuffer[bufferIndex]);
        }
      },
    );
  }

  public async onClientInput(input: InputPayload) {
    console.log("RECEIVED INPUT: ", input);
    this.inputQueue.push(input);
  }
}

export default Server;