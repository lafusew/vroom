import { Client } from '@vroom/shared';
import { nanoid } from 'nanoid';
import state from 'scripts/State.js';
import { io } from 'socket.io-client';
import { EVENTS } from 'utils/constants.js';

export default class GameServer {
	constructor({ roomId = nanoid(4), playerName = 'Player', trackName = 'triangle 3D' }) {
		state.register(this);

		this._roomId = roomId;
		this._playerId = nanoid(10);
		this._trackName = trackName;

		this.players = {
			[this._playerId]: playerName,
		};

		this.client = null;
		this._speedInput = 0;

		this.instance = io(import.meta.env.VITE_SERVER_URL);
		this.instance.emit('join', { roomId, playerId: this._playerId, playerName });

		this.instance.on('start', this._gameStart);
		this.instance.on('tick', this._serverTick);
		this.instance.on('playerLaneChange', this._playerLineChange);
		this.instance.on('updatedPlayerList', this._updatePlayerList);

		// TODO: Remove
		const handleInputs = (e) => {
			if (e.code === 'ArrowDown') {
				this._speedInput -= 0.1;
			} else if (e.code === 'ArrowUp') {
				this._speedInput += 0.1;
			} else if (e.code === 'Space') {
				this._speedInput = 0;
			} else if (e.code === 'ArrowLeft') {
				this.onInputLane(-1);
			} else if (e.code === 'ArrowRight') {
				this.onInputLane(1);
			}
		};
		window.addEventListener('keydown', handleInputs);
	}

	onGameReady() {
		this.instance.emit('ready', this._roomId, this._trackName);
	}

	onInputSpeed(speedInput) {
		this._speedInput = speedInput;
	}

	onInputLane(direction) {
		this.instance.emit('inputLane', this.client.getRoomId(), { direction, playerId: this._playerId });
	}

	_gameStart = () => {
		this.client = Client.getInstance(this._roomId, this._playerId, this.players, this._send);
		console.log('Game start', this.client.getPlayers());
		state.emit(EVENTS.GAME_START, this._playerId);
	};

	_send = (input) => {
		// console.log('OUTCOMING INPUT: ', input);
		this.instance.emit('tick', this.client.getRoomId(), input);
	};

	_updatePlayerList = (playersMap) => {
		this.players = playersMap;
		console.log(this.players);
	};

	_serverTick = (state) => {
		// console.log('INCOMING STATE: ', state);
		this.client?.onServerState(state);
	};

	_playerLineChange = (payload) => {
		console.log(payload.playerId + ' changed line', payload.direction);
	};

	onTick() {
		this.client?.update(this._speedInput);
	}
}
