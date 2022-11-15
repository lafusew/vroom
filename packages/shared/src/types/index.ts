import { Vector3 } from "three";

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

interface Spline {
  name: string;
  points: Vector3[];
  normals: Vector3[];
  default?: boolean;
}

const DEFAUT_INPUT_PAYLOAD: InputPayload = {
  tick: 0,
  inputVector: [0, 0]
}

const DEFAULT_STATE_PAYLOAD: StatePayload = {
  tick: 0,
  position: [0, 0]
}

export type { InputPayload, StatePayload, Ticker, Spline };
export { DEFAULT_STATE_PAYLOAD, DEFAUT_INPUT_PAYLOAD };

