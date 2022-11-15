import routes from 'Dom/routes.js';
import PageComponentsManager from './PageComponentsManager.js';
import Router from './Router.js';

export default function () {
	const router = new Router({ routes });
	const pageComponentsManager = new PageComponentsManager();
	return {
		router,
		pageComponentsManager,
	};
}
