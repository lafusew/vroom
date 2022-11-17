import { InputPayload, Server as GameInstance, StatesPayload, TRACKS } from "@vroom/shared";
import http from "http";
import * as IO from "socket.io";
import { RoomConfig, Rooms } from "../types/index.js";

class Sockets {
  private static _instance: Sockets;
  private io: IO.Server;
  private http: http.Server;
  private port: number;

  private rooms: Rooms;

  private emit<T>(roomId: string, eventName: string, payload?: T): void {
    this.io.to(roomId).emit(eventName, payload);
  }

  private constructor(http: http.Server, port: number) {
    this.port = port;

    this.http = http;
    this.io = new IO.Server(http, { cors: { origin: "*", methods: ["GET", "POST"] } });

    this.rooms = {};

    this.handleSocket();

    this.http.listen(this.port, () => {
      console.log(`listening on *:${this.port}`);
    });
  }

  private startGameInstance(roomId: string, trackName: string): void {
    console.log(this.rooms[roomId]);

    this.emit(roomId, "start");

    const instance = (this.rooms[roomId].game = new GameInstance(
      roomId,
      this.rooms[roomId].players,
      (id: string, payload: StatesPayload) => this.emit(id, "tick", payload),
      TRACKS[trackName]
    ));

    instance.setIsGameRunning(true);
    setInterval(instance.update.bind(instance), 1000 / 60);
  }

  private handleSocket(): void {
    let roomId: string;
    let playerId: string;

    this.io.on("connection", (socket) => {
      socket.on("join", (config: RoomConfig) => {
        this.joinRoom(config, socket);
        roomId = config.roomId;
        playerId = config.playerId;
      });

      this.handleGameStart(socket);
      this.handleTick(socket);
      this.handleLaneChange(socket);
      this.handleDisconnect(socket, roomId, playerId);
    });
  }

  private joinRoom(config: RoomConfig, socket: IO.Socket) {
    let room = this.rooms[config.roomId];

    if (room && room.game?.getIsGameRunning()) {
      console.log(`Player ${config.playerName} with id ${config.playerId} tryied joined room ${config.roomId} but was rejected because the game is already running`);
      return;
    }

    socket.join(config.roomId);

    if (room) {
      room.players[config.playerId] = config.playerName;
      this.emit(config.roomId, "updatedPlayerList", room.players);
    } else {
      this.rooms[config.roomId] = {
        players: {
          [config.playerId]: config.playerName,
        },
      };
    }

    console.log(`Player ${config.playerName} with id ${config.playerId} joined room ${config.roomId}`);
  }

  private handleGameStart(socket: IO.Socket): void {
    socket.on("ready", (id: string, trackName: string) => {
      console.log(`Room ${id} is ready, starting game in 3 seconds`);

      setTimeout(
        () => {
          this.startGameInstance(id, trackName);
        },
        3000,
        id
      );
    });
  }

  private handleTick(socket: IO.Socket): void {
    socket.on("tick", (id: string, payload: InputPayload) => {
      this.rooms[id].game?.onClientInput(payload);
    });
  }

  private handleLaneChange(socket: IO.Socket): void {
    socket.on("inputLane", (id: string, payload: { direction: number, playerId: string }) => {
      this.rooms[id].game?.changeLane(payload);
      this.emit(id, "playerLaneChange", payload);
    });
  }

  private handleDisconnect(socket: IO.Socket, roomId: string, playerId: string): void {
    socket.on("disconnect", () => {
      if (roomId && playerId) {
        console.log(`Player ${playerId} disconnected from room ${roomId}`);
        this.removePlayerFromRoom(roomId, playerId);

        if (Object.keys(this.rooms[roomId].players).length === 0) {
          this.deleteEmptyRoom(roomId);
        }
      }
    });
  }

  private removePlayerFromRoom(roomId: string, playerId: string): void {
    delete this.rooms[roomId].players[playerId];
    this.emit(roomId, "updatedPlayerList", this.rooms[roomId].players);
  }

  private deleteEmptyRoom(roomId: string): void {
    console.log(`Room ${roomId} is empty, deleting it`);
    delete this.rooms[roomId];
  }

  public getRoomsIds(): string[] {
    return Object.keys(this.rooms);
  }

  public static startInstance(http: http.Server, port: number): Sockets {
    if (!Sockets._instance) {
      Sockets._instance = new Sockets(http, port);
    }

    return Sockets._instance;
  }
}

export { Sockets };
