import GameManager from './GameManager.js';
import Loader from './Loader.js';
import Ticker from './Ticker.js';

export default function () {
	const gameManager = new GameManager();
	const loader = new Loader();
	const ticker = new Ticker();

	return {
		gameManager,
		loader,
		ticker,
	};
}
