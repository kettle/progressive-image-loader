'use strict';

const {EventEmitter} = require('events');
const queue = require('queue');

/***
 * @class QueueLoader
 * @augments {EventEmitter}
 *
 * @classdesc Progressively load images from a queue.
 *
 * @param {object} options - Object instantiation options
 * @param {String} options.loadedAttribute - Data attribute to add to element when image has loaded
 * @param {String} options.selectorAttribute - Data attribute to indicate image (src or background-image) should load progressively
 * @param {String} options.animateClass - Class to apply to element if image should fade in (animate) when loaded
 * @param {Element} options.container - Container element to limit scope of query against loadedAttribute
 * @param {Number} options.concurrency - Number of images to download concurrently
 * @param {Boolean} options.animate - Whether or not to fade in images once loaded
 * @param {Number} options.timeout - Timeout (in ms) before image loading fails and element appears without image-loaded callback firing
 */
class QueueLoader extends EventEmitter {
	constructor(options) {
		super();

		this.options = {
			...QueueLoader.DEFAULTS,
			...options
		};

		this.isRunning = false;
		this.elements = [];
		this.queue = null;
	}

	/**
	 * Create the queue and begin loading images
	 */
	load() {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;

		this._setupQueue();

		this.queue.on('end', () => {
			this.emit(QueueLoader.EVENTS.COMPLETE);
			this.elements.length = 0;
			this.isRunning = false;
		});

		this.elements.forEach(element => {
			/* istanbul ignore else */
			if (this.options.animate) {
				element.classList.add(this.options.animateClass);
			}

			this.queue.push(() => this._loadNextImage(element));
		});

		requestAnimationFrame(() => this.queue.start());
	}

	/**
	 * Create the queue and set options based on instance options
	 * @private
	 * @param  {Boolean} autostart - Whether or not queue should autorun when any jobs exist
	 */
	_setupQueue(autostart) {
		autostart = autostart || false;

		this.queue = queue({
			concurrency: this.options.concurrency,
			autostart
		});

		/* istanbul ignore else */
		if (typeof this.options.timeout === 'number') {
			this.queue.timeout = this.options.timeout;
			/* istanbul ignore next */
			this.queue.on('timeout', next => next());
		}

		this.elements = [...this.options.container.querySelectorAll(`[${this.options.selectorAttribute}]`)];
	}

	/**
	 * Retrieve an element's image src (via src attribute, or via CSS background image)
	 * @param  {Element} element - Element to progressively load
	 * @return {Promise} - Resolves with source attribute when determined, null if cannot be determined
	 */
	_getImageSrc(element) {
		return new Promise((resolve => {
			if (element.hasAttribute('src')) {
				return resolve(element.getAttribute('src'));
			}

			let {currentStyle} = element;

			/* istanbul ignore else */
			if (!currentStyle) {
				currentStyle = window.getComputedStyle(element, false);
			}

			if (currentStyle.backgroundImage.indexOf('url(') === 0) {
				return resolve(currentStyle.backgroundImage.slice(4, -1).replace(/["']/g, ''));
			}

			return resolve(null);
		}));
	}

	/**
	 * Creates a new image element in memory and loads the passed src URL as its source
	 * @private
	 * @param  {String} src - URL of image to progressively load
	 * @return {Prommise} - Resolves when image is loaded, null if cannot be loaded
	 */
	_loadImage(src) {
		return new Promise(resolve => {
			if (!src) {
				return resolve(null);
			}

			function onImageLoad() {
				this.removeEventListener('load', onImageLoad);
				return resolve(this);
			}

			function onImageError() {
				this.removeEventListener('load', onImageLoad);
				return resolve(null);
			}

			const img = new Image();
			img.addEventListener('load', onImageLoad, false);
			img.addEventListener('error', onImageError, false);
			img.src = src;
		});
	}

	/**
	 * Makes an element visisble (presumably once its image had loaded, but can be triggered beforehand if timeout occurs)
	 * @param {Element} element - Element to be progressively loaded
	 * @return {Promise} - Resolves on next animation frame after element's selectorAttribute attribute is removed
	 */
	setVisible(element) {
		return new Promise(resolve => {
			requestAnimationFrame(() => {
				element.removeAttribute(this.options.selectorAttribute);
				return resolve();
			});
		});
	}

	/**
	 * Emits an event when an element image is loaded, also applies animation class so that image fades in (if instance animates)
	 * @param  {Element} element - Element to load
	 * @return {Promise} - Resolves when loaded event is emitted and loaded attribute is applied (if animating)
	 */
	_handleImageLoad(element) {
		return new Promise(resolve => {
			requestAnimationFrame(() => {
				this.emit(QueueLoader.EVENTS.IMG_LOADED, element);

				/* istanbul ignore else */
				if (this.options.animate) {
					element.setAttribute(this.options.loadedAttribute, '');
				}

				return resolve();
			});
		});
	}

	/**
	 * Prepare element for progressive image loading
	 * @private
	 * @param  {Element} element - Element to progressively load
	 * @return {Promise} - Resolves when image is loaded and is revealed
	 */
	async _loadNextImage(element) {
		await this._loadAndSetVisible(element);
		return this._handleImageLoad(element);
	}

	/**
	 * Initializes progressively loaded element, retrieves its source, and attempts to load its source
	 * @param  {Element} element - Element to progressively load
	 * @return {Promise} - Resolves when image is loaded
	 */
	async _loadAndSetVisible(element) {
		await this.setVisible(element);
		const src = await this._getImageSrc(element);
		return this._loadImage(src);
	}
}

QueueLoader.DEFAULTS = {
	loadedAttribute: 'data-progressive-image-loaded',
	selectorAttribute: 'data-progressive-image',
	animateClass: 'progressive-image-animated',
	container: document.body,
	concurrency: 8,
	animate: true,
	timeout: null
};

QueueLoader.EVENTS = {
	IMG_LOADED: 'image-loaded',
	COMPLETE: 'complete'
};

module.exports = QueueLoader;
