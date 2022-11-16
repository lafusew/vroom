import { Ticker } from "./ticker.js";
import { StatesPayload, InputPayload, Game, Players } from "../types/index.js";

import { deepEqual, isDistanceDifferenceAcceptable } from "../utils/index.js";

class Client extends Ticker implements Game {
  private static _: Client;

  private playerId: string;

  private inputBuffer: InputPayload[] = [];

  private latestServerState: StatesPayload;
  private lastProcessedState: StatesPayload;

  private readonly DEFAULT_STATE_PAYLOAD: StatesPayload;

  private horizontalInput: number = 0
  private verticalInput: number = 0;

  private send: (payload: InputPayload) => void;

  private constructor(
    roomId: string,
    currentPlayerId: string,
    allPlayers: { [playerId: string]: string },
    send: (payload: InputPayload) => void,
  ) {
    super(roomId, allPlayers);

    this.inputBuffer = new Array<InputPayload>(this.BUFFER_SIZE);

    this.playerId = currentPlayerId;

    this.latestServerState = { tick: 0, states: this.states };
    this.lastProcessedState = { tick: 0, states: this.states };
    this.DEFAULT_STATE_PAYLOAD = { tick: 0, states: this.states };

    console.log('CLIENT INITIALIZED',
      this.states,
      this.latestServerState,
      this.lastProcessedState,
      this.DEFAULT_STATE_PAYLOAD
    );

    this.send = send;
  }

  update() {
    this.onTick(
      (dt: number, serverTick: boolean) => {
        this.horizontalInput = Math.random() > 0.5 ? 1 : -1;
        this.verticalInput = Math.random() > 0.5 ? 1 : -1;

        if (this.shouldReconcile()) {
          this.reconcile(dt);
        }

        const bufferIndex = this.currentTick % this.BUFFER_SIZE;

        const inputPaylaod: InputPayload = {
          tick: this.currentTick,
          playerId: this.playerId,
          inputVector: [this.horizontalInput, this.verticalInput]
        }

        this.inputBuffer[bufferIndex] = inputPaylaod;

        this.stateBuffer[bufferIndex] = this.processState(inputPaylaod, dt);

        if (serverTick) this.send(inputPaylaod)
      },
    );
  }

  private shouldReconcile(): boolean {
    // if (
    //   !deepEqual(this.latestServerState, this.DEFAULT_STATE_PAYLOAD) &&
    //   deepEqual(this.lastProcessedState, this.DEFAULT_STATE_PAYLOAD)
    // ) {
    //   return true;
    // }

    if (!deepEqual(this.latestServerState, this.lastProcessedState)) {
      return true;
    }

    return false;
  }

  private reconcile(dt: number) {
    this.lastProcessedState = this.latestServerState;

    const serverStateBufferIndex = this.latestServerState.tick % this.BUFFER_SIZE;

    if (!this.stateBuffer[serverStateBufferIndex]) {
      return;
    }

    const isPositionCorrect = isDistanceDifferenceAcceptable(
      100,
      this.latestServerState.states[this.playerId].position,
      this.stateBuffer[serverStateBufferIndex].states[this.playerId].position
    );

    if (!isPositionCorrect) {
      console.log('time to reconcile');

      this.states[this.playerId].position = this.latestServerState.states[this.playerId].position;

      this.stateBuffer[serverStateBufferIndex] = this.latestServerState;

      let tickToProcess = this.latestServerState.tick + 1;

      while (tickToProcess < this.currentTick) {
        // Process new state with reconciled state
        const state = this.processState(this.inputBuffer[tickToProcess], dt)

        // udate buffer with reprocessed state
        const bufferIndex = tickToProcess % this.BUFFER_SIZE;
        this.stateBuffer[bufferIndex] = state;

        tickToProcess++;
      }
    }
  }

  public onServerState(state: StatesPayload) {
    this.latestServerState = state;
  }

  // For testing purposes
  public getLatestServerStates(): StatesPayload {
    return this.latestServerState;
  }

  public static getInstance(roomId: string, playerId: string, allPlayers: Players, send: (input: InputPayload) => void): Client {
    if (!Client._) {
      Client._ = new Client(roomId, playerId, allPlayers, send);
    }

    return Client._;
  }
}

export default Client;