import * as IO from 'socket.io';
import { Rooms } from '../types/index.js';
import { Server as GameInstance, InputPayload, StatePayload } from '@vroom/shared';
import http from 'http';

class Sockets {
  private static _instance: Sockets;
  private io: IO.Server;
  private http: http.Server;
  private port: number;

  private rooms: Rooms;

  private send?: (id: string, payload: StatePayload) => void;

  private constructor(http: http.Server, port: number) {
    this.port = port;

    this.http = http;
    this.io = new IO.Server(
      http,
      { cors: { origin: "*", methods: ["GET", "POST"] } }
    );

    this.rooms = {};

    this.send = (id: string, payload: StatePayload) => {
      this.io.to(id).emit('data', payload)
    };

    this.io.on('connection', (socket) => {
      socket.on('join', (id: string) => {
        const instance = this.joinRoom(id, socket);
        this.startGameInstance(instance);
      });

      socket.on('data', (id: string, payload: InputPayload) => {
        this.rooms[id].onClientInput(payload)
      });
    });
  }

  public start(): void {
    this.http.listen(this.port, () => {
      console.log(`listening on *:${this.port}`);
    })
  }

  private startGameInstance(instance: GameInstance): void {
    const instanceId = instance.getId();
    console.log(`Starting game instance ${instanceId} in 5s`);
    setTimeout(() => {
      this.io.to(instanceId).emit('start');

      setInterval(instance.update.bind(instance), 1000 / 60);
    }, 3000);
  }

  private createRoom(id: string, socket: IO.Socket): GameInstance {
    socket.join(id);

    if (!this.send) {
      throw new Error('Send function not initialized');
    }

    this.rooms[id] = new GameInstance(id, this.send);
    console.log(this.rooms)
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