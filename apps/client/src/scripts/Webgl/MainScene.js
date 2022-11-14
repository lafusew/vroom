import { Scene } from 'three';
import stateMixin from 'utils/stateMixin.js';
import Game from './Objects/Game.js';

/** @extends Scene */
export default class extends stateMixin(Scene) {
	constructor() {
		super();

		this.add(new Game());
	}
}
