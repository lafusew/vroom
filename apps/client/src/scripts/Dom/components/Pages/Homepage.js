import PageComponent from 'Dom/Abstract/PageComponent.js';

export default class Homepage extends PageComponent {
	/** @param {HTMLElement} el */
	constructor(el) {
		super(el);
		this.el = el;
		this.currentPageName = null;
		this.isRotateModeOn = false;
		this.pageHistory = [];
		this.pages = new Map();

		/// #if DEBUG
		this.pageNames = [];
		this.url = new URLSearchParams(location.search);
		if (this.url.has('skipUI')) {
			this.el.classList.add('hidden');
		}
		/// #endif
	}

	init() {
		super.init();
		[...this.componentsManager._components].filter((component) => {
			if (component[0].classList.contains('page')) {
				this.pages.set(component[1].constructor.name, component[1]);

				/// #if DEBUG
				this.pageNames.push(component[1].constructor.name);
				/// #endif
			}
		});
	}

	attach() {
		super.attach();
		this.showPage('Landing');

		/// #if DEBUG
		if (this.url.has('page') && this.pageNames.includes(this.url.get('page'))) {
			this.showPage(this.url.get('page'));
		}
		/// #endif
	}

	detach() {
		super.detach();
	}

	open() {
		this.el.classList.remove('hidden');
	}

	close() {
		this.el.classList.add('hidden');
	}

	showPage(pageName, addToHistory = true) {
		let nextPage = this.pages.get(pageName);
		if (nextPage) {
			let currentPage = this.pages.get(this.currentPageName);
			currentPage?.el.classList.add('hidden');
			currentPage?.close();
			this.currentPageName = pageName;
			addToHistory && this.pageHistory.push(pageName);
			nextPage.el.classList.remove('hidden');
			nextPage.open();
		}
	}

	backPage() {
		this.pageHistory.pop();
		this.showPage(this.pageHistory[this.pageHistory.length - 1], false);
	}

	setRotateMode(mode) {
		this.isRotateModeOn = mode;
		let rotatePage = this.pages.get('Rotate');
		let currentPage = this.pages.get(this.currentPageName);

		if (this.isRotateModeOn) {
			currentPage?.el.classList.add('hidden');
			currentPage?.close();
			rotatePage?.el.classList.remove('hidden');
			rotatePage?.open();
		} else {
			rotatePage?.el.classList.add('hidden');
			rotatePage?.close();
			currentPage?.el.classList.remove('hidden');
			currentPage?.open();
		}
	}
}
