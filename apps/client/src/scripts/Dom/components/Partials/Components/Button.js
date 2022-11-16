import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

export default class Button extends Component {
	constructor(el) {
		super(el);
	}

	attach() {
		this.el.addEventListener('pointerdown', this._handleClick);
		this.el.addEventListener('pointerup', this._handleRelease);
	}

	detach() {
		this.el.removeEventListener('pointerdown', this._handleClick);
		this.el.removeEventListener('pointerup', this._handleRelease);
	}

	_handleClick() {
		app.tools.sound.play('button-pressed', 0.3);
	}

	_handleRelease() {
		app.tools.sound.play('button-released', 0.1);
	}
}
