import { Server, Players } from "@vroom/shared";

type RoomId = string;

interface Rooms {
  [id: RoomId]: Room;
}

interface Room {
  players: Players
  game?: Server
}

interface RoomConfig {
  roomId: string;
  playerId: string;
  playerName: string;
}

export type { Rooms, Room, RoomConfig };