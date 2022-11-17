import { CLIENT_EVENTS, Game, InputPayload, Players, StatesPayload } from "../types/index.js";
import { Ticker } from "./ticker.js";

import { Track } from "../main.js";
import { deepEqual, isProgressDifferenceAcceptable } from "../utils/index.js";

class Client extends Ticker implements Game {
    private static _: Client;

    private playerId: string;

    private inputBuffer: InputPayload[] = [];

    private latestServerState: StatesPayload;
    private lastProcessedState: StatesPayload;

    private readonly DEFAULT_STATE_PAYLOAD: StatesPayload;

    private send: (eventName: CLIENT_EVENTS, payload: InputPayload) => void;

    private constructor(roomId: string, currentPlayerId: string, allPlayers: { [playerId: string]: string }, send: (eventName: CLIENT_EVENTS, payload: InputPayload) => void, track: Track) {
        super(roomId, allPlayers, track);

        this.inputBuffer = new Array<InputPayload>(this.BUFFER_SIZE);

        this.playerId = currentPlayerId;

        this.latestServerState = { tick: 0, states: this.states };
        this.lastProcessedState = { tick: 0, states: this.states };
        this.DEFAULT_STATE_PAYLOAD = { tick: 0, states: this.states };

        console.log("CLIENT INITIALIZED", this.states, this.latestServerState, this.lastProcessedState, this.DEFAULT_STATE_PAYLOAD);

        this.send = send;
    }

    update(inputSpeed: number) {
        this.onTick((dt: number, serverTick: boolean) => {
            // if (this.shouldReconcile()) {
            //     this.reconcile(dt);
            // }

            const bufferIndex = this.currentTick % this.BUFFER_SIZE;

            const inputPayload: InputPayload = {
                tick: this.currentTick,
                playerId: this.playerId,
                inputSpeed,
            };

            this.inputBuffer[bufferIndex] = inputPayload;

            this.stateBuffer[bufferIndex] = this.processState(inputPayload, dt);

            if (serverTick) this.send(CLIENT_EVENTS.PLAYER_TICK, inputPayload);
        });
    }

    private shouldReconcile(): boolean {
        // if (
        //   !deepEqual(this.latestServerState, this.DEFAULT_STATE_PAYLOAD) &&
        //   deepEqual(this.lastProcessedState, this.DEFAULT_STATE_PAYLOAD)
        // ) {
        //   return true;
        // }

        if (!deepEqual(this.latestServerState.states[this.playerId], this.lastProcessedState.states[this.playerId])) {
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

        // console.log("latestServerState", this.latestServerState);
        // console.log("stateBuffer", this.stateBuffer);

        // const isPositionCorrect = isDistanceDifferenceAcceptable(
        //     // TODO: Define a coef
        //     1 * Math.max(this.stateBuffer[serverStateBufferIndex].states[this.playerId].speed, 1),
        //     this.latestServerState.states[this.playerId].position,
        //     this.stateBuffer[serverStateBufferIndex].states[this.playerId].position
        // );

        const isProgressCorrect = isProgressDifferenceAcceptable(
            1 * Math.max(this.stateBuffer[serverStateBufferIndex].states[this.playerId].speed, 0.01),
            this.latestServerState.states[this.playerId].progress,
            this.stateBuffer[serverStateBufferIndex].states[this.playerId].progress
        );

        if (!isProgressCorrect) {
            console.log("Time to reconcile");

            this.states[this.playerId].progress = this.latestServerState.states[this.playerId].progress;
            this.states[this.playerId].speed = this.latestServerState.states[this.playerId].speed;

            this.stateBuffer[serverStateBufferIndex] = this.latestServerState;

            let tickToProcess = this.latestServerState.tick + 1;
            console.log("latestServerState.tick", this.latestServerState.tick);

            while (tickToProcess < this.currentTick) {
                // Process new state with reconciled state
                console.log("WHILE LOOOOOOP");

                const bufferIndex = tickToProcess % this.BUFFER_SIZE;
                const state = this.processState(this.inputBuffer[bufferIndex], dt);

                // udate buffer with reprocessed state
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

    public static getInstance(roomId: string, playerId: string, allPlayers: Players, send: (eventName: CLIENT_EVENTS, input: InputPayload) => void, track: Track): Client {
        if (!Client._) {
            Client._ = new Client(roomId, playerId, allPlayers, send, track);
        }

        return Client._;
    }
}

export default Client;
