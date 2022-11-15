import { RawShaderMaterial } from 'three';
import fs from './fragment.fs?hotShader';
import vs from './vertex.vs?hotShader';

export default class PostProcessingMaterial extends RawShaderMaterial {
	/**
	 *
	 * @param {import("three").ShaderMaterialParameters} options
	 */
	constructor(options = {}) {
		super(options);
		vs.use(this);
		fs.use(this);
	}
}
