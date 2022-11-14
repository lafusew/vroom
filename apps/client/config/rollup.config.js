import { resolve } from 'path';
import routes from '../src/scripts/Dom/routes.js';

export default {
	input: getRollupInputFromRoutes(routes),
};

function getRollupInputFromRoutes(routes) {
	const inputs = {};
	for (const route of routes) {
		inputs[route.name] = resolve(__dirname, route.file);
	}
	return inputs;
}
