import { Track } from "./entities/Track.js";
import Client from "./modules/client.js";
import Server from "./modules/server.js";
import { Event, InputPayload, Players, StatesPayload, ChangeLanePayload, SERVER_EVENTS, CLIENT_EVENTS, LeaderboardPayload, ServerPayload } from "./types/index.js";
import trackConfig from "./utils/trackConfig.js";
const TRACKS = Object.fromEntries(trackConfig.splines.map((spline) => [spline.name, new Track(spline.name)]));

export { Client, Server, TRACKS, SERVER_EVENTS, CLIENT_EVENTS };
export type {
  InputPayload,
  StatesPayload,
  ChangeLanePayload,
  Players,
  Event,
  Track,
  LeaderboardPayload,
  ServerPayload
};