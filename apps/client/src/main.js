// import { Client } from '@vroom/shared';
// import { io } from 'socket.io-client';
import app from 'scripts/App.js';
// import { nanoid } from 'nanoid';
import 'styles/app.scss';

// const socket = io('http://localhost:8888');

app.init();

/* TESTS TICKS GAME LOOP SERVER CLIENT
let roomId = 'okokok';
const playerId = nanoid(10);
const playerName = 'JUL';

let players = {
	[playerId]: playerName,
};

let client;

socket.emit('join', { roomId, playerId, playerName });

function send(input) {
	console.log('OUTCOMING INPUT: ', input);
	socket.emit('tick', client.getRoomId(), input);
}

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

const client2Div = document.createElement('div');
client2Div.style.position = 'absolute';
client2Div.style.left = '0px';
client2Div.style.top = '0px';
client2Div.style.width = '30px';
client2Div.style.height = '30px';
clientDiv.style.backgroundColor = 'green';
client2Div.style.zIndex = '100';
document.body.appendChild(client2Div);

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

const readyButton = document.createElement('button');
readyButton.innerHTML = 'READY';
readyButton.style.position = 'absolute';
readyButton.style.top = '0px';
readyButton.style.zIndex = '100';
readyButton.style.color = 'black';
readyButton.style.left = '100px';

readyButton.onclick = () => {
	socket.emit('ready', roomId);
};
document.body.appendChild(readyButton);

socket.on('updatedPlayerList', (playersMap) => {
	players = playersMap;
	console.log(players);
});

socket.on('tick', (state) => {
	console.log('INCOMING STATE: ', state);
	client.onServerState(state);
});

function test() {
	client.update();

	// const [c2x, c2y] = client.getStates()[joinedId].position;
	// client2Div.style.top = c2y + 'px';
	// client2Div.style.left = c2x + 'px';

	const [cx, cy] = client.getStates()[playerId].position;
	clientDiv.style.top = 400 + cy + 'px';
	clientDiv.style.left = 400 + cx + 'px';

	const [sx, sy] = client.getLatestServerStates().states[playerId].position;
	serverDiv.style.top = 400 + sy + 'px';
	serverDiv.style.left = 400 + sx + 'px';

	requestAnimationFrame(test);
}

socket.on('start', () => {
	client = Client.getInstance(roomId, playerId, players, send);
	test();
});

*/
