/**
 *
 * @param {*} pane
 * @param {import('Dom/Router.js').default} instance
 */

import routes from 'Dom/routes.js';

export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	routes.forEach((route) => {
		const button = folder.addButton({ title: route.name });
		button.on('click', () => instance.goTo(route.path));
	});

	return folder;
}
