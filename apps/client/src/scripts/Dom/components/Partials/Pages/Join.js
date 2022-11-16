import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

export default class Join extends Component {
	constructor(el) {
		super(el);
		this.joinRoomButton = this.el.querySelector('#join-room-button');
	}

	open() {
		this.joinRoomButton.addEventListener('click', this._goLobby);

		super.lockOrientation();
	}

	close() {
		this.joinRoomButton.removeEventListener('click', this._goLobby);

		super.unlockOrientation();
	}

	_goLobby() {
		app.dom.pageComponentsManager.get('index').showPage('Lobby');
	}
}
