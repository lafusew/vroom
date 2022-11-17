import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import state from 'scripts/State.js';
import store from 'scripts/Store.js';
import { EVENTS, STORE_KEYS } from 'utils/constants.js';

export default class Track extends Component {
	constructor(el) {
		super(el);
		this.createRoomButton = this.el.querySelector('#create-room-button');
		store.set(STORE_KEYS.TRACK_NAME, 'triangle 3D');
	}

	open() {
		this.createRoomButton.addEventListener('click', this._goLobby);

		super.lockOrientation();
	}

	close() {
		this.createRoomButton.removeEventListener('click', this._goLobby);

		super.unlockOrientation();
	}

	_goLobby() {
		state.emit(EVENTS.JOIN_ROOM);
		app.dom.pageComponentsManager.get('index').showPage('Lobby');
	}
}
