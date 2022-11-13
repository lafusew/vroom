import trackConfig from 'utils/trackConfig.js';

/**
 *
 * @param {*} pane
 * @param {import('Webgl/Objects/Path.js').default} instance
 */

export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	let options = {};
	trackConfig.splines.forEach((el) => (options[el.name] = el.name));

	folder
		.addInput(instance, 'splineName', {
			options,
		})
		.on('change', () => instance._createPaths());

	folder.addInput(trackConfig, 'numberOfPaths', { min: 0, max: 10, step: 1 }).on('change', () => instance._createPaths());
	folder.addInput(trackConfig, 'spaceBetweenPaths', { min: 0, max: 0.08 }).on('change', () => instance._createPaths());
	folder.addInput(trackConfig, 'distanceThreshold', { min: 0, max: 0.1 }).on('change', () => instance._createPaths());
	folder.addInput(trackConfig, 'smoothness', { min: 0, max: 1 }).on('change', () => instance._createPaths());

	return folder;
}
