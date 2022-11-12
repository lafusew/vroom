import app from 'scripts/App.js';
import store from 'scripts/Store.js';
import { ArrowHelper, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import stateMixin from 'utils/stateMixin.js';

/** @extends Group */
export default class Rocket extends stateMixin(Group) {
	constructor() {
		super();

		this.curve = store.get('currentTrack').paths[0].curve;
		this.speed = 0.5;
		this.target = new Vector3();

		this.directionHelper = null;
		this.centrifugalHelper = null;
		this.angleHelper = null;

		this._init();
	}

	_init() {
		this.geometry = new BoxGeometry(0.1, 0.1, 0.1);
		this.material = new MeshBasicMaterial({ color: 0x00ff00 });
		this.mesh = new Mesh(this.geometry, this.material);
		this.add(this.mesh);
	}

	_updatePosition(et) {
		this.mesh.position.copy(this.curve.getPointAt((et * 0.0001 * this.speed) % 1));
		this.target = this.curve.getPointAt((et * 0.0001 * this.speed + 0.001) % 1);
		this.mesh.lookAt(this.target);
	}

	_computeCentrifugal(et) {
		this.directionV3 = this.target.clone().sub(this.mesh.position);
		this.angleV3 = this.curve.getPointAt((et * 0.0001 * this.speed + 0.01) % 1).sub(this.mesh.position);
		this.dot = this.directionV3.x * -this.angleV3.z + this.directionV3.z * this.angleV3.x;

		this.centrifugalV3 = this.target.clone().sub(this.mesh.position).cross(new Vector3(0, 1, 0).sub(this.mesh.position)).multiplyScalar(this.dot);

		// this.remove(this.directionHelper, this.angleHelper, this.centrifugalHelper);
		this.remove(this.centrifugalHelper);
		// this.directionHelper = new ArrowHelper(directionV3, this.mesh.position, 0.5, 0x0000ff);
		// this.angleHelper = new ArrowHelper(angleV3, this.mesh.position, 0.5, 0xffff00);
		this.centrifugalHelper = new ArrowHelper(this.centrifugalV3, this.mesh.position, Math.abs(this.dot) * 2000, 0x00ffff);
		// this.add(this.directionHelper, this.angleHelper, this.centrifugalHelper);
		this.add(this.centrifugalHelper);
	}

	onAttach() {
		// app.debug?.pane.add(this, 'Rocket', 0);
	}

	onTick() {}

	onRender(time) {
		this._updatePosition(time.et);
		this._computeCentrifugal(time.et);
	}
}
