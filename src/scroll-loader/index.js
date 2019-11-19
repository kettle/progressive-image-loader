'use strict';

const scrollTrack = require('scroll-track');
const QueueLoader = require('./../queue-loader');

/**
 * @class ScrollLoader
 * @augments {QueueLoader}
 * @augments {EventEmitter}
 *
 * @classdesc Progressively load images based on viewport proximity.
 *
 * @param {object} options - Object instantiation options
 * @param {Object} options.offset - Offset option passed to ScrollElement to determine when image loading begins
 * @param {String} options.loadedAttribute - Data attribute to add to element when image has loaded
 * @param {String} options.selectorAttribute - Data attribute to indicate image (src or background-image) should load progressively
 * @param {String} options.animateClass - Class to apply to element if image should fade in (animate) when loaded
 * @param {Element} options.container - Container element to limit scope of query against loadedAttribute
 * @param {Number} options.concurrency - Number of images to download concurrently
 * @param {Boolean} options.animate - Whether or not to fade in images once loaded
 * @param {Number} options.timeout - Timeout (in ms) before image loading fails and element appears without image-loaded callback firing
 */
class ScrollLoader extends QueueLoader {
	constructor(options) {
		super();

		this.options = {
			...QueueLoader.DEFAULTS,
			...ScrollLoader.DEFAULTS,
			...options
		};

		this.loaded = 0;
	}

	/**
	 * Create the queue, instantiates ScrollElement trackers for each, and begins loading the images
	 */
	load() {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;

		this._setupQueue(true);

		this.queue.on('success', () => {
			this.loaded += 1;

			if (this.loaded === this.elements.length) {
				this.emit(QueueLoader.EVENTS.COMPLETE);
				this.loaded = 0;
				this.elements.length = 0;
				this.isRunning = false;
			}
		});

		requestAnimationFrame(() => {
			this.elements.forEach(element => {
				const tracker = scrollTrack.create(element, this.options.offset);

				/* istanbul ignore else */
				if (this.options.animate) {
					element.classList.add(this.options.animateClass);
				}

				tracker.once('enter-viewport', scrollElement => {
					this.queue.push(() => {
						const {element} = scrollElement;
						scrollElement.destroy();
						return this._loadNextImage(element);
					});
				});
			});
		});
	}
}

ScrollLoader.DEFAULTS = {
	offset: {
		top: 0,
		bottom: 0
	}
};

module.exports = ScrollLoader;
