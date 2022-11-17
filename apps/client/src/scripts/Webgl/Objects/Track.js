import { trackConfig } from '@vroom/shared';
import store from 'scripts/Store.js';
import { Group, Vector3 } from 'three';
import { STORE_KEYS } from 'utils/constants.js';
import gameConfig from 'utils/gameConfig.js';
import { disposeMesh, mod } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';
import Path from './Path.js';

/** @extends Group */
export default class Track extends stateMixin(Group) {
	constructor(splineName) {
		super();

		this.splineName = splineName;
		this.paths = [];

		store.set(STORE_KEYS.CURRENT_TRACK, this);

		this._createPaths();
	}

	_createPaths() {
		if (this.children.length > 0) {
			this._dispose();
		}

		const spline = trackConfig.splines.find((el) => el.name === this.splineName);
		const nbPoints = spline.points.length;
		spline.normals = [];

		let previousPoint, nextPoint, tangent, normal, path;

		for (let i = 0; i < nbPoints; i++) {
			previousPoint = spline.points[mod(i - 1, nbPoints)];
			nextPoint = spline.points[mod(i + 1, nbPoints)];
			tangent = nextPoint.clone().sub(previousPoint).normalize();

			normal = new Vector3(0, -1, 0);
			normal.cross(tangent);
			spline.normals.push(normal);
		}

		for (let i = 0; i < gameConfig.numberOfPlayers; i++) {
			path = new Path(1 + i * trackConfig.spaceBetweenPaths, spline, i === 0);
			this.paths.push(path);
			this.add(path);
		}
	}

	_dispose() {
		disposeMesh(this);
		this.clear();
		Path.dispose();
	}

	onAttach() {}

	onTick() {}

	onRender() {}
}
