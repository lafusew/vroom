import { Scene } from 'three';
import stateMixin from 'utils/stateMixin.js';
import Game from './Objects/Game.js';
import Stars from './Objects/Stars.js';

/** @extends Scene */
export default class extends stateMixin(Scene) {
	constructor() {
		super();

		this.add(new Game());
		this.add(new Stars());
	}
}
