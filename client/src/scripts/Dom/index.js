import routes from 'Dom/routes.js';
import Router from './Router.js';

export default function () {
	const router = new Router({ routes });
	return {
		router,
	};
}
