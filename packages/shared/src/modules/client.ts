import { Ticker } from "./ticker.js";
import { StatesPayload, InputPayload, Game } from "../types/index.js";

import { deepEqual, isDistanceDifferenceAcceptable } from "../utils/index.js";

class Client extends Ticker implements Game {
  private static _: Client;

  private playerId: string;

  private inputBuffer: InputPayload[] = [];

  private latestServerState: StatesPayload;
  private lastProcessedState: StatesPayload;

  private DEFAULT_STATE_PAYLOAD: StatesPayload;

  private horizontalInput: number = 0
  private verticalInput: number = 0;

  private send: (payload: InputPayload) => void;

  private constructor(
    roomId: string,
    currentPlayerId: string,
    otherPlayersIds: string[],
    send: (payload: InputPayload) => void,
  ) {
    super(roomId, otherPlayersIds);

    this.inputBuffer = new Array<InputPayload>(this.BUFFER_SIZE);

    this.playerId = currentPlayerId;
    this.states[this.playerId] = {
      position: [0, 0],
    }

    this.latestServerState = { tick: 0, states: this.states };
    this.lastProcessedState = { tick: 0, states: this.states };
    this.DEFAULT_STATE_PAYLOAD = { tick: 0, states: this.states };

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
    if (
      !deepEqual(this.latestServerState, this.DEFAULT_STATE_PAYLOAD) &&
      deepEqual(this.lastProcessedState, this.DEFAULT_STATE_PAYLOAD)
    ) {
      return true;
    }

    if (!deepEqual(this.latestServerState, this.lastProcessedState)) {
      return true;
    }

    return false;
  }

  private reconcile(dt: number) {
    this.lastProcessedState = this.latestServerState;

    const serverStateBufferIndex = this.latestServerState.tick % this.BUFFER_SIZE;

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

  // IDEALLY THIS SHOULD NOT BE USED AND GAME MUST BE CREATED
  // WHEN LOBBY IS READY AND ALL PLAYERS ARE CONNECTED AND FIXED
  addPlayer(playerId: string) {
    this.states[playerId] = {
      position: [0, 0],
    }

    this.latestServerState = { tick: 0, states: this.states };
    this.lastProcessedState = { tick: 0, states: this.states };
    this.DEFAULT_STATE_PAYLOAD = { tick: 0, states: this.states };
  }


  public onServerState(state: StatesPayload) {
    this.latestServerState = state;
  }

  // For testing purposes
  public getLatestServerStates(): StatesPayload {
    return this.latestServerState;
  }

  public static getInstance(roomId: string, playerId: string, send: (input: InputPayload) => void): Client {
    if (!Client._) {
      Client._ = new Client(roomId, playerId, [], send);
    }

    return Client._;
  }
}

export default Client;