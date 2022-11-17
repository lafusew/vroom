
import { Track } from "../main.js";
import { Game, InputPayload, Players, StatesPayload } from "../types/index.js";
import { Ticker } from "./ticker.js";

class Server extends Ticker implements Game {
  private inputQueue: InputPayload[] = [];

  private send: (id: string, payload: StatesPayload) => void;

  constructor(
    id: string,
    players: Players,
    send: (id: string, payload: StatesPayload) => void,
    track: Track
  ) {
    super(id, players, track);
    this.send = send;
  }

  update() {
    this.onTick(
      (dt: number) => {
        console.log('SERVER TICK');
        let bufferIndex = -1;

        while (this.inputQueue.length > 0) {
          const inputPayload = this.inputQueue.shift() as InputPayload;
          bufferIndex = inputPayload.tick % this.BUFFER_SIZE;

          let statePayload = this.processState(inputPayload, dt);
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