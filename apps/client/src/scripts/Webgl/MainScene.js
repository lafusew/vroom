import app from 'scripts/App.js';
import { MathUtils, Scene } from 'three';
import stateMixin from 'utils/stateMixin.js';
import RocketCamera from './Objects/RocketCamera.js';
import RocketMesh from './Objects/RocketMesh.js';
import Sky from './Objects/Sky.js';
import Stars from './Objects/Stars.js';
import TrackGroup from './Objects/TrackGroup.js';

/** @extends Scene */
export default class extends stateMixin(Scene) {
	constructor() {
		super();

		/** @type Map<string, RocketMesh> */
		this._rocketsMeshes = new Map();
		this._currentRocketMesh = null;

		this._currentRocket = null;

		// this.add(new Game());
		this.add(new Stars());
		this.sky = new Sky();
		this.add(this.sky);
	}

	onGameStart(currentPlayerId) {
		const trackMesh = new TrackGroup(app.core.gameManager.gameServer.client.getTrack());
		Object.entries(app.core.gameManager.gameServer.client.getRockets()).forEach(([playerId, rocket]) => {
			const isCurrentPlayer = playerId === currentPlayerId;
			const rocketMesh = new RocketMesh(playerId, isCurrentPlayer ? 0x00ff00 : 0xff0000);
			// rocketMesh.position.copy(rocket.position);

			if (isCurrentPlayer) {
				this._currentRocketMesh = rocketMesh;
				this._currentRocket = rocket;
			} else {
				this._rocketsMeshes.set(playerId, rocketMesh);
			}
		});

		this.rocketCamera = new RocketCamera(this._currentRocket);
		app.webgl.camera.targetCamera = this.rocketCamera;

		this.add(trackMesh, ...this._rocketsMeshes.values(), this._currentRocketMesh);
		// TODO: uncomment when each track has its own assets
		// this.sky.showAssets(trackMesh.track.splineName);
	}

	onTick({ dt }) {
		this._rocketsMeshes?.forEach((rocket) => {
			const rocketToUpdate = app.core.gameManager.gameServer.client.getRockets()[rocket.playerId];

			rocketToUpdate.progress = MathUtils.damp(rocketToUpdate.progress, app.core.gameManager.gameServer.client.getLatestServerStates().states[rocket.playerId].progress, 10, dt);
			rocketToUpdate.speed = app.core.gameManager.gameServer.client.getLatestServerStates().states[rocket.playerId].speed;

			rocketToUpdate.updatePosition(rocketToUpdate.progress);
			rocketToUpdate.computeCentrifugal(rocketToUpdate.speed);
			rocketToUpdate.checkEjection(rocketToUpdate.speed);
			rocket.position.copy(rocketToUpdate.position);
		});
		this._currentRocketMesh?.position.copy(app.core.gameManager.gameServer.client.getRockets()[this._currentRocketMesh.playerId].position);
	}
}
