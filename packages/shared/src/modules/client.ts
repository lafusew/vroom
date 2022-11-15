import { InputPayload, StatePayload, Ticker } from "../types/index.js";
import { BaseTicker } from "./ticker.js";

import { DEFAULT_STATE_PAYLOAD } from "../types/index.js";
import { deepEqual, isDistanceDifferenceAcceptable } from "../utils/index.js";

class Client extends BaseTicker implements Ticker {
    private static _: Client;

    private inputBuffer: InputPayload[] = [];

    private latestServerState: StatePayload = DEFAULT_STATE_PAYLOAD;
    private lastProcessedState: StatePayload = DEFAULT_STATE_PAYLOAD;

    private horizontalInput: number = 0;
    private verticalInput: number = 0;

    private send: (payload: InputPayload) => void;

    private constructor(id: string, send: (payload: InputPayload) => void) {
        super(id);
        this.send = send;
        this.inputBuffer = new Array<InputPayload>(this.BUFFER_SIZE);
    }

    update() {
        this.horizontalInput = Math.random() > 0.5 ? 1 : -1;
        this.verticalInput = Math.random() > 0.5 ? 1 : -1;

        this.tickUpdate();
    }

    protected processTick() {
        if (this.shouldReconcile()) {
            this.reconcile();
        }

        const bufferIndex = this.currentTick % this.BUFFER_SIZE;

        const inputPaylaod: InputPayload = {
            tick: this.currentTick,
            inputVector: [this.horizontalInput, this.verticalInput],
        };

        this.inputBuffer[bufferIndex] = inputPaylaod;

        this.stateBuffer[bufferIndex] = this.processState(inputPaylaod);

        this.dispatch(inputPaylaod);
    }

    private shouldReconcile(): boolean {
        if (!deepEqual(this.latestServerState, DEFAULT_STATE_PAYLOAD) && deepEqual(this.lastProcessedState, DEFAULT_STATE_PAYLOAD)) {
            return true;
        }

        if (!deepEqual(this.latestServerState, this.lastProcessedState)) {
            return true;
        }

        return false;
    }

    private reconcile() {
        this.lastProcessedState = this.latestServerState;

        const serverStateBufferIndex = this.latestServerState.tick % this.BUFFER_SIZE;

        const isPositionCorrect = isDistanceDifferenceAcceptable(0.001, this.latestServerState.position, this.stateBuffer[serverStateBufferIndex].position);

        if (!isPositionCorrect) {
            console.log("time to reconcile");

            this.position = this.latestServerState.position;

            this.stateBuffer[serverStateBufferIndex] = this.latestServerState;

            let tickToProcess = this.latestServerState.tick + 1;

            while (tickToProcess < this.currentTick) {
                // Process new state with reconciled state
                const state = this.processState(this.inputBuffer[tickToProcess]);

                // udate buffer with reprocessed state
                const bufferIndex = tickToProcess % this.BUFFER_SIZE;
                this.stateBuffer[bufferIndex] = state;

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

    public static getInstance(id: string, send: (input: InputPayload) => void): Client {
        if (!Client._) {
            Client._ = new Client(id, send);
        }

        return Client._;
    }
}

export default Client;
