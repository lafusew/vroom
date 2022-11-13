import { Scene } from 'three';
import stateMixin from 'utils/stateMixin.js';
import Track from './Objects/Track.js';

/** @extends Scene */
export default class extends stateMixin(Scene) {
	constructor() {
		super();

		this.add(new Track());
	}
}
