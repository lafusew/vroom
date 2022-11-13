import app from 'scripts/App.js';
import { Group, Vector3 } from 'three';
import { disposeMesh, mod } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';
import trackConfig from 'utils/trackConfig.js';
import Path from './Path.js';

/** @extends Group */
export default class Track extends stateMixin(Group) {
	constructor() {
		super();

		this.splineName = trackConfig.splines.find((el) => el.default).name;

		this._createPaths();
	}

	_createPaths() {
		if (this.children.length > 0) {
			this._dispose();
		}

		const spline = trackConfig.splines.find((el) => el.name === this.splineName);
		const nbPoints = spline.points.length;
		spline.normals = [];

		let previousPoint, nextPoint, tangent, normal;

		for (let i = 0; i < nbPoints; i++) {
			previousPoint = spline.points[mod(i - 1, nbPoints)];
			nextPoint = spline.points[mod(i + 1, nbPoints)];
			tangent = nextPoint.clone().sub(previousPoint).normalize();

			normal = new Vector3(0, -1, 0);
			normal.cross(tangent);
			spline.normals.push(normal);
		}

		for (let i = 0; i < trackConfig.numberOfPaths; i++) {
			this.add(new Path(1 + i * trackConfig.spaceBetweenPaths, spline, i === 0));
		}
	}

	_dispose() {
		disposeMesh(this);
		this.clear();
		Path.dispose();
	}

	onAttach() {
		app.debug?.pane.add(this, 'Track', 0);
	}

	onTick() {}

	onRender() {}
}
