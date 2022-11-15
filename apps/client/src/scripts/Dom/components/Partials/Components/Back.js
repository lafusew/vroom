import Component from 'Dom/Abstract/Component.js';
import app from 'scripts/App.js';

export default class Back extends Component {
	constructor(el) {
		super(el);
	}

	attach() {
		this.el.addEventListener('click', this._goBack);
	}

	detach() {
		this.el.removeEventListener('click', this._goBack);
	}

	_goBack() {
		app.dom.pageComponentsManager.get('index').backPage();
	}
}