import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

export default class Skin extends Component {
	constructor(el) {
		super(el);
		this.selectSkinButton = this.el.querySelector('#select-skin-button');
	}

	open() {
		this.selectSkinButton.addEventListener('click', this._goMultiplayer);

		super.lockOrientation();
	}

	close() {
		this.selectSkinButton.removeEventListener('click', this._goMultiplayer);

		super.unlockOrientation();
	}

	_goMultiplayer() {
		app.dom.pageComponentsManager.get('index').showPage('Multiplayer');
	}
}
