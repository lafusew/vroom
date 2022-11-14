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

		this._createGame();
	}

	_createGame() {
		if (this.currentTrack) {
			this._dispose();
		}

		this.currentTrack = new Track(this.splineName);

		let lane = Math.floor(Math.random() * gameConfig.numberOfPlayers);
		this.currentRocket = new Rocket(lane);

		this.add(this.currentTrack, this.currentRocket);
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

	onRender() {}
}
