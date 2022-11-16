import { Track } from "./entities/Track.js";
import Client from "./modules/client.js";
import Server from "./modules/server.js";
import { Event, InputPayload, Players, StatesPayload } from "./types/index.js";
import trackConfig from "./utils/trackConfig.js";

const TRACKS = Object.fromEntries(trackConfig.splines.map((spline) => [spline.name, new Track(spline.name)]));

export { Client, Server, TRACKS };
export type { InputPayload, StatesPayload, Players, Event, Track };

// const server = Server.getInstance();
// const client = Client.getInstance();

// //create a canvas element
// const canvas = document.createElement('canvas');
// canvas.id = 'canvas';
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// canvas.style.width = '100%';
// canvas.style.height = '100%';

// const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// document.body.appendChild(canvas);

// function test() {
//   client.update();
//   server.update();

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const [cx, cy] = client.getPosition();
//   ctx.fillStyle = 'red';
//   ctx.ellipse(cx, cy, 10, 10, 0, 0, Math.PI * 2);
//   ctx.fill();

//   const [sx, sy] = server.getPosition();
//   ctx.fillStyle = 'blue';
//   ctx.ellipse(sx, sy, 10, 10, 0, 0, Math.PI * 2);
//   ctx.fill();

//   // requestAnimationFrame(test);
// }

// test()
