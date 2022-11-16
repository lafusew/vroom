import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

export default class Multiplayer extends Component {
	constructor(el) {
		super(el);
		this.createRoomButton = this.el.querySelector('#create-room-button');
		this.joinRoomButton = this.el.querySelector('#join-room-button');
	}

	open() {
		this.createRoomButton.addEventListener('click', this._goTrack);
		this.joinRoomButton.addEventListener('click', this._goJoin);

		super.lockOrientation();
	}

	close() {
		this.createRoomButton.removeEventListener('click', this._goTrack);
		this.joinRoomButton.removeEventListener('click', this._goJoin);

		super.unlockOrientation();
	}

	_goTrack() {
		app.dom.pageComponentsManager.get('index').showPage('Track');
	}

	_goJoin() {
		app.dom.pageComponentsManager.get('index').showPage('Join');
	}
}
