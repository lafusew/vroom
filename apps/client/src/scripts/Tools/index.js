import Inputs from './Inputs.js';
import Mouse from './Mouse.js';
import Viewport from './Viewport.js';

export default function () {
	const mouse = new Mouse();
	const viewport = new Viewport();
	const inputs = new Inputs();

	return {
		mouse,
		viewport,
		inputs,
	};
}
