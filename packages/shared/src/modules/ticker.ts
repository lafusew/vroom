import { Rocket } from "../entities/Rocket.js";
import { Track } from "../main.js";
import { ChangeLanePayload, InputPayload, Players, State, StatesPayload } from "../types/index.js";

class Ticker {
    protected roomId: string;

    protected timer: number;
    protected currentTick = 0;
    protected minTimeBetweenTicks: number;

    protected lastUpdate = 0;

    protected readonly SERVER_TICK_RATE = 40;
    protected readonly BUFFER_SIZE = 1024;

    protected stateBuffer: StatesPayload[] = [];

    protected states: { [playerId: string]: State } = {};
    protected players: Players;
    protected rockets: { [playerId: string]: Rocket } = {};
    protected track: Track;

    protected isGameRunning: boolean = false;

    constructor(roomId: string, players: Players, track: Track) {
        this.roomId = roomId;
        this.stateBuffer = new Array<StatesPayload>(this.BUFFER_SIZE);

        this.minTimeBetweenTicks = 1 / this.SERVER_TICK_RATE;
        this.timer = 0;

        this.lastUpdate = Date.now();

        this.players = players;
        this.track = track;

        Object.keys(this.players).forEach((id, i) => {
            this.rockets[id] = new Rocket(i, track.paths);

            this.states[id] = {
                // position: this.rockets[id].position.toArray(),
                progress: this.rockets[id].progress,
                speed: this.rockets[id].speed,
            };
        });
    }

    protected onTick(processTick: (dt: number, serverTick: boolean) => void, ...args: any) {
        const now = Date.now();
        const delta = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        this.timer += delta;

        if (this.timer >= this.minTimeBetweenTicks) {
            this.timer -= this.minTimeBetweenTicks;
            processTick(this.minTimeBetweenTicks, true);

            this.currentTick++;

            return;
        }

        // NEED TO STORE IN BETWEEN TICKS INPUTS ARRAYS AND SEND THEM TO SERVER ON TICK
        // OTW CLIENT WILL DESYNC TOO EASILY
        // processTick(delta, false);
    }

    protected getRanking() {
        return Object.entries(this.rockets)
            .sort((a, b) => b[1].relativeProgress - a[1].relativeProgress)
            .map(([id]) => id);
    }

    public getIsGameRunning() {
        return this.isGameRunning;
    }

    public setIsGameRunning(isGameRunning: boolean) {
        this.isGameRunning = isGameRunning;
    }

    public getStates() {
        return this.states;
    }

    public getRoomId() {
        return this.roomId;
    }

    public getPlayers() {
        return this.players;
    }

    public getRockets() {
        return this.rockets;
    }

    public getTrack() {
        return this.track;
    }

    protected processState(input: InputPayload, dt: number, ejectionCallback?: (id?: string) => void): StatesPayload {
        if (this.rockets[input.playerId].isEjecting) input.inputSpeed = 0;

        // console.log(this.rockets[input.playerId].speed);

        this.rockets[input.playerId].tick(input.inputSpeed, this.rockets, dt, ejectionCallback);

        // const [x, y] = this.states[input.playerId].position;

        // const newPosition: [number, number] = [
        //     x + horizontalInput * 30 * dt, // * this.minTimeBetweenTicks,
        //     y + verticalInput * 30 * dt, // * this.minTimeBetweenTicks
        // ];
        // const newPosition = this.rockets[input.playerId].position.toArray();
        const newProgress = this.rockets[input.playerId].progress;

        this.states[input.playerId].progress = newProgress;

        return {
            tick: input.tick,
            states: {
                ...this.states,
                [input.playerId]: { progress: newProgress, speed: this.rockets[input.playerId].speed },
            },
        };
    }

    public changeLane(payload: ChangeLanePayload) {
        this.rockets[payload.playerId].changeLane(payload.direction, this.rockets);
    }
}
export { Ticker };
