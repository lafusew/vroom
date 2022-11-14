import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { PerspectiveCamera } from 'three';

const BASE_FOV = 45;

export default class RocketCamera extends PerspectiveCamera {
	/**
	 *
	 * @param {import("./Rocket.js").default} rocket
	 */
	constructor(rocket) {
		super(BASE_FOV, app.tools.viewport.ratio, 1, 20);
		state.register(this);

		this.position.y = 1;

		this._rocket = rocket;
	}

	onAttach() {
		app.webgl.camera.targetCamera = this;

		app.debug?.pane.add(this, 'RocketCamera', 0);
	}

	onTick() {
		// this.position.copy(this._rocket.mesh.position);
		this.lookAt(this._rocket.mesh.position);
	}
}
