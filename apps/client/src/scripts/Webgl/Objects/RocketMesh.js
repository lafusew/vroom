import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import { disposeMesh } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';

/** @extends Group */
export default class RocketMesh extends stateMixin(Group) {
	constructor(playerId, color) {
		super();
		this.playerId = playerId;

		const geometry = new BoxGeometry(0.03, 0.03, 0.03);
		const material = new MeshBasicMaterial({ color });
		this.add(new Mesh(geometry, material));
	}

	_dispose() {
		disposeMesh(this);
		this.clear();
	}

	// onAttach() {}

	onTick() {
		// this.position.fromArray(app.core.gameServer.client.getLatestServerStates().states[this.playerId].position);
	}

	// onRender() {}
}
