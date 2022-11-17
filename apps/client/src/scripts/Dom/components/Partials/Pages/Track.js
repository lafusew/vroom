import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { EVENTS } from 'utils/constants.js';

export default class Track extends Component {
	constructor(el) {
		super(el);
		this.createRoomButton = this.el.querySelector('#create-room-button');
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
