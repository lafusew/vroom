import ComponentsManager from './ComponentsManager.js';

export default class PageComponent {
	/** @param {HTMLElement} el */
	constructor(el) {
		this.el = el;
		this.componentsManager = new ComponentsManager({ parentEl: el });
		this.componentsManager.createComponents();
	}

	init() {
		this.componentsManager.initComponents();
	}

	attach() {
		this.componentsManager.attachComponents();
	}

	open() {}

	close() {}
}
