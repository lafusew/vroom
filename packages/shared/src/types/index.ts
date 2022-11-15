import { Vector3 } from 'three';

interface InputPayload {
  tick: number;
  playerId: string;
  input: Input;
}

interface Input {
  speed: number;
  currentLane: number;
}

interface StatePayload {
  tick: number;
  states: { [playerId: string]: State };
}

interface State {
  position: [number, number, number];
  speed: number;
}

interface Ticker {
  // PROCRESS STATE METHODS
  update(dt: number, input?: Input): void;

  // GETTERS TO ACCESS STATE
  getStates(): { [playerId: string]: State };
}

const DEFAUT_INPUT_PAYLOAD: InputPayload = {
  tick: 0,
  playerId: '0',
  input: {
    speed: 0,
    currentLane: 0,
  }
}

const DEFAULT_STATE_PAYLOAD: StatePayload = {
  tick: 0,
  states: {
    '0': { position: [0, 0, 0], speed: 0 },
    '1': { position: [0, 0, 0], speed: 0 },
    '2': { position: [0, 0, 0], speed: 0 },
    '3': { position: [0, 0, 0], speed: 0 },
  }
}

export type { InputPayload, StatePayload, Ticker, Input, State };
export { DEFAULT_STATE_PAYLOAD, DEFAUT_INPUT_PAYLOAD };