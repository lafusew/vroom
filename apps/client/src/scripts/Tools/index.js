import Inputs from './Inputs.js';
import Viewport from './Viewport.js';

export default function () {
	const viewport = new Viewport();
	const inputs = new Inputs();

	return {
		viewport,
		inputs,
	};
}
