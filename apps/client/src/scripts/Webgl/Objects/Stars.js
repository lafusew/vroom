import app from 'scripts/App.js';
import { BufferAttribute, BufferGeometry, Group, Points } from 'three';
import stateMixin from 'utils/stateMixin.js';
import StarsMaterial from 'Webgl/Shaders/Stars/StarsMaterial.js';

/** @extends Group */
export default class Stars extends stateMixin(Group) {
	constructor() {
		super();
	}

	onAttach() {
		this.geometry = new BufferGeometry();
		const count = 500;

		const positions = new Float32Array(count * 3);
		const params = new Float32Array(count * 3);

		for (let i = 0; i < count * 3; i += 3) {
			positions[i + 0] = (Math.random() - 0.5) * 10;
			positions[i + 1] = (Math.random() - 0.5) * 10;
			positions[i + 2] = (Math.random() - 0.5) * 10;

			params[i + 0] = Math.random();
			params[i + 1] = Math.random();
			params[i + 2] = Math.random();
		}

		this.geometry.setAttribute('position', new BufferAttribute(positions, 3));
		this.geometry.setAttribute('aParams', new BufferAttribute(params, 3));
		this.material = new StarsMaterial({
			uniforms: {
				uSize: { value: app.webgl.renderer.getPixelRatio() },
				uScale: { value: 20 },
				uRadius: { value: 1 },
				uRatio: { value: 4 },
			},
			transparent: true,
		});
		this.mesh = new Points(this.geometry, this.material);
		this.add(this.mesh);
	}

	onTick() {}

	onRender() {}
}
