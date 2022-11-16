import ComponentsManager from './Abstract/ComponentsManager.js';

export default class PageComponentsManager extends ComponentsManager {
	constructor() {
		super({ componentType: 'page' });
		this.createComponents();
	}

	onAttach() {
		this.initComponents();
		this.attachComponents();
	}

	/**
	 * @param {string} name
	 * @returns {import('./Abstract/PageComponent.js').default}
	 */
	get(name) {
		const el = document.getElementById(name);
		return super.get(el);
	}
}
