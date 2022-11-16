import Inputs from './Inputs.js';
import Sound from './Sound.js';
import Viewport from './Viewport.js';

export default function () {
	const viewport = new Viewport();
	const inputs = new Inputs();
	const sound = new Sound();

	return {
		viewport,
		inputs,
		sound,
	};
}
