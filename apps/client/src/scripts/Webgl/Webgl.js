import app from 'scripts/App.js';
import state from 'scripts/State.js';
import globalUniforms from 'utils/globalUniforms.js';
import MainCamera from './MainCamera.js';
import MainScene from './MainScene.js';

import Renderer from './Renderer.js';

export default class {
	constructor() {
		state.register(this);

		this._isAttached = false;

		this.renderer = new Renderer();
		this.scene = new MainScene();
		this.camera = new MainCamera();
	}

	onAttach() {
		this._isAttached = true;
		app.$wrapper.prepend(this.renderer.domElement);
	}

	onResize() {}

	onTick({ et }) {
		globalUniforms.uTime.value = et;
	}

	onRender() {
		if (!this._isAttached) return;
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
	}
}
