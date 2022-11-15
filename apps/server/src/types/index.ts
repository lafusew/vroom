import { Server } from "@vroom/shared";

interface Rooms {
  [id: string]: Server;
}

export type { Rooms };