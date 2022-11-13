import { BufferGeometry, CatmullRomCurve3, Group, Line, Mesh, Raycaster, TubeGeometry, Vector3 } from 'three';
import { mod } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';
import trackConfig from 'utils/trackConfig.js';
import PathMaterial from 'Webgl/Shaders/Path/PathMaterial.js';

export default class Path extends stateMixin(Group) {
	static allowedIntersections = [];

	static dispose() {
		Path.allowedIntersections = [];
	}

	constructor(scale = 1, spline, original = false) {
		super();

		this.pathScale = scale;
		this.spline = spline;
		this.original = original;

		this.raycaster = new Raycaster();
		this.raycaster.params.Line.threshold = 0.001;
		this.intersects = [];

		this._createPath();
	}

	_createPath() {
		let points = [];
		const segments = [];

		let newPoint, segment, origin, target, localIntersects, validIntersects, nbOfPointsToRemove, nextPoint, distance, allowed;

		this.spline.points.forEach((point, i) => {
			// Compute new point coords based on the scale
			newPoint = point.clone();
			newPoint.add(this.spline.normals[i].clone().multiplyScalar(this.pathScale - 1));
			points.push(newPoint);

			// Group points into path segments
			if (i > 0) {
				segment = new Line(new BufferGeometry().setFromPoints([points[i - 1], newPoint]));
				segment.name = `${i - 1}`;
				segments.push(segment);
			}
		});

		// Add the last segment between the last point and the first one
		segment = new Line(new BufferGeometry().setFromPoints([points[points.length - 1], points[0]]));
		segment.name = `${this.spline.points.length}`;
		segments.push(segment);

		segments.forEach((seg, i) => {
			// Recreate segment to use it as vec3
			origin = new Vector3(seg.geometry.attributes.position.array[0], seg.geometry.attributes.position.array[1], seg.geometry.attributes.position.array[2]);
			target = new Vector3(seg.geometry.attributes.position.array[3], seg.geometry.attributes.position.array[4], seg.geometry.attributes.position.array[5]);
			segment = target.clone().sub(origin);

			// Cast rays from the segment origin to the segment target to find intersections and crop them
			this.raycaster.set(origin, target.sub(origin).normalize());
			localIntersects = this.raycaster.intersectObjects(segments);

			validIntersects = localIntersects
				.filter(
					(el) =>
						el.distance <= segment.length() && // Limit Ray length to segment length
						el.object.name !== seg.name && // Do not take into account the segment itself
						el.object.name !== segments[(i + 1) % segments.length].name && // Nor the next segment
						el.object.name !== segments[mod(i - 1, segments.length)].name && // Nor the previous segment
						this.intersects.map((el) => el.origin).includes(parseInt(el.object.name)) === false, // Avoid duplication
				)
				.map((el) => ({ origin: i, target: el }));
			this.intersects.push(...validIntersects);

			// Set an 'Allow' flag on original intersections
			if (this.original) {
				Path.allowedIntersections.push(...validIntersects.map((intersect) => ({ origin: intersect.origin, target: intersect.target.object.name })));
			}
		});

		let tempPoints = [...points];

		this.intersects.forEach((intersect, index) => {
			allowed = false;
			Path.allowedIntersections.forEach((allowedIntersect) => {
				if (!allowed) {
					allowed = intersect.origin === allowedIntersect.origin && intersect.target.object.name === allowedIntersect.target;
				}
			});

			if (!allowed) {
				nbOfPointsToRemove = Math.abs(parseInt(intersect.target.object.name) - intersect.origin);
				for (let i = 0; i < nbOfPointsToRemove; i++) {
					// Replace all points to remove by 'undefined' to keep the index
					tempPoints.splice(intersect.origin + 1 + i + index, 1, undefined);
				}

				// Add new intersection point
				tempPoints.splice(intersect.origin + 1 + index, 0, intersect.target.point);
			}
		});

		points = tempPoints.filter((el) => el !== undefined);

		tempPoints = [...points];

		// Remove points that are too close to each other
		tempPoints.forEach((point, i) => {
			nextPoint = tempPoints[(i + 1) % tempPoints.length];
			distance = point.distanceTo(nextPoint);
			if (distance < trackConfig.distanceThreshold) {
				tempPoints.splice(i, 1);
			}
		});

		points = tempPoints.filter((el) => el !== undefined);

		this.geometry = new TubeGeometry(new CatmullRomCurve3(points, true, 'catmullrom', trackConfig.smoothness), 1000, 0.003, 4, true);
		this.material = new PathMaterial();
		this.mesh = new Mesh(this.geometry, this.material);
		this.add(this.mesh);
	}

	onAttach() {}

	onTick() {}

	onRender() {}
}
