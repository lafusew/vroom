import Fullscreen from './Fullscreen.js';
import Inputs from './Inputs.js';
import Sound from './Sound.js';
import Viewport from './Viewport.js';

export default function () {
	const viewport = new Viewport();
	const inputs = new Inputs();
	const fullscreen = new Fullscreen();
	const sound = new Sound();

	return {
		viewport,
		inputs,
		fullscreen,
		sound,
	};
}
