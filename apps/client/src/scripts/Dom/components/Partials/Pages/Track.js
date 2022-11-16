import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

export default class Track extends Component {
	constructor(el) {
		super(el);
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
		app.dom.pageComponentsManager.get('index').showPage('Lobby');
	}
}
