import { Client } from '@vroom/shared';
import { io } from 'socket.io-client';
import app from 'scripts/App.js';
import 'styles/app.scss';

const socket = io('http://localhost:8888');

console.log("😎 I'm the vite client");

app.init();

// /* TESTS TICKS GAME LOOP SERVER CLIENT

const client = Client.getInstance(
	'test',
	(input) => {
		console.log('OUTCOMING INPUT: ', input);
		socket.emit('data', 'test', input);
	},
	0,
);

socket.emit('join', 'test');

//create a div element that can be moved around in js
const clientDiv = document.createElement('div');
clientDiv.id = 'client';
clientDiv.style.position = 'absolute';
clientDiv.style.left = '0px';
clientDiv.style.top = '0px';
clientDiv.style.width = '30px';
clientDiv.style.height = '30px';
clientDiv.style.backgroundColor = 'red';
clientDiv.style.zIndex = '100';
document.body.appendChild(clientDiv);

const serverDiv = document.createElement('div');
serverDiv.id = 'client';
serverDiv.style.position = 'absolute';
serverDiv.style.left = '0px';
serverDiv.style.top = '0px';
serverDiv.style.width = '30px';
serverDiv.style.height = '30px';
serverDiv.style.backgroundColor = 'blue';
serverDiv.style.zIndex = '99';
document.body.appendChild(serverDiv);

socket.on('data', (state) => {
	console.log('INCOMING STATE:', state);
	client.onServerState(state);
});

let lastUpdate = Date.now();

function test() {
	const now = Date.now();
	const delta = (now - lastUpdate) / 1000;
	lastUpdate = now;

	client.update(delta, { speed: 1, currentLane: 0 });

	// const states = client.getStates();
	// clientDiv.style.top = 10 + 'px';
	// clientDiv.style.left = states[client.getPlayerId()].position.x + 'px';

	// const serverStates = client.getLatestServerState();
	// serverDiv.style.top = 20 + 'px';
	// serverDiv.style.left = serverStates[client.getPlayerId()].position.x + 'px';

	requestAnimationFrame(test);
}

socket.on('start', () => {
	test();
});

// */
