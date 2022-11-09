import { RawShaderMaterial } from 'three';
import fs from './fragment.fs?hotShader';
import vs from './vertex.vs?hotShader';
export default class PathMaterial extends RawShaderMaterial {
	/**
	 *
	 * @param {*} params
	 */
	constructor(params = {}) {
		super(params);
		vs.use(this);
		fs.use(this);
	}
}
