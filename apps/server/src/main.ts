import express from 'express';
import http from 'http';
import { Sockets } from './modules/sockets.js';
import cors from 'cors';

const app = express();


const PORT = 8888;
const HTTP_SERVER = http.createServer(app)

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

Sockets
  .getInstance(HTTP_SERVER, PORT)
  .init();
