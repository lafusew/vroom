import * as IO from 'socket.io';
import { Rooms } from '../types/index.js';
import { Server as GameInstance, InputPayload } from '@vroom/shared';
import http from 'http';

class Sockets {
  private static _instance: Sockets;
  private io: IO.Server;
  private http: http.Server;
  private port: number;

  private rooms: Rooms;

  private constructor(http: http.Server, port: number) {
    this.port = port;

    this.http = http;
    this.io = new IO.Server(http);

    this.rooms = {};
  }

  public start(): void {
    this.io.on('connection', (socket) => {
      socket.on('join', (id: string) => {
        this.joinRoom(id, socket);
      });

      socket.on('data', (id: string, payload: InputPayload) => {
        this.rooms[id].onClientInput(payload)
      });
    });

    this.http.listen(this.port, () => {
      console.log(`listening on *:${this.port}`);
    })
  }

  private createRoom(id: string, socket: IO.Socket): GameInstance {
    socket.join(id);

    this.rooms[id] = new GameInstance(id);

    return this.rooms[id];
  }

  private joinRoom(id: string, socket: IO.Socket): GameInstance {
    let room = this.rooms[id];

    if (room) {
      socket.join(id);
    } else {
      room = this.createRoom(id, socket);
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