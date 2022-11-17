import Component from 'Dom/Abstract/Component.js';
import store from 'scripts/Store.js';
import { STORE_KEYS } from 'utils/constants.js';
import trackConfig from 'utils/trackConfig.js';

export default class TrackButton extends Component {
	static activeTrackName = null;

	constructor(el) {
		super(el);
		if (TrackButton.activeTrackName === null) {
			el.classList.add('active');
			TrackButton.activeTrackName = el.children[0].innerText;
			store.set(STORE_KEYS.TRACK_NAME, this.el.children[0].innerText);
		}
		this.coverImg = document.querySelector('#track-cover-img');
		this.pathImg = document.querySelector('#track-path-img');
		this._updateImages();
	}

	attach() {
		this.el.addEventListener('pointerdown', this._handleClick);
	}

	detach() {
		this.el.removeEventListener('pointerdown', this._handleClick);
	}

	_handleClick = () => {
		[...this.el.parentElement.children].forEach((element) => {
			element.classList.remove('active');
		});
		this.el.classList.add('active');
		TrackButton.activeTrackName = this.el.children[0].innerText;
		store.set(STORE_KEYS.TRACK_NAME, this.el.children[0].innerText);
		this._updateImages();
	};

	_updateImages = () => {
		let trackObj = trackConfig.splines.find((el) => el.name === TrackButton.activeTrackName);
		this.coverImg.src = '/assets/images/tracks/' + trackObj.coverSrc;
		this.pathImg.src = '/assets/images/tracks/' + trackObj.pathGifSrc;
	};
}
