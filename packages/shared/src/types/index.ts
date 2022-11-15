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

interface Ticker {
  // PROCRESS STATE METHODS
  update(): void;

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

export type { InputPayload, StatePayload, Ticker };
export { DEFAULT_STATE_PAYLOAD, DEFAUT_INPUT_PAYLOAD };