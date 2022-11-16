import state from 'scripts/State.js';
import { io } from 'socket.io-client';

export default class GameServer {
	constructor() {
		state.register(this);
		this.instance = io(import.meta.env.VITE_SERVER_URL);
	}

	// TODO: implements sockets events to dispatch
}
