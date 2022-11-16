import { Vector3 } from "three";

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

type PlayerName = string;
type PlayerId = string;
type RoomId = string;

interface Players {
  [id: PlayerId]: PlayerName;
}

type Event<T> = [string, T]

interface Game {
  // PROCRESS STATE METHODS
  update(...args: any): void;

  // GETTERS TO ACCESS STATE
  getStates(): { [playerId: string]: State };
}

interface Spline {
  name: string;
  points: Vector3[];
  normals: Vector3[];
  default?: boolean;
}

export type { Players, InputPayload, State, StatesPayload, Event, Game, Spline };
