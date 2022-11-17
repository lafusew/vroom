import Component from 'Dom/Abstract/Component.js';
import store from 'scripts/Store.js';
import { STORE_KEYS } from 'utils/constants.js';

export default class Lobby extends Component {
	constructor(el) {
		super(el);
		this.startGameButton = this.el.querySelector('#start-game-button');
		this.mapNameH1 = this.el.querySelector('#map-name');
	}

	open() {
		this.startGameButton.addEventListener('click', this._startGame);
		this.mapNameH1.innerText = 'Map: ' + store.get(STORE_KEYS.TRACK_NAME);

		super.lockOrientation();
	}

	close() {
		this.startGameButton.removeEventListener('click', this._startGame);

		super.unlockOrientation();
	}

	_startGame() {
		console.log('Game started 🕹');
	}
}
