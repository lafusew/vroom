import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import state from 'scripts/State.js';
import store from 'scripts/Store.js';
import { EVENTS, STORE_KEYS } from 'utils/constants.js';

export default class Lobby extends Component {
	constructor(el) {
		super(el);
		this.startGameButton = this.el.querySelector('#start-game-button');
		this.mapNameH1 = this.el.querySelector('#map-name');
		this.roomIdH1 = this.el.querySelector('#room-id');
		state.on(EVENTS.GAME_START, this._hideUI);
	}

	open() {
		this.startGameButton.addEventListener('click', this._startGame);
		this.updateMapName(store.get(STORE_KEYS.TRACK_NAME));
		this.roomIdH1.innerText = 'Room ID: ' + store.get(STORE_KEYS.ROOM_ID);

		super.lockOrientation();
	}

	close() {
		this.startGameButton.removeEventListener('click', this._startGame);

		super.unlockOrientation();
	}

	updateMapName(mapName) {
		this.mapNameH1.innerText = 'Map: ' + mapName;
	}

	_startGame() {
		state.emit(EVENTS.GAME_READY);
	}

	_hideUI = () => {
		app.dom.pageComponentsManager.get('index').close();
		console.log('Game started 🕹');
	};
}
