import Component from 'Dom/Abstract/Component.js';
import gsap from 'gsap';

export default class FullscreenButton extends Component {
	constructor(el) {
		super(el);
		this.tl = null;
	}

	open() {
		this.tl?.kill();
		this.tl = gsap.timeline();

		return this.tl;
	}
}
