import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

const doc = window.document;
const docEl = doc.documentElement;

export default class Rotate extends Component {
	constructor(el) {
		super(el);
		this._isFullScreen = false;
	}

	open() {
		this.isOrientationLandscape = window.matchMedia('(orientation: landscape)');
		this.isOrientationLandscape.addEventListener('change', this._handleOrientationChange);
	}

	close() {
		this.isOrientationLandscape.removeEventListener('change', this._handleOrientationChange);
		this._openFullScreen();
	}

	_handleOrientationChange = (e) => {
		e.matches && app.dom.pageComponentsManager.get('index').setRotateMode(false);
	};

	_openFullScreen = () => {
		const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

		if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) requestFullScreen.call(docEl).then(() => (this._isFullScreen = true));
	};

	// _closeFullScreen = () => {
	// 	if (!this._isFullScreen) return;
	// 	const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
	// 	cancelFullScreen.call(docEl);
	// };
}
