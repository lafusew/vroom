import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import store from 'scripts/Store.js';
import { STORE_KEYS } from 'utils/constants.js';

export default class Landing extends Component {
	constructor(el) {
		super(el);
		this.pseudoInputs = this.el.querySelectorAll('.pseudo-input');
		this.startButton = this.el.querySelector('#start-button');
		this.pseudo = '';
		this.activeInput = this.pseudoInputs[0];
	}

	attach() {}

	detach() {}

	open() {
		this.pseudoInputs.forEach((pseudoInput) => {
			pseudoInput.addEventListener('input', this._handleInputChange);
		});
		document.addEventListener('keydown', this._handleReturn);
		this.startButton.addEventListener('click', this._login);
	}

	close() {
		this.pseudoInputs.forEach((pseudoInput) => {
			pseudoInput.removeEventListener('input', this._handleInputChange);
		});
		document.removeEventListener('keydown', this._handleReturn);
		this.startButton.removeEventListener('click', this._login);
	}

	_handleInputChange = (e) => {
		if (e.target.value.length === 1) {
			this.pseudo += e.target.value;
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
			this.pseudo = this.pseudo.slice(0, -1);
		}
		this.startButton.disabled = this.pseudo.length === 3 ? false : true;
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

	_login = () => {
		if (this.pseudo) {
			store.set(STORE_KEYS.PSEUDO, this.pseudo.toUpperCase());
			app.dom.pageComponentsManager.get('index').showPage('Home');
		}
	};
}
