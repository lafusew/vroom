import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { BufferGeometry, DepthTexture, Float32BufferAttribute, Mesh, OrthographicCamera, Vector2, WebGLRenderTarget } from 'three';
import globalUniforms from 'utils/globalUniforms.js';
import PostProcessingMaterial from './Shaders/PostProcessing/PostProcessingMaterial.js';

export default class {
	constructor(isWebGL2 = true) {
		state.register(this);

		this.renderTarget = this._createRenderTarget(true);

		this._material = new PostProcessingMaterial({
			defines: {
				USE_FXAA: !isWebGL2,
			},
			uniforms: {
				...globalUniforms,

				// Textures
				tDiffuse: { value: this.renderTarget.texture },
				tDepth: { value: this.renderTarget.depthTexture },

				// Viewport
				uResolution: { value: new Vector2() },
				uRatio: { value: app.tools.viewport.ratio },

				// Pixelation
				uPixelSize: { value: 2 },
			},
		});

		const geo = new BufferGeometry().setAttribute('position', new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)).setAttribute('uv', new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));

		this.quad = new Mesh(geo, this._material);

		this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
	}

	_createRenderTarget(withDepth = false) {
		const renderTarget = new WebGLRenderTarget(app.tools.viewport.width * app.tools.viewport.dpr, app.tools.viewport.height * app.tools.viewport.dpr, {
			samples: 3,
		});
		if (withDepth) {
			const depthTexture = new DepthTexture(app.tools.viewport.width * app.tools.viewport.dpr, app.tools.viewport.height * app.tools.viewport.dpr);
			renderTarget.depthTexture = depthTexture;
		}
		return renderTarget;
	}

	onAttach() {
		app.debug?.pane.add(this, 'PostProcessing', 0);
	}

	onResize({ width, height, dpr, ratio }) {
		this._material.uniforms.uResolution.value.set(width * dpr, height * dpr);
		this._material.uniforms.uRatio.value = ratio;

		this.renderTarget.setSize(width * dpr, height * dpr);
	}

	get uniforms() {
		return this._material.uniforms;
	}
}
