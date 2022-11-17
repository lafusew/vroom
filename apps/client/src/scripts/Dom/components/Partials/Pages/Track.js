import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import state from 'scripts/State.js';
import store from 'scripts/Store.js';
import { EVENTS, STORE_KEYS } from 'utils/constants.js';

export default class Track extends Component {
	constructor(el) {
		super(el);
		store.set(STORE_KEYS.TRACK_NAME, 'triangle 3D');
		this.selectTrackButton = this.el.querySelector('#select-track-button');
	}

	open() {
		this.selectTrackButton.addEventListener('click', this._goLobby);

		super.lockOrientation();
	}

	close() {
		this.selectTrackButton.removeEventListener('click', this._goLobby);

		super.unlockOrientation();
	}

	_goLobby() {
		state.emit(EVENTS.JOIN_ROOM);
		app.dom.pageComponentsManager.get('index').showPage('Lobby');
	}
}
