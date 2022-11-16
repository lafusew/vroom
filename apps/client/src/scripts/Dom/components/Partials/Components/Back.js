import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

export default class Back extends Component {
	constructor(el) {
		super(el);
	}

	attach() {
		this.el.addEventListener('click', this._goBack);
		this.el.addEventListener('pointerdown', this._handlePointerDown);
		this.el.addEventListener('pointerup', this._handlePointerUp);
	}

	detach() {
		this.el.removeEventListener('click', this._goBack);
		this.el.removeEventListener('pointerdown', this._handlePointerDown);
		this.el.removeEventListener('pointerup', this._handlePointerUp);
	}

	_goBack() {
		app.dom.pageComponentsManager.get('index').backPage();
	}

	_handlePointerDown = () => {
		this.el.classList.add('pressed');
	};

	_handlePointerUp = () => {
		this.el.classList.remove('pressed');
	};
}