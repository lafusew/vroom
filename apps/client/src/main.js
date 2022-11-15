import { Client } from '@vroom/shared';
import app from 'scripts/App.js';
import { io } from 'socket.io-client';
import 'styles/app.scss';

const socket = io('http://localhost:8888');

console.log("😎 I'm the vite client");

app.init();

// /* TESTS TICKS GAME LOOP SERVER CLIENT

const client = Client.getInstance('test', (input) => {
	console.log('OUTCOMING INPUT: ', input);
	socket.emit('data', 'test', input);
});

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

function test() {
	client.update();

	const [cx, cy] = client.getPosition();
	clientDiv.style.top = cy + 'px';
	clientDiv.style.left = cx + 'px';

	const {
		position: [sx, sy],
	} = client.getLatestServerState();
	serverDiv.style.top = sy + 'px';
	serverDiv.style.left = sx + 'px';

	requestAnimationFrame(test);
}

socket.on('start', () => {
	test();
});

// */
