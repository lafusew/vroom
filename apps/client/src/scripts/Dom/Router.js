import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { EVENTS } from 'utils/constants.js';

export default class Router {
	constructor({ routes = [] } = {}) {
		state.register(this);
		this.routes = routes;

		this.currentRoute = null;
		this.loadedRoutes = new Map();

		this._init();
		document.addEventListener('click', this._onNavClick);
		window.addEventListener('popstate', this._onPopState);
		window.history.scrollRestoration = 'manual';
	}

	onAttach() {
		app.debug?.pane.add(this, 'Router', 2);
	}

	async goTo(pathName) {
		const route = this._findRoute(pathName);
		if (!route) return;

		await this._triggerRouteChange(route, false);
	}

	_init() {
		const needsDomUpdate = !document.location.pathname.includes('.html') && document.location.pathname !== '/';
		const route = this._findRoute(document.location.pathname);
		if (!route) return;

		this._replaceState(route);
		this.currentRoute = route;

		if (needsDomUpdate) this._updateDom(this.currentRoute.name);
		else this.loadedRoutes.set(this.currentRoute.name, document.getElementById(this.currentRoute.name));
	}

	async _triggerRouteChange(route, transition = false, pushState = true) {
		if (this.currentRoute) this._replaceState(this.currentRoute, window.scrollY);

		if (transition) console.log(); //TODO: Handle transition before

		this.currentRoute = route;
		if (pushState) this._pushState(this.currentRoute);

		await this._updateDom(this.currentRoute.name);

		if (transition) console.log(); //TODO: Handle transition after
	}

	async _updateDom(routeName) {
		const pageContent = await this._loadContent(routeName);
		app.$root.innerHTML = '';
		app.$root.appendChild(pageContent);
	}

	_pushState(route) {
		history.pushState({ path: route.path, scrollPosition: 0 }, '', this._createURL(route.path));
	}

	_replaceState(route, scrollPosition = 0) {
		history.replaceState({ path: route.path, scrollPosition }, '', this._createURL(route.path));
	}

	_findRoute(pathName) {
		if (pathName.includes('.html')) pathName = pathName.replace('.html', '').replace('index', '');
		return this.routes.find((route) => route.path === pathName);
	}

	async _loadContent(name) {
		if (this.loadedRoutes.has(name)) return this.loadedRoutes.get(name);
		const response = await fetch(`/${name}.html`);
		const html = await response.text();
		const div = document.createElement('div');
		div.innerHTML = html.trim();
		this.loadedRoutes.set(name, div.querySelector(`#${name}`));
		return this.loadedRoutes.get(name);
	}

	_createURL(path) {
		const url = new URL(path, document.location.origin);
		url.hash = document.location.hash;
		url.search = document.location.search;
		return url;
	}

	_onNavClick = (e) => {
		const href = e.target?.closest('[href]')?.href;
		const pathName = this._createURL(href).pathname;
		const route = this._findRoute(pathName);
		if (!route) return;

		e.preventDefault();
		if (this.currentRoute === route) state.emit(EVENTS.SCROLL_TOP);
		else this._triggerRouteChange(route, false);
	};

	_onPopState = (e) => {
		if (!e.state) return;
		const route = this._findRoute(e.state.path);
		if (!route) return;

		this._triggerRouteChange(route, false, false);
	};
}
