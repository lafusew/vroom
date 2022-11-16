import { Howl, Howler } from 'howler';
import state from 'scripts/State.js';

const sources = Object.entries(import.meta.glob('../../assets/sounds/music/**.mp3', { as: 'url' }))
	.map(([key, value]) => {
		return [key, value.name, 'music'];
	})
	.concat(
		Object.entries(import.meta.glob('../../assets/sounds/ui/**.mp3', { as: 'url' })).map(([key, value]) => {
			return [key, value.name, 'ui'];
		}),
	)
	.map(([name, src, type]) => {
		return {
			name: name.split('/').pop().split('.')[0],
			src: src.replace('../..', 'src'),
			type,
		};
	});

export default class Sound {
	constructor() {
		state.register(this);

		this.active = false;
		this.sounds = new Map();

		window.addEventListener('click', this._load);
	}

	_load = () => {
		sources.forEach((source) => {
			this.sounds.set(source.name, new Howl({ src: source.src, loop: source.type === 'music' }));
		});
		window.removeEventListener('click', this._load);
		this.active = true;
	};

	toggleSound() {
		this.active = !this.active;
		Howler.mute(!this.active);
	}

	play(name, volume = 1) {
		const search = this.sounds.get(name);
		search?.volume(volume);
		search?.play();

		const result = search ? search : undefined;
		return result;
	}
}
