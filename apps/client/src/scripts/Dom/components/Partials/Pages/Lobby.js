import Component from 'Dom/Abstract/Component.js';
import state from 'scripts/State.js';
import { EVENTS } from 'utils/constants.js';

export default class Lobby extends Component {
	constructor(el) {
		super(el);
		this.startGameButton = this.el.querySelector('#start-game-button');
	}

	open() {
		this.startGameButton.addEventListener('click', this._startGame);

		super.lockOrientation();
	}

	close() {
		this.startGameButton.removeEventListener('click', this._startGame);

		super.unlockOrientation();
	}

	_startGame() {
		console.log('Game started 🕹');
		state.emit(EVENTS.GAME_READY);
	}
}
