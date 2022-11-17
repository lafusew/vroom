import { Vector3 } from "three";

interface InputPayload {
    tick: number;
    inputSpeed: number;
    playerId: string;
}

interface ChangeLanePayload {
    playerId: string;
    direction: number;
}

interface StatesPayload {
    tick: number;
    states: { [playerId: string]: State };
    // speed: number;
    // currentLane: number;
}

interface State {
    position: [number, number, number];
    speed: number;
}

type Player = string;
type PlayerId = string;
type RoomId = string;

interface Players {
    [id: PlayerId]: Player;
}

type Event<T> = [string, T];

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

export type { Players, InputPayload, State, StatesPayload, ChangeLanePayload, Event, Game, Spline };
