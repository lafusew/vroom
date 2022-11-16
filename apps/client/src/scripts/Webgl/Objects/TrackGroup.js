import { Group, Mesh, TubeGeometry } from 'three';
import { disposeMesh } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';
import PathMaterial from 'Webgl/Shaders/Path/PathMaterial.js';

/** @extends Group */
export default class TrackGroup extends stateMixin(Group) {
	constructor(track) {
		super();

		this.track = track;

		this.track.paths.forEach((path) => {
			const geometry = new TubeGeometry(path.curve, 1000, 0.003, 4, true);
			const material = new PathMaterial();
			this.add(new Mesh(geometry, material));
		});
	}

	_dispose() {
		disposeMesh(this);
		this.clear();
	}

	// onAttach() {}

	// onTick() {}

	// onRender() {}
}
