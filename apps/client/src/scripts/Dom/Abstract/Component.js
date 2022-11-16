import app from 'scripts/App.js';

export default class Component {
	/** @param {HTMLElement} el */
	constructor(el) {
		this.el = el;
	}

	lockOrientation() {
		this.isOrientationPortrait = window.matchMedia('(orientation: portrait)');
		this.isOrientationPortrait.addEventListener('change', this._handleOrientationChange);
		if (this.isOrientationPortrait.matches) {
			app.dom.pageComponentsManager.get('index').setRotateMode(true);
		}
	}

	unlockOrientation() {
		this.isOrientationPortrait.removeEventListener('change', this._handleOrientationChange);
	}

	_handleOrientationChange = (e) => {
		console.log(e);
		if (e.matches) {
			app.dom.pageComponentsManager.get('index').setRotateMode(true);
		}
	};

	init() {}

	attach() {}

	detach() {}
}
