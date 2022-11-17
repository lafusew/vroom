/**
 *
 * @param {*} pane
 * @param {import('Webgl/Objects/Game.js').default} instance
 */

import { trackConfig } from '@vroom/shared';
import gameConfig from 'utils/gameConfig.js';

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
	folder.addInput(gameConfig, 'ejectionThreshold', { min: 0, max: 1 });

	return folder;
}
