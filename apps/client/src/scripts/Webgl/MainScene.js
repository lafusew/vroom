import app from 'scripts/App.js';
import { AmbientLight, MathUtils, Scene } from 'three';
import { computeEnvmap } from 'utils/misc.js';
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
		app.core.loader.add({ key: 'rocket' }, { key: 'envmap' });

		/** @type Map<string, RocketMesh> */
		this._rocketsMeshes = new Map();
		this._currentRocketMesh = null;

		this._currentRocket = null;

		this.add(new AmbientLight(0xffffff, 1));

		// this.add(new Game());
		this.add(new Stars());
		this.sky = new Sky();
		this.add(this.sky);
	}

	onGameStart(currentPlayerId) {
		this.environment = computeEnvmap(app.webgl.renderer, app.core.loader.getTexture('envmap'), true);

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
		this.sky.showAssets(trackMesh.track.splineName);
	}

	onTick({ dt }) {
		this._rocketsMeshes?.forEach((rocket) => {
			const rocketToUpdate = app.core.gameManager.gameServer.client.getRockets()[rocket.playerId];

			if (rocketToUpdate.isEjecting) {
				// rocketToUpdate.updatePosition(rocketToUpdate.progress);
				rocket.animateRocket(rocketToUpdate.ejectionDirection, rocketToUpdate.getPositionAt(rocketToUpdate.progress), rocketToUpdate.getTargetAt(rocketToUpdate.progress));
			} else {
				rocket.animation = null;
				rocketToUpdate.progress = MathUtils.damp(rocketToUpdate.progress, app.core.gameManager.gameServer.client.getLatestServerStates().states[rocket.playerId].progress, 10, dt);
				rocketToUpdate.speed = app.core.gameManager.gameServer.client.getLatestServerStates().states[rocket.playerId].speed;

				rocketToUpdate.updatePosition(rocketToUpdate.progress);

				// rocketToUpdate.computeCentrifugal(rocketToUpdate.progress);

				rocket.position.copy(rocketToUpdate.position);
				rocket.lookAt(rocketToUpdate.target);
			}
		});

		if (this._currentRocket) {
			if (this._currentRocket.isEjecting) {
				this._currentRocketMesh.animateRocket(
					this._currentRocket.ejectionDirection,
					this._currentRocket.getPositionAt(app.core.gameManager.gameServer.client.getRockets()[this._currentRocketMesh.playerId].progress),
					this._currentRocket.getTargetAt(app.core.gameManager.gameServer.client.getRockets()[this._currentRocketMesh.playerId].progress),
				);
			} else {
				this._currentRocketMesh.animation = null;
				this._currentRocketMesh?.position.copy(app.core.gameManager.gameServer.client.getRockets()[this._currentRocketMesh.playerId].position);
				this._currentRocketMesh?.lookAt(app.core.gameManager.gameServer.client.getRockets()[this._currentRocketMesh.playerId].target);
			}
		}

		// if (this._currentRocketMesh) {
		// 	const centrifugalV3 = this._currentRocket.target.clone().sub(this._currentRocket.position).cross(new Vector3(0, 1, 0).sub(this._currentRocket.position)).multiplyScalar(this._currentRocket.dot);

		// 	this.remove(this.centrifugalHelper);
		// 	this.centrifugalHelper = new ArrowHelper(centrifugalV3, this._currentRocket.position, centrifugalV3.length() * 2000000, 0x00ffff);
		// 	this.add(this.centrifugalHelper);

		// this.remove(this.angleHelper);
		// this.angleHelper = new ArrowHelper(this._currentRocket.angleV3, this._currentRocket.position, this._currentRocket.angleV3.length() * 2, 0x00ff00);
		// this.add(this.angleHelper);
		// }
	}
}
