import { Vector3 } from "three";
import { CLIENT_EVENTS, SERVER_EVENTS } from "./events.js";

interface InputPayload {
	tick: number;
	inputSpeed: number;
	playerId: string;
}

interface ChangeLanePayload {
	playerId: string;
	direction: number;
}

interface EjectionPayload extends ChangeLanePayload { }

interface StatesPayload {
	tick: number;
	states: { [playerId: string]: State };
	// speed: number;
	// currentLane: number;
}

interface State {
	// position: [number, number, number];
	progress: number;
	speed: number;
}

type ServerPayload = StatesPayload | ChangeLanePayload | LeaderboardPayload | EjectionPayload | string;

type Player = string;
type PlayerId = string;

type LeaderboardPayload = Array<string>;

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

export { SERVER_EVENTS, CLIENT_EVENTS };
export type { Players, InputPayload, State, StatesPayload, ServerPayload, ChangeLanePayload, EjectionPayload, Event, Game, Spline, LeaderboardPayload };
