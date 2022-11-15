import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import store from 'scripts/Store.js';

export default class Landing extends Component {
	constructor(el) {
		super(el);
		this.pseudoInput = this.el.querySelector('#pseudo-input');
		this.loginButton = this.el.querySelector('#login-button');
	}

	attach() {}

	detach() {}

	open() {
		this.pseudoInput.addEventListener('input', this._handleInputChange);
		this.loginButton.addEventListener('click', this._login);
	}

	close() {
		this.pseudoInput.removeEventListener('input', this._handleInputChange);
		this.loginButton.removeEventListener('click', this._login);
	}

	_handleInputChange = (e) => {
		this.pseudo = e.target.value;
	};

	_login = () => {
		if (this.pseudo) {
			store.set('pseudo', this.pseudo);
			app.dom.pageComponentsManager.get('index').showPage('Home');
		}
	};
}
