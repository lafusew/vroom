import * as IO from 'socket.io';
import { RoomConfig, Room, Rooms } from '../types/index.js';
import { Server as GameInstance, InputPayload, StatesPayload, Event, TRACKS } from '@vroom/shared';
import http from 'http';

class Sockets {
  private static _instance: Sockets;
  private io: IO.Server;
  private http: http.Server;
  private port: number;

  private rooms: Rooms;

  private send: (id: string, payload: StatesPayload) => void;

  private constructor(http: http.Server, port: number) {
    this.port = port;

    this.http = http;
    this.io = new IO.Server(
      http,
      { cors: { origin: "*", methods: ["GET", "POST"] } }
    );

    this.rooms = {};

    this.send = (id: string, payload: StatesPayload) => {
      this.sendEvent(id, 'tick', payload);
    };

    this.io.on('connection', (socket) => {
      socket.on('join', (config: RoomConfig) => {
        this.joinRoom(config, socket);
        console.log(`Player ${config.playerName} with id ${config.playerId} joined room ${config.roomId}`);
      });

      socket.on('ready', (id: string) => {
        console.log(`Room ${id} is ready, starting game in 3 seconds`);
        setTimeout(() => {
          this.start(id);
        }, 3000, id);
      });

      socket.on('tick', (id: string, payload: InputPayload) => {
        this.rooms[id].game?.onClientInput(payload)
      });
    });
  }

  public init(): void {
    this.http.listen(this.port, () => {
      console.log(`listening on *:${this.port}`);
    })
  }

  private start(roomId: string): void {
    console.log(this.rooms[roomId]);
    this.sendEvent(roomId, 'start');
    const instance =
      this.rooms[roomId].game =
      new GameInstance(roomId, this.rooms[roomId].players, this.send, TRACKS.bone);

    setInterval(instance.update.bind(instance), 1000 / 60);
  }

  private createRoom(config: RoomConfig, socket: IO.Socket): Room {
    socket.join(config.roomId);

    this.rooms[config.roomId] = {
      players: {
        [config.playerId]: config.playerName,
      }
    };

    console.log(this.rooms)

    return this.rooms[config.roomId];
  }

  private sendEvent<T>(roomId: string, eventName: string, payload?: T): void {
    this.io.to(roomId).emit(eventName, payload);
  }

  private joinRoom(config: RoomConfig, socket: IO.Socket): Room {
    let room = this.rooms[config.roomId];
    socket.join(config.roomId);

    if (room) {
      room.players[config.playerId] = config.playerName;
      this.sendEvent(config.roomId, 'updatedPlayerList', room.players);
    } else {
      room = this.createRoom(config, socket);
    }

    return room;
  }

  public getRoomsIds(): string[] {
    return Object.keys(this.rooms);
  }

  public static getInstance(http: http.Server, port: number): Sockets {
    if (!Sockets._instance) {
      Sockets._instance = new Sockets(http, port);
    }

    return Sockets._instance;
  }
}

export { Sockets };