import { Track } from "./entities/Track.js";
import Client from "./modules/client.js";
import Server from "./modules/server.js";
import { Event, InputPayload, EjectionPayload, Players, StatesPayload, ChangeLanePayload, SERVER_EVENTS, CLIENT_EVENTS, LeaderboardPayload, ServerPayload } from "./types/index.js";
import trackConfig from "./utils/trackConfig.js";
const TRACKS = Object.fromEntries(trackConfig.splines.map((spline) => [spline.name, new Track(spline.name)]));
import gameConfig from "./utils/gameConfig.js";

export type {
  InputPayload,
  StatesPayload,
  ChangeLanePayload,
  Players,
  Event,
  Track,
  LeaderboardPayload,
  ServerPayload,
  EjectionPayload
};


export { Client, Server, TRACKS, SERVER_EVENTS, CLIENT_EVENTS, gameConfig, trackConfig };
