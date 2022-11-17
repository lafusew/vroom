import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

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
		app.dom.pageComponentsManager.get('index').showPage('Lobby');
	}
}
