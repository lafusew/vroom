import app from 'scripts/App.js';
import { Group, NearestFilter, Sprite, Vector3 } from 'three';
import globalUniforms from 'utils/globalUniforms.js';
import { disposeMesh } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';
import SpritesheetMaterial from 'Webgl/Shaders/Spritesheet/SpritesheetMaterial.js';

const assets = [
	{
		name: '481286969',
		position: new Vector3(-0.508309006690979, 0.2, 0.29137536883354187),
		scale: new Vector3(0.09404473006725311, 0.09404473006725311, 0.09404473006725311),
	},
	{
		name: '2981774759',
		position: new Vector3(-0.0009729862213134766, 0.2, -0.6341700553894043),
		scale: new Vector3(0.1403348594903946, 0.1403348594903946, 0.1403348594903946),
	},
	{
		name: '3524759752',
		position: new Vector3(0.48674482107162476, 0.2, 0.47766355872154236),
		scale: new Vector3(0.30616670846939087, 0.30616670846939087, 0.30616670846939087),
	},
];

/** @extends Group */
export default class Sky extends stateMixin(Group) {
	constructor() {
		super();
		this._load();
		this.assets = new Map();
	}

	_load() {
		assets.forEach((asset) => {
			app.core.loader.add({ key: asset.name });
		});
	}

	showAssets(trackName) {
		this._dispose();
		if (trackName === 'triangle 3D') {
			app.tools.sound.play('intro', 0.3, true);
			assets.forEach((asset) => {
				const texture = app.core.loader.getTexture(asset.name);
				if (texture) {
					texture.magFilter = NearestFilter;

					const material = new SpritesheetMaterial({
						uniforms: {
							...globalUniforms,
							tSpritesheet: { value: texture },
							uSpritesCount: { value: 50 },
							uScale: { value: asset.scale },
						},
					});

					const sprite = new Sprite(material);
					sprite.position.copy(asset.position);
					this.add(sprite);
				}
			});
		}
	}

	_dispose() {
		disposeMesh(this);
		this.clear();
	}

	onAttach() {}

	onTick() {}

	onRender() {}
}
