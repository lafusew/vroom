interface InputPayload {
  tick: number;
  inputVector: [number, number];
  playerId: string;
}

interface StatesPayload {
  tick: number;
  states: { [playerId: string]: State };
  // speed: number;
  // currentLane: number;
}

interface State {
  position: [number, number];
}

interface Game {
  // PROCRESS STATE METHODS
  update(...args: any): void;

  // GETTERS TO ACCESS STATE
  getStates(): { [playerId: string]: State };
}

export type { InputPayload, State, StatesPayload, Game };