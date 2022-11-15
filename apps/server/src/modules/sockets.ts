import * as IO from 'socket.io';
import { Rooms } from '../types/index.js';
import { Server as GameInstance, InputPayload, StatesPayload } from '@vroom/shared';
import http from 'http';

class Sockets {
  private static _instance: Sockets;
  private io: IO.Server;
  private http: http.Server;
  private port: number;

  private rooms: Rooms;

  private send?: (id: string, payload: StatesPayload) => void;

  private constructor(http: http.Server, port: number) {
    this.port = port;

    this.http = http;
    this.io = new IO.Server(
      http,
      { cors: { origin: "*", methods: ["GET", "POST"] } }
    );

    this.rooms = {};

    this.send = (id: string, payload: StatesPayload) => {
      this.io.to(id).emit('tick', payload)
    };

    this.io.on('connection', (socket) => {
      socket.on('join', (roomId: string, playerId: string) => {
        this.joinRoom(roomId, playerId, socket);
        console.log('Player joined room', roomId, playerId);
      });

      socket.on('ready', (id: string) => {
        const instance = this.rooms[id];
        if (instance) {
          this.start(instance);
        }
      });

      socket.on('tick', (id: string, payload: InputPayload) => {
        this.rooms[id].onClientInput(payload)
      });
    });
  }

  public init(): void {
    this.http.listen(this.port, () => {
      console.log(`listening on *:${this.port}`);
    })
  }

  private start(instance: GameInstance): void {
    const instanceId = instance.getRoomId();
    this.io.to(instanceId).emit('start');
    console.log(`Starting instance ${instanceId}..`);

    setInterval(instance.update.bind(instance), 1000 / 60);
  }

  private createRoom(roomId: string, playersId: string[], socket: IO.Socket): GameInstance {
    socket.join(roomId);

    if (!this.send) {
      throw new Error('Send function not initialized');
    }

    this.rooms[roomId] = new GameInstance(roomId, playersId, this.send);
    console.log(this.rooms)
    return this.rooms[roomId];
  }

  private joinRoom(roomId: string, playerId: string, socket: IO.Socket): GameInstance {
    let room = this.rooms[roomId];

    if (room) {
      socket.join(roomId);
      this.io.to(roomId).emit('joined', playerId);
      room.addPlayer(playerId);
    } else {
      room = this.createRoom(roomId, [playerId], socket);
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