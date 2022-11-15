import { BaseTicker } from "./ticker.js";
import { StatePayload, InputPayload, Ticker } from "../types/index.js";

class Server extends BaseTicker implements Ticker {
  private inputQueue: InputPayload[] = [];

  private send: (id: string, payload: StatePayload) => void;

  constructor(
    id: string,
    send: (id: string, payload: StatePayload) => void
  ) {
    super(id);
    this.send = send
  }

  update(dt: number) {
    this.tickUpdate(dt);
  }

  processTick(dt: number) {
    let bufferIndex = -1;

    while (this.inputQueue.length > 0) {
      const inputPayload = this.inputQueue.shift() as InputPayload;
      bufferIndex = inputPayload.tick % this.BUFFER_SIZE;

      let statePayload = this.processState(
        inputPayload.input,
        this.states[inputPayload.playerId],
        dt
      );
      this.stateBuffer[bufferIndex] = {
        tick: inputPayload.tick,
        states: {
          ...this.stateBuffer[bufferIndex]?.states || {},
          [inputPayload.playerId]: statePayload,
        },
      };
    }

    if (bufferIndex !== -1) {
      this.dispatch(this.stateBuffer[bufferIndex]);
    }
  }

  async dispatch(payload: StatePayload) {
    console.log("SENDING STATE: ", payload);
    this.send(this.roomId, payload);
  }

  public async onClientInput(input: InputPayload) {
    console.log("RECEIVED INPUT: ", input);
    this.inputQueue.push(input);
  }
}

export default Server;