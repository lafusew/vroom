import Client from "./client.js";

import { Ticker } from "./ticker.js";
import { StatesPayload, InputPayload, Game } from "../types/index.js";

class Server extends Ticker implements Game {
  private inputQueue: InputPayload[] = [];

  private send: (id: string, payload: StatesPayload) => void;

  constructor(
    id: string,
    playersIds: string[],
    send: (id: string, payload: StatesPayload) => void
  ) {
    super(id, playersIds);
    this.send = send;
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

  // IDEALLY THIS SHOULD NOT BE USED AND GAME MUST BE CREATED
  // WHEN LOBBY IS READY AND ALL PLAYERS ARE CONNECTED AND FIXED
  addPlayer(playerId: string) {
    this.states[playerId] = {
      position: [0, 0],
    }
  }

  public async onClientInput(input: InputPayload) {
    console.log("RECEIVED INPUT: ", input);
    this.inputQueue.push(input);
  }
}

export default Server;