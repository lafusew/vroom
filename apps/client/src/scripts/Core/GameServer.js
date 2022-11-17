import { Client } from '@vroom/shared';
import { nanoid } from 'nanoid';
import state from 'scripts/State.js';
import { io } from 'socket.io-client';
import { MathUtils } from 'three';
import { EVENTS } from 'utils/constants.js';

const url = new URLSearchParams(window.location.search);

const roomId = url.has('roomId') ? url.get('roomId') : 'test';
const playerId = nanoid(10);
const playerName = 'Player ' + MathUtils.randInt(1, 10);

export default class GameServer {
	constructor() {
		state.register(this);

		this.players = {
			[playerId]: playerName,
		};

		this.client = null;
		this._speedInput = 0;

		this.instance = io(import.meta.env.VITE_SERVER_URL);
		this.instance.emit('join', { roomId, playerId, playerName });

		this.instance.on('start', this._gameStart);
		this.instance.on('tick', this._serverTick);
		this.instance.on('playerLaneChange', this._playerLineChange);
		this.instance.on('updatedPlayerList', this._updatePlayerList);

		// TODO: Remove
		window.addEventListener('click', this._emitReady);
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

	// TODO: Remove
	_emitReady = () => {
		state.emit(EVENTS.GAME_READY);
		window.removeEventListener('click', this._emitReady);
	};

	onGameReady() {
		this.instance.emit('ready', roomId);
	}

	onInputSpeed(speedInput) {
		this._speedInput = speedInput;
	}

	onInputLane(direction) {
		this.instance.emit('inputLane', this.client.getRoomId(), direction);
	}

	_gameStart = () => {
		// TODO: Remove
		window.removeEventListener('click', this._emitReady);

		this.client = Client.getInstance(roomId, playerId, this.players, this._send);
		console.log('Game start', this.client.getPlayers());
		state.emit(EVENTS.GAME_START, playerId);
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

	_playerLineChange = (playerId, direction) => {
		console.log(playerId + ' changed line', direction);
	};

	onTick() {
		this.client?.update(this._speedInput);
	}
}
