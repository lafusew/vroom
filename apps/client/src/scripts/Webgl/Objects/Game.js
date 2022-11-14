import app from 'scripts/App.js';
import { Group } from 'three';
import gameConfig from 'utils/gameConfig.js';
import { disposeMesh } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';
import trackConfig from 'utils/trackConfig.js';
import Path from './Path.js';
import Rocket from './Rocket.js';
import Track from './Track.js';

/** @extends Group */
export default class Game extends stateMixin(Group) {
	constructor() {
		super();

		this.splineName = trackConfig.splines.find((el) => el.default).name;
		this.rockets = [];

		this._createGame();
	}

	_createGame() {
		if (this.currentTrack) {
			this._dispose();
		}

		this.currentTrack = new Track(this.splineName);

		this.currentRocket = new Rocket(0, 0x00ff00, 'player');
		this.currentRocket.setInputs();
		this.rockets.push(this.currentRocket);

		let newRocket;

		for (let i = 1; i < gameConfig.numberOfPlayers; i++) {
			newRocket = new Rocket(i, 0xff0000, i);
			this.add(newRocket);
			this.rockets.push(newRocket);
		}

		this.add(this.currentTrack, this.currentRocket);
	}

	_checkCollisions(origins) {
		let distance;

		origins.forEach((origin) => {
			this.rockets.forEach((rocket) => {
				if (rocket !== origin) {
					distance = origin.mesh.position.distanceTo(rocket.mesh.position);

					if (distance < gameConfig.rocketBoundingRadius) {
						rocket.onCollision();
					}
				}
			});
		});
	}

	_dispose() {
		disposeMesh(this);
		this.clear();
		Path.dispose();
		this.currentRocket.dispose();
	}

	onAttach() {
		app.debug?.pane.add(this, 'Game', 0);
		app.debug?.pane.add(this, 'Track', 0);
	}

	onTick() {}

	onRender() {
		this._checkCollisions([this.currentRocket]);
	}
}
