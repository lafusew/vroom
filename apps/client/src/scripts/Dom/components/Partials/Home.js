import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import store from 'scripts/Store.js';

export default class Home extends Component {
	constructor(el) {
		super(el);
		this.createRoomButton = this.el.querySelector('#create-room-button');
		this.joinRoomButton = this.el.querySelector('#join-room-button');
		this.homeNameH1 = this.el.querySelector('#home-name');
	}

	open() {
		this.createRoomButton.addEventListener('click', this._createRoom);
		this.joinRoomButton.addEventListener('click', this._joinRoom);
		this.homeNameH1.innerHTML = 'Hello ' + store.get('pseudo');

		super.lockOrientation();
	}

	close() {
		this.createRoomButton.removeEventListener('click', this._createRoom);
		this.joinRoomButton.removeEventListener('click', this._joinRoom);

		super.unlockOrientation();
	}

	_createRoom() {
		app.dom.pageComponentsManager.get('index').showPage('CreateRoom');
	}

	_joinRoom() {
		app.dom.pageComponentsManager.get('index').showPage('JoinRoom');
	}
}
