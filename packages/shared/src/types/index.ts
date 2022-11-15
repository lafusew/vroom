interface InputPayload {
  tick: number;
  inputVector: [number, number];
}

interface StatePayload {
  tick: number;
  position: [number, number];
  // speed: number;
  // currentLane: number;
}

interface Game {
  // PROCRESS STATE METHODS
  update(...args: any): void;

  // GETTERS TO ACCESS STATE
  getPosition(): [number, number];
}

const DEFAUT_INPUT_PAYLOAD: InputPayload = {
  tick: 0,
  inputVector: [0, 0]
}

const DEFAULT_STATE_PAYLOAD: StatePayload = {
  tick: 0,
  position: [0, 0]
}

export type { InputPayload, StatePayload, Game };
export { DEFAULT_STATE_PAYLOAD, DEFAUT_INPUT_PAYLOAD };