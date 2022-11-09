import state from 'scripts/State.js';

class Store {
	/** @type Store */
	static instance;
	constructor() {
		state.register(this);
		this._store = new Map();
		this._watchers = new Map();

		this._setDefaults();
	}

	_setDefaults() {}

	onAttach() {}

	get(id) {
		return this._store.get(id);
	}

	set(id, value) {
		if (value !== this._store.get(id)) {
			this._store.set(id, value);
			this._watchers.get(id)?.forEach((fn) => fn.call(this, value));
		}
		return this.get(id);
	}

	watch(id, fn) {
		if (this._watchers.has(id)) this._watchers.get(id).push(fn);
		else this._watchers.set(id, [fn]);
	}

	stopWatch(id, fn) {
		if (!this._watchers.has(id)) return;

		const watchers = this._watchers.get(id);
		const index = watchers.indexOf(fn);
		if (index > -1) watchers.splice(index, 1);
	}

	watching(id) {
		return this._watchers.has(id);
	}

	static getInstance() {
		if (!Store.instance) Store.instance = new Store();
		return Store.instance;
	}
}

const store = Store.getInstance();
export default store;
