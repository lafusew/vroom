import { Track } from "./entities/Track.js";
import Client from "./modules/client.js";
import Server from "./modules/server.js";
import { ChangeLanePayload, CLIENT_EVENTS, EjectionPayload, Event, InputPayload, LeaderboardPayload, Players, SERVER_EVENTS, StatesPayload } from "./types/index.js";
import gameConfig from "./utils/gameConfig.js";
import trackConfig from "./utils/trackConfig.js";
const TRACKS = Object.fromEntries(trackConfig.splines.map((spline) => [spline.name, new Track(spline.name)]));

export { Client, Server, TRACKS, SERVER_EVENTS, CLIENT_EVENTS, gameConfig, trackConfig };
export type { InputPayload, StatesPayload, ChangeLanePayload, EjectionPayload, Players, Event, Track, LeaderboardPayload };
