import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { PerspectiveCamera } from 'three';

const BASE_FOV = 45;

export default class RocketCamera extends PerspectiveCamera {
	/**
	 *
	 */
	constructor(rocket) {
		super(BASE_FOV, app.tools.viewport.ratio, 1, 20);
		state.register(this);

		this.position.y = 1;

		this._rocket = rocket;
		this.attached = false;
		this.directionHelper = null;

		app.debug?.pane.add(this, 'RocketCamera', 0);
	}

	_updatePosition() {
		this.newPos = this._rocket.directionV3.clone().negate().normalize().multiplyScalar(0.5).add(this._rocket.position);
		this.newPos.y += 0.3;

		this.position.copy(this.newPos);
		// app.webgl.scene.remove(this.directionHelper);
		// this.directionHelper = new ArrowHelper(this.newPos.sub(this._rocket.mesh.position), this._rocket.mesh.position, this.newPos.length(), 0xffff00);
		// app.webgl.scene.add(this.directionHelper);
	}

	onTick() {
		this._updatePosition();
		this.lookAt(this._rocket.position);
	}
}
