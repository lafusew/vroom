
import { Track } from "../main.js";
import { Game, InputPayload, LeaderboardPayload, Players, SERVER_EVENTS, StatesPayload } from "../types/index.js";
import { Ticker } from "./ticker.js";

class Server extends Ticker implements Game {
  private inputQueue: InputPayload[] = [];
  private leaderboard: string[];

  private send: (id: string, eventName: SERVER_EVENTS, payload: StatesPayload | LeaderboardPayload) => void;

  constructor(
    id: string,
    players: Players,
    send: (id: string, eventName: SERVER_EVENTS, payload: StatesPayload | LeaderboardPayload) => void,
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
          bufferIndex = inputPayload.tick % this.BUFFER_SIZE;

          let statePayload = this.processState(inputPayload, dt);
          this.stateBuffer[bufferIndex] = statePayload;
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

  public async onClientInput(input: InputPayload) {
    // console.log("RECEIVED INPUT: ", input);
    this.inputQueue.push(input);
  }
}

export default Server;