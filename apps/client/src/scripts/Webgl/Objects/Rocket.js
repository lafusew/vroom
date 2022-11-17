import store from 'scripts/Store.js';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { STORE_KEYS } from 'utils/constants.js';
import gameConfig from 'utils/gameConfig.js';
import stateMixin from 'utils/stateMixin.js';
import trackConfig from 'utils/trackConfig.js';

/** @extends Group */
export default class Rocket extends stateMixin(Group) {
	constructor(laneNumber, color, name) {
		super();

		this.color = color;
		this.name = name;

		this.laneNumber = laneNumber;
		this.curve = store.get(STORE_KEYS.CURRENT_TRACK).paths[this.laneNumber].curve;
		this.speed = Math.random() * 0.1 + 0.1;
		this.target = new Vector3();
		this.progress = 0;

		this.directionHelper = null;
		this.centrifugalHelper = null;
		this.angleHelper = null;

		this.paths = store.get(STORE_KEYS.CURRENT_TRACK).paths;

		this._init();
	}

	_init() {
		this.geometry = new BoxGeometry(0.03, 0.03, 0.03);
		this.material = new MeshBasicMaterial({ color: this.color });
		this.mesh = new Mesh(this.geometry, this.material);
		this.add(this.mesh);
	}

	setInputs() {
		window.addEventListener('keydown', this._handleInputs);
	}

	// tkt Titou ça sera clean un jour, ça va bien se passer jte jure
	_handleInputs = (e) => {
		if (e.code === 'ArrowDown') {
			this.speed -= 0.1;
		} else if (e.code === 'ArrowUp') {
			this.speed += 0.1;
		} else if (e.code === 'Space') {
			this.speed = 0;
		} else if (e.code === 'ArrowLeft') {
			this._changeLane(-1);
		} else if (e.code === 'ArrowRight') {
			this._changeLane(1);
		}
	};

	_changeLane(direction) {
		let newLane = this.laneNumber + direction;
		if (newLane >= 0 && newLane < gameConfig.numberOfPlayers) {
			this.laneNumber += direction;
			this.laneNumber = Math.min(Math.max(this.laneNumber, 0), gameConfig.numberOfPlayers - 1);
			this.curve = store.get(STORE_KEYS.CURRENT_TRACK).paths[this.laneNumber].curve;
			this._checkNeighbourLanes(direction);
		}
	}

	_checkNeighbourLanes(direction) {
		this.rightDir = this.target.clone().sub(this.mesh.position).cross(new Vector3(0, 1, 0).sub(this.mesh.position));
		this.rightDir.y = this.mesh.position.y;
		this.rightDir.normalize();

		let newPos = this.mesh.position.clone().add(this.rightDir.clone().multiplyScalar(trackConfig.spaceBetweenPaths * direction));

		let nearestDistance = Infinity;
		let nearestIndex = 0;

		let distance, progressDiff;

		this.paths[this.laneNumber].spacedPoints.forEach((point, index) => {
			distance = point.distanceTo(newPos);
			progressDiff = Math.abs((this.progress % 1) - index / this.paths[this.laneNumber].spacedPoints.length);

			if (distance < nearestDistance && progressDiff < gameConfig.progressDifferenceThreshold) {
				nearestDistance = distance;
				nearestIndex = index;
			}
		});

		this.progress = nearestIndex / this.paths[this.laneNumber].spacedPoints.length;
	}

	onFingerSpeed(speed) {
		this.speed = speed * 5;
	}

	onCollision() {
		this.progress = 0;
	}

	_updatePosition() {
		this.progress += 0.001 * this.speed;
		this.mesh.position.copy(this.curve.getPointAt(this.progress % 1));
		this.target = this.curve.getPointAt((this.progress + 0.001) % 1);
		this.mesh.lookAt(this.target);
	}

	_computeCentrifugal() {
		this.directionV3 = this.target.clone().sub(this.mesh.position);
		this.angleV3 = this.curve.getPointAt((this.progress + 0.01) % 1).sub(this.mesh.position);
		this.dot = this.directionV3.x * -this.angleV3.z + this.directionV3.z * this.angleV3.x;

		this.centrifugalV3 = this.target.clone().sub(this.mesh.position).cross(new Vector3(0, 1, 0).sub(this.mesh.position)).multiplyScalar(this.dot);

		// this.remove(this.centrifugalHelper);
		// this.centrifugalHelper = new ArrowHelper(this.centrifugalV3, this.mesh.position, Math.abs(this.dot) * 2000, 0x00ffff);
		// this.add(this.centrifugalHelper);
	}

	_checkEjection() {
		let ejected = Math.abs(this.dot) * this.speed * 1000 > gameConfig.ejectionThreshold;
		if (ejected) console.log('ejected');
	}

	dispose() {
		window.removeEventListener('keydown', this._handleInputs);
	}

	onAttach() {}

	onTick() {}

	onRender() {
		this._updatePosition();
		this._computeCentrifugal();
		this._checkEjection();
	}
}
