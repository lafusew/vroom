import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import state from 'scripts/State.js';
import store from 'scripts/Store.js';
import { EVENTS, STORE_KEYS } from 'utils/constants.js';

export default class Join extends Component {
	constructor(el) {
		super(el);
		this.joinRoomButton = this.el.querySelector('#join-room-button');
		this.joinRoomInputs = this.el.querySelectorAll('input');
		this._roomId = '';
		this.activeInput = this.joinRoomInputs[0];
	}

	open() {
		this.joinRoomInputs.forEach((joinRoomInput) => {
			joinRoomInput.addEventListener('input', this._handleInputChange);
		});
		document.addEventListener('keydown', this._handleReturn);
		this.joinRoomButton.addEventListener('click', this._goLobby);

		super.lockOrientation();
	}

	close() {
		this.joinRoomInputs.forEach((joinRoomInput) => {
			joinRoomInput.removeEventListener('input', this._handleInputChange);
		});
		document.removeEventListener('keydown', this._handleReturn);
		this.joinRoomButton.removeEventListener('click', this._goLobby);

		super.unlockOrientation();
	}

	_handleInputChange = (e) => {
		if (e.target.value.length === 1) {
			this._roomId += e.target.value;
			let nextInput = e.target.nextElementSibling;
			if (nextInput) {
				e.target.disabled = true;
				nextInput.disabled = false;
				nextInput.classList.add('active');
				nextInput.focus();
				this.activeInput = nextInput;
			}
		} else if (e.target.value.length === 2) {
			e.target.value = e.target.value.slice(0, 1);
		} else {
			this._roomId = this._roomId.slice(0, -1);
		}
		this.joinRoomButton.disabled = this._roomId.length === 4 ? false : true;
	};

	_handleReturn = (e) => {
		if (e.key === 'Backspace') {
			if (this.activeInput.value.length === 0) {
				let previousInput = this.activeInput.previousElementSibling;
				if (previousInput) {
					previousInput.disabled = false;
					previousInput.focus();
					this.activeInput.classList.remove('active');
					this.activeInput = previousInput;
				}
			}
		}
	};

	_goLobby = () => {
		if (this._roomId) {
			store.set(STORE_KEYS.ROOM_ID, this._roomId.toUpperCase());
			state.emit(EVENTS.JOIN_ROOM);
			app.dom.pageComponentsManager.get('index').showPage('Lobby');
		}
	};
}
