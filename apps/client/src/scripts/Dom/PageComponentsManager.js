import ComponentsManager from './Abstract/ComponentsManager.js';

export default class PageComponentsManager extends ComponentsManager {
	constructor() {
		super({ componentType: 'page' });
		this.createComponents();
		this.initComponents();
		this.attachComponents();
	}
}
