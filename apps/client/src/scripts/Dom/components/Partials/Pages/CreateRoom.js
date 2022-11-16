import Component from 'Dom/Abstract/Component.js';

export default class CreateRoom extends Component {
	constructor(el) {
		super(el);
	}

	open() {
		super.lockOrientation();
	}

	close() {
		super.unlockOrientation();
	}
}
