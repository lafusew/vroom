import app from 'scripts/App.js';
import store from 'scripts/Store.js';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import stateMixin from 'utils/stateMixin.js';

/** @extends Group */
export default class Rocket extends stateMixin(Group) {
	constructor() {
		super();

		this.curve = store.get('currentTrack').paths[0].curve;
		this.speed = Math.random();

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
	}

	onAttach() {
		// app.debug?.pane.add(this, 'Rocket', 0);
	}

	onTick() {}

	onRender(time) {
		this._updatePosition(time.et);
	}
}
