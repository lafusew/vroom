import app from 'scripts/App.js';
import { PerspectiveCamera } from 'three';
import globalUniforms from 'utils/globalUniforms.js';
import stateMixin from 'utils/stateMixin.js';

const BASE_FOV = 45;

/** @extends PerspectiveCamera */
export default class extends stateMixin(PerspectiveCamera) {
	constructor() {
		super(BASE_FOV, app.tools.viewport.ratio, 0.1, 100);
		this.position.z -= 5;
		this.targetCamera = null;
	}

	onAttach() {
		app.debug?.pane.add(this, 'MainCamera', 0);
	}

	onResize({ ratio }) {
		this.aspect = ratio;
		this.updateProjectionMatrix();
	}

	onTick() {
		if (this.orbitControls || !this.targetCamera) return;

		this.fov = Math.abs(globalUniforms.uRocketSpeed.value) * 100 + BASE_FOV;
		this.updateProjectionMatrix();

		this.position.copy(this.targetCamera.position);
		this.quaternion.copy(this.targetCamera.quaternion);
	}
}
