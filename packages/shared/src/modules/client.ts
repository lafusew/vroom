import { BaseTicker } from "./ticker.js";
import { StatePayload, InputPayload, Ticker, Input } from "../types/index.js";

import { DEFAULT_STATE_PAYLOAD } from "../types/index.js";
import { deepEqual, isDistanceDifferenceAcceptable, isSpeedDifferenceAcceptable } from "../utils/index.js";
import { nanoid } from "nanoid";
import { Vector3 } from "three";

const VEC1 = new Vector3();
const VEC2 = new Vector3();

class Client extends BaseTicker implements Ticker {
  private static _: Client;

  private playerId: string;
  private playersNames: { [playerId: string]: string } = {};

  private inputBuffer: InputPayload[] = [];

  private latestServerState: StatePayload = DEFAULT_STATE_PAYLOAD;
  private lastProcessedState: StatePayload = DEFAULT_STATE_PAYLOAD;

  private speedInput: number = 0
  private currentLane: number;

  private send: (payload: InputPayload) => void;

  private constructor(
    roomId: string,
    send: (payload: InputPayload) => void,
    startingLane: number
  ) {
    // TICKER INIT
    super(roomId);

    // ABSTRACT SEND METHOD (E.G. SOCKET.IO)
    this.send = send

    // ALLOWS RECONCIATION
    this.inputBuffer = new Array<InputPayload>(this.BUFFER_SIZE);

    this.playerId = nanoid(10);
    this.currentLane = startingLane;
  }

  update(dt: number, input: Input) {
    // RECUPERER LES INPUTS
    this.speedInput = input.speed
    this.currentLane = input.currentLane;

    this.tickUpdate(dt);
  }

  protected processTick(dt: number) {
    this.states = this.latestServerState.states;

    if (this.shouldReconcile()) {
      this.reconcile(dt);
    }

    const bufferIndex = this.currentTick % this.BUFFER_SIZE;

    const inputPayload: InputPayload = {
      tick: this.currentTick,
      playerId: this.playerId,
      input: {
        speed: this.speedInput,
        currentLane: this.currentLane,
      }
    }

    this.inputBuffer[bufferIndex] = inputPayload;

    this.stateBuffer[bufferIndex] = {
      tick: this.currentTick,
      states: {
        ...this.states, // A VERIFIER
        [this.playerId]: this.processState(
          inputPayload.input,
          this.states[this.playerId],
          dt
        )
      }
    };

    this.dispatch(inputPayload);
  }

  private shouldReconcile(): boolean {
    if (
      !deepEqual(this.latestServerState, DEFAULT_STATE_PAYLOAD) &&
      deepEqual(this.lastProcessedState, DEFAULT_STATE_PAYLOAD)
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

    console.log("SERVER STATE VECTOR", this.latestServerState.states[this.playerId].position);

    const isPositionCorrect = isDistanceDifferenceAcceptable(
      0.01,
      VEC1.fromArray(this.latestServerState.states[this.playerId].position),
      VEC2.fromArray(this.stateBuffer[serverStateBufferIndex].states[this.playerId].position)
    );

    const isSpeedCorrect = isSpeedDifferenceAcceptable(
      0.01,
      this.latestServerState.states[this.playerId].speed,
      this.stateBuffer[serverStateBufferIndex].states[this.playerId].speed
    );

    if (!isPositionCorrect || !isSpeedCorrect) {
      console.log('time to reconcile');

      this.states[this.playerId].position = this.latestServerState.states[this.playerId].position
      this.states[this.playerId].speed = this.latestServerState.states[this.playerId].speed

      this.stateBuffer[serverStateBufferIndex] = this.latestServerState;

      let tickToProcess = this.latestServerState.tick + 1;

      while (tickToProcess < this.currentTick) {
        // Process new state with reconciled state
        const state = this.processState(
          this.inputBuffer[tickToProcess].input,
          this.stateBuffer[tickToProcess].states[this.playerId],
          dt
        )

        // udate buffer with reprocessed state
        const bufferIndex = tickToProcess % this.BUFFER_SIZE;
        this.stateBuffer[bufferIndex] = {
          tick: tickToProcess,
          states: {
            ...this.stateBuffer[bufferIndex].states,
            [this.playerId]: state
          }
        };

        tickToProcess++;
      }
    }
  }

  private dispatch(payload: InputPayload) {
    this.send(payload);
  }

  public onServerState(state: StatePayload) {
    this.latestServerState = state;
  }

  public getLatestServerState(): StatePayload {
    return this.latestServerState;
  }

  public getPlayerId(): string {
    return this.playerId;
  }

  public static getInstance(id: string, send: (input: InputPayload) => void, startingLane: number): Client {
    if (!Client._) {
      Client._ = new Client(id, send, startingLane);
    }

    return Client._;
  }
}

export default Client;