import app from 'scripts/App.js';
import state from 'scripts/State.js';

export default class Fullscreen {
	constructor() {
		state.register(this);
	}

	onAttach() {
		app.$app.addEventListener('click', this._click);
	}

	_click = () => {
		this._toggleFullscreen();
	};

	_toggleFullscreen() {
		const doc = window.document;
		const docEl = doc.documentElement;

		const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
		const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

		if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl);
		} else {
			cancelFullScreen.call(doc);
		}
	}

	// TODO: add close to fullscreen
}
