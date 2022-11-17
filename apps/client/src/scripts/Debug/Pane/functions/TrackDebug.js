/**
 *
 * @param {*} pane
 * @param {import('Webgl/Objects/Game.js').default} instance
 */

import { trackConfig } from '@vroom/shared';

export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	folder.addInput(trackConfig, 'spaceBetweenPaths', { min: 0, max: 0.08 }).on('change', () => instance.currentTrack._createPaths());
	folder.addInput(trackConfig, 'distanceThreshold', { min: 0, max: 0.1 }).on('change', () => instance.currentTrack._createPaths());
	folder.addInput(trackConfig, 'smoothness', { min: 0, max: 1 }).on('change', () => instance.currentTrack._createPaths());

	return folder;
}
