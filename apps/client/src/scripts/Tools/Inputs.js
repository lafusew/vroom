import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { MathUtils } from 'three';
import { EVENTS } from 'utils/constants.js';

export default class Inputs {
	constructor() {
		state.register(this);
		this._speedSlider = document.querySelector('.speed-slider');

		this._leftLaneSwitchBtn = document.querySelector('.left-button');
		this._rightLaneSwitchBtn = document.querySelector('.right-button');
	}

	onAttach() {
		this._speedSlider.addEventListener('touchmove', this._touchMove);

		this._leftLaneSwitchBtn.addEventListener('click', this._clickButton);
		this._rightLaneSwitchBtn.addEventListener('click', this._clickButton);
	}

	_touchMove = (e) => {
		if (!e.touches) return;
		for (let i = 0; i < 2; i++) if (e.touches[i]?.clientX > app.tools.viewport.width * 0.5) this._speedMove(e.touches[i].clientY);
	};

	_speedMove = (y) => {
		state.emit(EVENTS.FINGER_SPEED, MathUtils.clamp((app.tools.viewport.height - y) / app.tools.viewport.height, 0, 1));
	};

	_clickButton = (e) => {
		state.emit(e.target === this._leftLaneSwitchBtn ? EVENTS.SWITCH_LEFT : EVENTS.SWITCH_RIGHT);
	};
}
