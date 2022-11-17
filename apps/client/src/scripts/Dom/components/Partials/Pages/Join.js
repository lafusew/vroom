import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import state from 'scripts/State.js';
import store from 'scripts/Store.js';
import { EVENTS, STORE_KEYS } from 'utils/constants.js';

export default class Join extends Component {
	constructor(el) {
		super(el);
		this.joinRoomButton = this.el.querySelector('#join-room-button');
		this.joinRoomInput = this.el.querySelector('input');
	}

	open() {
		this.joinRoomButton.addEventListener('click', this._goLobby);

		super.lockOrientation();
	}

	close() {
		this.joinRoomButton.removeEventListener('click', this._goLobby);

		super.unlockOrientation();
	}

	_goLobby = () => {
		store.set(STORE_KEYS.ROOM_ID, this.joinRoomInput.value);
		state.emit(EVENTS.JOIN_ROOM);
		app.dom.pageComponentsManager.get('index').showPage('Lobby');
	};
}
