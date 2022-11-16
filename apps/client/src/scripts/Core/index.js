import GameServer from './GameServer.js';
import Loader from './Loader.js';
import Ticker from './Ticker.js';

export default function () {
	const gameServer = new GameServer();
	const loader = new Loader();
	const ticker = new Ticker();

	return {
		gameServer,
		loader,
		ticker,
	};
}
