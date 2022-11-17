import { Server, Players } from "@vroom/shared";

type RoomId = string;

interface Rooms {
  [id: RoomId]: Room;
}

interface Room {
  players: Players
  trackName: string
  game?: Server
}

interface RoomConfig {
  roomId: string;
  playerId: string;
  playerName: string;
  trackName?: string;
}

export type { Rooms, Room, RoomConfig };