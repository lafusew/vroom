import Component from 'Dom/Abstract/Component.js';

export default class Credits extends Component {
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
