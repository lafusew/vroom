import { InputPayload, StatePayload } from "../types/index.js";

class BaseTicker {
    protected id: string;

    protected timer: number;
    protected currentTick = 0;
    protected minTimeBetweenTicks: number;

    protected lastUpdate = 0;

    protected readonly SERVER_TICK_RATE = 60;
    protected readonly BUFFER_SIZE = 1024;

    protected stateBuffer: StatePayload[] = [];

    protected position: [number, number] = [0, 0];

    constructor(id: string) {
        this.id = id;
        this.stateBuffer = new Array<StatePayload>(this.BUFFER_SIZE);

        this.minTimeBetweenTicks = 1 / this.SERVER_TICK_RATE;
        this.timer = 0;

        this.lastUpdate = Date.now();
    }

    protected tickUpdate() {
        const now = Date.now();
        const delta = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        this.timer += delta;
        if (this.timer >= this.minTimeBetweenTicks) {
            this.timer -= this.minTimeBetweenTicks;
            this.processTick();

            this.currentTick++;
        }
    }

    protected processTick() {
        throw "Not implemented";
    }

    public getPosition() {
        return this.position;
    }

    public getId() {
        return this.id;
    }

    protected processState(input: InputPayload): StatePayload {
        const [x, y] = this.position;
        const [horizontalInput, verticalInput] = input.inputVector;

        const newPosition: [number, number] = [x + horizontalInput * 5 * this.minTimeBetweenTicks, y + verticalInput * 5 * this.minTimeBetweenTicks];

        this.position = newPosition;

        return {
            tick: input.tick,
            position: newPosition,
        };
    }
}

export { BaseTicker };
