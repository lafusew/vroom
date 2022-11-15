import Fullscreen from './Fullscreen.js';
import Inputs from './Inputs.js';
import Viewport from './Viewport.js';

export default function () {
	const viewport = new Viewport();
	const inputs = new Inputs();
	const fullscreen = new Fullscreen();

	return {
		viewport,
		inputs,
		fullscreen,
	};
}
