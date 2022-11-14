import app from 'scripts/App.js';
import { PerspectiveCamera } from 'three';
import stateMixin from 'utils/stateMixin.js';

const BASE_FOV = 45;

/** @extends PerspectiveCamera */
export default class extends stateMixin(PerspectiveCamera) {
	constructor() {
		super(BASE_FOV, app.tools.viewport.ratio, 1, 100);

		this._position = this.position.clone();
		this._position.set(0, 3, 0);
		this._quaternion = this.quaternion.clone();
	}

	onAttach() {
		app.debug?.pane.add(this, 'MainCamera', 0);
	}

	onResize({ ratio }) {
		this.aspect = ratio;
		this.fov = BASE_FOV / Math.min(1, ratio * 1.5);
		this.updateProjectionMatrix();
	}

	onTick() {
		if (this.orbitControls) return;

		this.position.copy(this._position);
		this.quaternion.copy(this._quaternion);

		this.lookAt(0, 0, 0);
	}
}
