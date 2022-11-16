/**
 *
 * @param {*} pane
 * @param {import('Webgl/PostProcessing.js').default} instance
 */

export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	folder.addInput(instance.uniforms.uPixelSize, 'value', { min: 1, max: 30 });

	return folder;
}
