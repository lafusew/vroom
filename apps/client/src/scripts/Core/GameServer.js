import { Client } from '@vroom/shared';
import { nanoid } from 'nanoid';
import state from 'scripts/State.js';
import { io } from 'socket.io-client';

const url = new URLSearchParams(window.location.search);

const roomId = url.has('roomId') ? url.get('roomId') : nanoid(10);
const playerId = nanoid(10);
const playerName = 'JUL';

export default class GameServer {
	constructor() {
		state.register(this);

		this.players = {
			[playerId]: playerName,
		};

		this.client = null;

		this.instance = io(import.meta.env.VITE_SERVER_URL);
		this.instance.emit('join', { roomId, playerId, playerName });

		this.instance.on('start', this._gameStart);
		this.instance.on('tick', this._serverTick);
	}

	onGameReady() {
		this.instance.emit('ready', roomId);
	}

	_gameStart = () => {
		this.client = Client.getInstance(roomId, playerId, this.players, this._send);
	};

	_send = (input) => {
		console.log('OUTCOMING INPUT: ', input);
		this.instance.emit('tick', this.client.getRoomId(), input);
	};

	_updatePlayerList = (playersMap) => {
		this.players = playersMap;
		console.log(this.players);
	};

	_serverTick = (state) => {
		console.log('INCOMING STATE: ', state);
		this.client?.onServerState(state);
	};

	onTick() {
		this.client?.update();
	}
}
