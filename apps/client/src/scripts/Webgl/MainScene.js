import app from 'scripts/App.js';
import { Scene } from 'three';
import stateMixin from 'utils/stateMixin.js';
import RocketMesh from './Objects/RocketMesh.js';
import Stars from './Objects/Stars.js';
import TrackGroup from './Objects/TrackGroup.js';

/** @extends Scene */
export default class extends stateMixin(Scene) {
	constructor() {
		super();

		/** @type Map<string, RocketMesh> */
		this._rockets = new Map();
		this._currentRocketMesh = null;

		// this.add(new Game());
		this.add(new Stars());
	}

	onGameStart(currentPlayerId) {
		const trackMesh = new TrackGroup(app.core.gameServer.client.getTrack());
		Object.entries(app.core.gameServer.client.getRockets()).forEach(([playerId, rocket]) => {
			const isCurrentPlayer = playerId === currentPlayerId;
			const rocketMesh = new RocketMesh(playerId, isCurrentPlayer ? 0x00ff00 : 0xff0000);
			// rocketMesh.position.copy(rocket.position);

			if (isCurrentPlayer) this._currentRocketMesh = rocketMesh;
			else this._rockets.set(playerId, rocketMesh);
		});

		// const rocketCamera = new RocketCamera(rockets[0]);
		// this.rocketCamera = new RocketCamera();

		this.add(trackMesh, ...this._rockets.values(), this._currentRocketMesh);
	}

	onTick() {
		this._rockets?.forEach((rocket) => {
			rocket.position.fromArray(app.core.gameServer.client.getLatestServerStates().states[rocket.playerId].position);
		});
		this._currentRocketMesh?.position.fromArray(app.core.gameServer.client.getStates()[this._currentRocketMesh.playerId].position);
	}
}
