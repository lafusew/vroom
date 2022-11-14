import Loader from './Loader.js';
import Ticker from './Ticker.js';

export default function () {
	const loader = new Loader();
	const ticker = new Ticker();

	return {
		loader,
		ticker,
	};
}
