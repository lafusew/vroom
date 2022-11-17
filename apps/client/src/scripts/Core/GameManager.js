import state from 'scripts/State.js';
import store from 'scripts/Store.js';
import { STORE_KEYS } from 'utils/constants.js';
import GameServer from './GameServer.js';

export default class GameManager {
	constructor() {
		state.register(this);
	}

	onJoinRoom(roomId) {
		this.gameServer = new GameServer({ roomId, playerName: store.get(STORE_KEYS.PSEUDO), trackName: store.get(STORE_KEYS.TRACK_NAME) });
	}
}
