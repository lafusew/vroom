/* This file needs to be interprated on both server and client sides
(Vite and Rollup are using it to handle the differents entry points).*/
export default [
	{ path: '/', name: 'index', file: '/index.html', data: {} },
	{ path: '/route', name: 'route', file: '/route.html', data: {} },
];
