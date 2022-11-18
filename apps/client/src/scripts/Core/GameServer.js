import { Client, CLIENT_EVENTS, gameConfig, SERVER_EVENTS, TRACKS } from '@vroom/shared';
import { customAlphabet } from 'nanoid';
import app from 'scripts/App.js';
import state from 'scripts/State.js';
import store from 'scripts/Store.js';
import { io } from 'socket.io-client';
import { EVENTS, STORE_KEYS } from 'utils/constants.js';

const nanoid = customAlphabet('1234567890', 4);

export default class GameServer {
	constructor({ roomId = nanoid(), playerName = 'Player', trackName = 'triangle 3D' }) {
		state.register(this);

		this._roomId = roomId;
		store.set(STORE_KEYS.ROOM_ID, roomId);
		this._playerId = nanoid(10);
		this._trackName = trackName;
		this.definitiveLeaderBoard = [];

		console.log(trackName);

		this.players = {
			[this._playerId]: playerName,
		};

		this.client = null;
		this._speedInput = gameConfig.minSpeed;

		this.instance = io(import.meta.env.VITE_SERVER_URL);
		this.instance.emit('join', { roomId, playerId: this._playerId, playerName, trackName });

		this.instance.on(SERVER_EVENTS.GAME_START, this._gameStart);
		this.instance.on(SERVER_EVENTS.TICK, this._serverTick);
		this.instance.on(SERVER_EVENTS.PLAYER_LANE_CHANGE, this._playerLineChange);
		this.instance.on(SERVER_EVENTS.EJECTION, this._playerEjection);
		this.instance.on(SERVER_EVENTS.UPDATE_ROOM_CONFIG, this._updatePlayerList);
		this.instance.on(SERVER_EVENTS.UPDATE_LEADERBOARD, this._updateLeaderboard);
		this.instance.on(SERVER_EVENTS.GAME_STOP, this._handleGameStop);

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
		this.instance.emit(CLIENT_EVENTS.READY, this._roomId, this._trackName);
	}

	onInputSpeed(speedInput) {
		this._speedInput = speedInput;
		if (this.client?.getRockets()[this._playerId].isEjecting) this._speedInput = 0;
	}

	onInputLane(direction) {
		this.instance.emit(CLIENT_EVENTS.INPUT_LANE_CHANGE, this.client.getRoomId(), { direction, playerId: this._playerId });
	}

	_gameStart = () => {
		this.client = Client.getInstance(this._roomId, this._playerId, this.players, this._send, TRACKS[this._trackName]);
		console.log('Game start', this.client.getPlayers());
		state.emit(EVENTS.GAME_START, this._playerId);
	};

	_send = (eventName, input) => {
		// console.log('OUTCOMING INPUT: ', input);
		this.instance.emit(eventName, this.client.getRoomId(), input);
	};

	_updatePlayerList = ({ players, track }) => {
		this.players = players;
		this._trackName = track;
		app.dom.pageComponentsManager.get('index').componentsManager.get(document.querySelector('.lobby')).updateMapName(this._trackName);
		console.log(this.players, this._trackName);
	};

	_serverTick = (state) => {
		// console.log('INCOMING STATE: ', state);
		this.client?.onServerState(state);
	};

	_handleGameStop = (finishedPlayerId) => {
		this.definitiveLeaderBoard.push(finishedPlayerId);
	};

	_playerLineChange = (payload) => {
		this.client.changeLane(payload);
		console.log(payload.playerId + ' changed line', payload.direction);
	};

	_playerEjection = (payload) => {
		console.log('Ejection from server', payload.direction, payload.playerId);
	};

	_updateLeaderboard = (ids) => {
		this._updateLeaderboardUI(ids);
	};

	// TODO: MOOVE THIS
	_updateLeaderboardUI = (names) => {
		const leaderboard = document.querySelector('.leaderboard ul');
		leaderboard.innerHTML = '';
		names.forEach((name, index) => {
			const item = document.createElement('li');
			item.innerHTML = `${index + 1}. ${name}`;
			leaderboard.appendChild(item);
		});
	};

	onTick() {
		this.client?.update(this._speedInput);
	}
}
