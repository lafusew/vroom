/**
 *
 * @param {*} pane
 * @param {import('Webgl/Objects/RocketCamera.js').default} instance
 */

export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	// const camHelper = new CameraHelper(instance);
	// app.webgl.scene.add(camHelper);

	// camHelper.update();
	// camHelper.visible = true;
	// state.on(EVENTS.TICK, () => {
	// 	camHelper.update();
	// });

	return folder;
}
