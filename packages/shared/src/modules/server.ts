
import { Track } from "../main.js";
import { Game, InputPayload, Players, ServerPayload, SERVER_EVENTS } from "../types/index.js";
import { Ticker } from "./ticker.js";

class Server extends Ticker implements Game {
	private inputQueue: InputPayload[] = [];

	private leaderboard: string[];
	private finishNameOrder: string[] = [];

	private send: (id: string, eventName: SERVER_EVENTS, payload: ServerPayload) => void;

	constructor(
		id: string,
		players: Players,
		send: (id: string, eventName: SERVER_EVENTS, payload: ServerPayload) => void,
		track: Track
	) {
		super(id, players, track);
		this.send = send;
		this.leaderboard = this.getRanking();
	}

	update() {
		if (!this.isGameRunning) return;
		this.onTick(
			(dt: number) => {
				let bufferIndex = -1;

				while (this.inputQueue.length > 0) {
					const inputPayload = this.inputQueue.shift() as InputPayload;

					// Skip tick for finished clients.
					if (this.finishNameOrder.includes(inputPayload.playerId)) continue;

					bufferIndex = inputPayload.tick % this.BUFFER_SIZE;

					let statePayload = this.processState(
						inputPayload,
						dt,
						// CENTRIFUGAL EJECTION CALLBACK
						(direction) => this.send(this.roomId, SERVER_EVENTS.EJECTION, { playerId: inputPayload.playerId, direction }),
						// COLLISION EJECTIONS CALLBACK
						(ids: string[]) => ids.forEach((id) => { this.send(this.roomId, SERVER_EVENTS.EJECTION, { playerId: id, direction: 0 }) })

					);
					this.stateBuffer[bufferIndex] = statePayload;

					if (this.stateBuffer[bufferIndex].states[inputPayload.playerId].progress >= 3) {
						this.send(this.roomId, SERVER_EVENTS.GAME_STOP, [inputPayload.playerId], this.players[inputPayload.playerId]);
						this.finishNameOrder.push(inputPayload.playerId);
					}
				}

				if (bufferIndex !== -1) {
					this.send(this.roomId, SERVER_EVENTS.TICK, this.stateBuffer[bufferIndex]);
				}

				if (this.leaderboard.toString() !== this.getRanking().toString()) {
					this.leaderboard = this.getRanking();
					this.send(this.roomId, SERVER_EVENTS.UPDATE_LEADERBOARD, this.leaderboard.map((playerId) => this.players[playerId]));
				}
			}
		);
	}

	public onClientInput(input: InputPayload) {
		// console.log("RECEIVED INPUT: ", input);
		this.inputQueue.push(input);
	}
}

export default Server;