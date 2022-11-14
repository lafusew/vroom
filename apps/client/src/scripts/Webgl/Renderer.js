import stateMixin from 'utils/stateMixin.js';

import { sRGBEncoding, WebGLRenderer } from 'three';
import { DEBUG } from 'utils/config.js';

/** @extends WebGLRenderer */
export default class extends stateMixin(WebGLRenderer) {
	constructor() {
		super({ antialias: false, powerPreference: 'high-performance' });
		this.outputEncoding = sRGBEncoding;
		this.autoClear = false;
		this.debug.checkShaderErrors = DEBUG;
	}

	onAttach() {}

	onResize({ width, height, dpr }) {
		this.setSize(width, height);
		this.setPixelRatio(dpr);
	}
}
