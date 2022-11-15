// import { Client, Server } from '@vroom/shared';

import app from 'scripts/App.js';
import 'styles/app.scss';

app.init();

/* TESTS TICKS GAME LOOP SERVER CLIENT

const server = Server.getInstance();
const client = Client.getInstance();

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

function test() {
	client.update();
	server.update();

	const [cx, cy] = client.getPosition();
	clientDiv.style.top = cy + 'px';
	clientDiv.style.left = cx + 'px';

	const [sx, sy] = server.getPosition();
	serverDiv.style.top = sy + 'px';
	serverDiv.style.left = sx + 'px';

	requestAnimationFrame(test);
}

test();

*/
