import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

export default class Rotate extends Component {
	constructor(el) {
		super(el);
	}

	open() {
		this.isOrientationLandscape = window.matchMedia('(orientation: landscape)');
		this.isOrientationLandscape.addEventListener('change', this._handleOrientationChange);
	}

	close() {
		this.isOrientationLandscape.removeEventListener('change', this._handleOrientationChange);
	}

	_handleOrientationChange = (e) => {
		e.matches && app.dom.pageComponentsManager.get('index').setRotateMode(false);
	};
}
