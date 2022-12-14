import { gameConfig } from '@vroom/shared';
import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { MathUtils } from 'three';
import { EVENTS } from 'utils/constants.js';

export default class Inputs {
	constructor() {
		state.register(this);
		this._inputSpeed = this._inputSpeedTarget = gameConfig.minSpeed;

		this._speedSlider = document.querySelector('.speed-slider');

		this._leftLaneSwitchBtn = document.querySelector('.left-button');
		this._rightLaneSwitchBtn = document.querySelector('.right-button');
	}

	onAttach() {
		this._speedSlider.addEventListener('touchmove', this._touchMove, { passive: true });
		this._speedSlider.addEventListener('touchend', this._touchEnd, { passive: true });

		this._leftLaneSwitchBtn.addEventListener('touchstart', this._clickButton, { passive: true });
		this._rightLaneSwitchBtn.addEventListener('touchstart', this._clickButton, { passive: true });
	}

	_touchMove = (e) => {
		if (!e.touches) return;
		else if (e.touches[e.touches.length - 1]?.clientX > app.tools.viewport.width * 0.5) this._speedMove(e.touches[e.touches.length - 1].clientY);
	};

	_touchEnd = () => {
		this._inputSpeedTarget = gameConfig.minSpeed;
	};

	_speedMove = (y) => {
		this._inputSpeedTarget = MathUtils.mapLinear(MathUtils.clamp((app.tools.viewport.height - y) / app.tools.viewport.height, 0.3, 0.7), 0.3, 0.7, 0.1, 1);
	};

	_clickButton = (e) => {
		state.emit(EVENTS.INPUT_LANE, e.target === this._leftLaneSwitchBtn ? -1 : 1);
	};

	onTick = ({ dt }) => {
		if (Math.abs(this._inputSpeed - this._inputSpeedTarget) < 0.00001) return;
		this._inputSpeed = MathUtils.damp(this._inputSpeed, this._inputSpeedTarget, 5, dt);

		state.emit(EVENTS.INPUT_SPEED, this._inputSpeed);
	};
}
