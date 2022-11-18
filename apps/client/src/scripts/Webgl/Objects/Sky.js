import app from 'scripts/App.js';
import { Group, NearestFilter, Sprite } from 'three';
import globalUniforms from 'utils/globalUniforms.js';
import { disposeMesh } from 'utils/misc.js';
import stateMixin from 'utils/stateMixin.js';
import SpritesheetMaterial from 'Webgl/Shaders/Spritesheet/SpritesheetMaterial.js';

/** @extends Group */
export default class Sky extends stateMixin(Group) {
	constructor() {
		super();
		this._load();
		this.assets = new Map();
	}

	async _load() {
		const assets = await app.core.loader.loadModel('skyAssets', '/models/sky-assets.glb');
		assets.children.forEach((track) => {
			this.assets.set(track.name, track.children);
			track.children.forEach((asset) => {
				app.core.loader.add({ key: asset.name });
			});
		});
	}

	showAssets(trackName) {
		this._dispose();
		if (this.assets.get(trackName)) {
			this.assets.get(trackName)?.forEach((asset) => {
				const texture = app.core.loader.getTexture(asset.name);
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
