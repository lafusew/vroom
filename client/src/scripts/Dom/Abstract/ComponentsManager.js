/** @type {Record<string, any>} */
const componentsModules = import.meta.glob(['../components/**/*.js', '../Abstract/Component.js', '../Abstract/LayoutView.js'], {
	eager: true,
	import: 'default',
});
const componentsKeys = Object.keys(componentsModules);

import app from 'scripts/App.js';
import state from 'scripts/State.js';

export default class ComponentsManager {
	constructor({ componentType = 'component', parentEl = app.$app } = {}) {
		state.register(this);
		this._componentType = componentType.toLowerCase();
		this._parentEl = parentEl;

		/** @type {Map<HTMLElement, import('./Component.js').default>}*/
		this._components = new Map();
	}

	/** @type HTMLElement[] */
	get _elements() {
		return Array.from(this._parentEl.querySelectorAll(`[data-${this._componentType}]`));
	}

	createComponents() {
		this._elements.forEach((element) => {
			const componentName = element.dataset[this._componentType];
			const componentModule = componentsKeys.find((key) => key.split('/').pop().split('.')[0] === componentName);
			if (componentModule && !this._components.has(element)) {
				const component = new componentsModules[componentModule](element);
				component.parentEl = this._parentEl;
				this._components.set(element, component);
			}
		});
	}

	initComponents() {
		this._components.forEach((component) => component.init());
	}

	attachComponents() {
		this._components.forEach((component) => component.attach());
	}

	detachComponents() {
		this._components.forEach((component) => component.detach());
	}

	get(el) {
		return this._components.get(el);
	}
}
