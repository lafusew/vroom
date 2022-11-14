import express from 'express';
import http from 'http';
import { Sockets } from './modules/sockets.js';

const app = express();
const PORT = 8888;
const HTTP_SERVER = http.createServer(app)

Sockets
  .getInstance(HTTP_SERVER, PORT)
  .start();