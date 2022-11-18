import gsap from 'gsap';
import app from 'scripts/App.js';
import { Group, MeshStandardMaterial } from 'three';
import { disposeMesh } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';

/** @extends Group */
export default class RocketMesh extends stateMixin(Group) {
	constructor(playerId, color) {
		super();

		this.playerId = playerId;

		// const geometry = new BoxGeometry(0.03, 0.03, 0.03);
		const material = new MeshStandardMaterial({ envMapIntensity: 0.9, roughness: 0.2, metalness: 0.62 });
		const mesh = app.core.loader.getModel('rocket').children[0].clone();
		mesh.material = material;
		// mesh.material.emissive = new Color(0xffffff);
		// mesh.material.envmap = app.core.loader.getTexture('envmap');
		app.debug?.pane.add(mesh.material, 'StandardMaterial', 0);

		this.add(mesh);

		this.animation = null;
	}

	animateRocket(direction, newPos, targetPos) {
		if (this.animation) return;

		this.animation = gsap
			.timeline()
			.to(
				this.position,
				{
					y: '+=.5',
					duration: 0.25,
					ease: 'power2.in',
				},
				0,
			)
			.to(
				this.scale,
				{
					x: 0,
					y: 0,
					z: 0,
					duration: 0.25,
					ease: 'power2.in',
				},
				0,
			)
			.set(
				this.position,
				{
					x: newPos.x,
					y: newPos.y,
					z: newPos.z,
				},
				0.25,
			)
			.set(
				this.scale,
				{
					x: 0,
					y: 0,
					z: 0,
				},
				0.25,
			)
			.add(() => this.lookAt(targetPos), 0.25)
			.to(
				this.scale,
				{
					x: 1,
					y: 1,
					z: 1,
					duration: 0.5,
					ease: 'power2.inOut',
				},
				0.5,
			);
		// .to(
		// 	this.scale,
		// 	{
		// 		x: 0,
		// 		y: 0,
		// 		z: 0,
		// 		duration: 0.25,
		// 		ease: 'power3.out',
		// 	},
		// 	0,
		// );
		// .to(this.position, {
		// 	x: targetPos.x,
		// 	y: targetPos.y,
		// 	z: targetPos.z,
		// 	duration: 0.25,
		// 	ease: 'power3.in',
		// });
	}

	_dispose() {
		disposeMesh(this);
		this.clear();
	}

	// onAttach() {}

	onTick() {
		// if (!this.targetPosition) return;
		// this.position.x = MathUtils.damp(this.position.x, this.targetPosition.x, 10, dt);
		// this.position.y = MathUtils.damp(this.position.y, this.targetPosition.y, 10, dt);
		// this.position.z = MathUtils.damp(this.position.z, this.targetPosition.z, 10, dt);
		// this.position.fromArray(app.core.gameServer.client.getLatestServerStates().states[this.playerId].position);
	}

	// onRender() {}
}
