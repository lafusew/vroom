import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';
import store from 'scripts/Store.js';
import { STORE_KEYS } from 'utils/constants.js';

export default class Home extends Component {
	constructor(el) {
		super(el);
		this.multiplayerButton = this.el.querySelector('#multiplayer-button');
		this.toggleSoundButton = this.el.querySelector('#toggle-sound-button');
		this.creditsButton = this.el.querySelector('#credits-button');
		this.homeNameH1 = this.el.querySelector('#home-name');
	}

	open() {
		this.multiplayerButton.addEventListener('click', this._goSkin);
		this.toggleSoundButton.addEventListener('click', this._toggleSound);
		this.creditsButton.addEventListener('click', this._goCredits);
		this.homeNameH1.innerHTML = store.get(STORE_KEYS.PSEUDO);

		/// #if DEBUG
		const url = new URLSearchParams(location.search);
		if (url.has('pseudo')) {
			this.homeNameH1.innerHTML = url.get('pseudo');
		}
		/// #endif

		super.lockOrientation();
	}

	close() {
		this.multiplayerButton.removeEventListener('click', this._goSkin);
		this.toggleSoundButton.removeEventListener('click', this._toggleSound);
		this.creditsButton.removeEventListener('click', this._goCredits);

		super.unlockOrientation();
	}

	_goSkin() {
		app.dom.pageComponentsManager.get('index').showPage('Skin');
	}

	_toggleSound() {
		// app.dom.pageComponentsManager.get('index').showPage('Join');
	}

	_goCredits() {
		app.dom.pageComponentsManager.get('index').showPage('Credits');
	}
}
