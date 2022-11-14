/**
 *
 * @param {*} pane
 * @param {import('Webgl/Objects/Game.js').default} instance
 */

import gameConfig from 'utils/gameConfig.js';
import trackConfig from 'utils/trackConfig.js';

export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	let options = {};
	trackConfig.splines.forEach((el) => (options[el.name] = el.name));

	folder
		.addInput(instance, 'splineName', {
			options,
		})
		.on('change', () => instance._createGame());

	folder.addInput(gameConfig, 'numberOfPlayers', { min: 1, max: 10, step: 1 }).on('change', () => instance._createGame());

	return folder;
}
