import classes from 'styles/tools/colors.scss?raw';
let i = 0;

const EVENTS = {
	LOADER_PROGRESS: i++,

	ATTACH: i++,
	RESIZE: i++,

	ROUTE_CHANGE: i++,
	SCROLL_TOP: i++,

	INPUT_SPEED: i++,
	INPUT_LANE: i++,

	JOIN_ROOM: i++,
	GAME_READY: i++,
	GAME_START: i++,

	TICK: i++,
	RENDER: i++,

	MOUSE_MOVE: i++,
	POINTER_UP: i++,
	POINTER_DOWN: i++,
};

const EVENTS_MAP = Object.fromEntries(
	Object.entries(EVENTS).map(([key, value]) => [
		value,
		`on${key
			.toLowerCase()
			.split('_')
			.map((str) => str.charAt(0).toUpperCase() + str.slice(1))
			.join('')}`,
	]),
);

const STORE_KEYS = {
	PSEUDO: i++,
	TRACK_NAME: i++,
	ROOM_ID: i++,
	// CURRENT_TRACK: i++,
};

const cssColors = classes
	.trim()
	.replaceAll('{', '')
	.replaceAll('}', '')
	.replaceAll('\n', '')
	.split(';')
	.map((entry) => entry.split(':').map((inner) => inner.trim().replace('-', '_').replace('$', '').toUpperCase()));
cssColors.pop();

const COLORS = Object.fromEntries(cssColors);

export { EVENTS, COLORS, EVENTS_MAP, STORE_KEYS };
