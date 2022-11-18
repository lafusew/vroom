/**
 *
 * @param {*} pane
 * @param {import('three').MeshStandardMaterial} instance
 */

export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	folder.addInput(instance, 'envMapIntensity', { min: 0, max: 1 });
	folder.addInput(instance, 'roughness', { min: 0, max: 1 });
	folder.addInput(instance, 'metalness', { min: 0, max: 1 });
	folder.addInput(instance, 'color', {
		color: { type: 'float' },
	});
	folder.addInput(instance, 'emissive', {
		color: { type: 'float' },
	});

	return folder;
}
