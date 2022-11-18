// Priority 1 assets are assumed to be critical and are loaded before the attach event is emitted.

const skyAssets = Object.fromEntries(
	Object.entries(import.meta.glob('../../../public/assets/images/sky/**.png', { as: 'url', eager: true })).map(([key, value]) => {
		return [key.split('/').pop().split('.')[0], { path: value.replace('/public/assets', ''), priority: 1 }];
	}),
);

export const manifest = {
	...skyAssets,
	rocket: { path: '/models/rocket.glb', priority: 1 },
	envmap: { path: '/textures/envmap.hdr', priority: 1 },
};
