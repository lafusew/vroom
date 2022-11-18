import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';

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
		this._currentRocketPos = new Vector3();

		app.debug?.pane.add(this, 'RocketCamera', 0);
	}

	_updatePosition(dt) {
		this.newPos = this._rocket.directionV3.clone().negate().normalize().multiplyScalar(0.5).add(this._rocket.position);
		this.newPos.y += 0.3;

		this.position.x = MathUtils.damp(this.position.x, this.newPos.x, 5, dt);
		this.position.y = MathUtils.damp(this.position.y, this.newPos.y, 5, dt);
		this.position.z = MathUtils.damp(this.position.z, this.newPos.z, 5, dt);

		// this.position.copy(this.newPos);
		// app.webgl.scene.remove(this.directionHelper);
		// this.directionHelper = new ArrowHelper(this.newPos.sub(this._rocket.mesh.position), this._rocket.mesh.position, this.newPos.length(), 0xffff00);
		// app.webgl.scene.add(this.directionHelper);
	}

	onTick({ dt }) {
		this._updatePosition(dt);

		this._currentRocketPos.x = MathUtils.damp(this._currentRocketPos.x, this._rocket.position.x, 5, dt);
		this._currentRocketPos.y = MathUtils.damp(this._currentRocketPos.y, this._rocket.position.y, 5, dt);
		this._currentRocketPos.z = MathUtils.damp(this._currentRocketPos.z, this._rocket.position.z, 5, dt);

		this.lookAt(this._currentRocketPos);
	}
}
