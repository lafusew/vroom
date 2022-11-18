// Priority 1 assets are assumed to be critical and are loaded before the attach event is emitted.

export const manifest = {
	rocket: { path: '/models/rocket.glb', priority: 1 },
	envmap: { path: '/textures/envmap.hdr', priority: 1 },
};
