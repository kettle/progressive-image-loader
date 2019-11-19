![100% test coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

# progressiveImageLoader
> Progressively load images from a queue, or based on viewport proximity.

This module exports two classes to provide progressive image loading for image elements and elements with a CSS background-image.
Both classes use the [`queue`](https://npmjs.com/package/queue) module to provide queue management and concurrency.
`QueueLoader` retrieves all DOM elements with the data attribute passed as the `selectorAttribute` option, and processes the queue 
in the order the elements were retrieved.

`ScrollLoader` augments `QueueLoader`, uses the [`ScrollTrack`](https://npmjs.com/package/scroll-track) module, and differs from `QueueLoader` 
by only adding elements to the queue when they enter the viewport. This behavior can be modified to begin loading when an element is a certain 
distance away from the viewport by passing an offset value (which is passed to the element's `ScrollElement` instance).


### QueueLoader
Loads images progressively using a non-prioritized queue.
Generally, elements towards the top of the DOM will load first as they are the first elements added to the queue.
But this cannot be assumed to always be the case.

#### Options
Passed to constructor at instantiation.

| option | type | description |
|---|---|---|
| `loadedAttribute` | `String` | Data attribute to add to element when image has loaded |
| `selectorAttribute` | `String` | Data attribute to indicate image (src or background-image) should load progressively |
| `animateClass` | `String` | Class to apply to element if image should fade in (animate) when loaded |
| `container` | `Element` | Container element to limit scope of query against loadedAttribute |
| `concurrency` | `Number` | Number of images to download concurrently |
| `animate` | `Boolean` | Whether or not to fade in images once loaded |
| `timeout` | `Number` | Timeout (in ms) before image loading is assumed to have failed, forcing element to appear without image-loaded callback firing |

#### Properties
Public instance properties.

| property | returns | description |
|---|---|---|
| `isRunning` | `Boolean` | Whether or not the instance is currently preloading images |
| `elements` | `Array` | Collection of elements matching `selectorAttribute` option |
| `queue` | `Queue` | Reference the the instance's [queue](https://npmjs.com/package/queue) |

#### Methods
Public instance methods.

| method | arguments | description |
|---|---|---|
| `load()` |  | Begin progressively loading images |
| `setVisible(element)` | `Element` | Manually make a progressively loaded image appear |

#### Events
Instances fire the following events:

| event | arguments | description |
|---|---|---|
| `image-loaded` | `Element` | Fires when an element's image is loaded |
| `complete` |  | Fires when entire queue has been processed |


### ScrollLoader
Loads images progressively based on an element's proximity to the visible viewport.
Elements are still loaded into a queue to limit concurrency, but the queue will prioritize elements that have recently entered the viewport.

#### Options
All `QueueLoader` options plus `offset`:

| option | type | description |
|---|---|---|
| `offset` | `Object` | Offset option passed to ScrollElement to determine when image loading begins |
| `loadedAttribute` | `String` | Data attribute to add to element when image has loaded |
| `selectorAttribute` | `String` | Data attribute to indicate image (src or background-image) should load progressively |
| `animateClass` | `String` | Class to apply to element if image should fade in (animate) when loaded |
| `container` | `Element` | Container element to limit scope of query against loadedAttribute |
| `concurrency` | `Number` | Number of images to download concurrently |
| `animate` | `Boolean` | Whether or not to fade in images once loaded |
| `timeout` | `Number` | Timeout (in ms) before image loading is assumed to have failed, forcing element to appear without image-loaded callback firing |


#### Properties
All `QueueLoader` properties plus `loaded`:

| property | returns | description |
|---|---|---|
| `loaded` | `Number` | Number of elements loaded |
| `isRunning` | `Boolean` | Whether or not the instance is currently preloading images |
| `elements` | `Array` | Collection of elements matching `selectorAttribute` option |
| `queue` | `Queue` | Reference the the instance's [queue](https://npmjs.com/package/queue) |


#### Methods
All `QueueLoader` methods:

| method | arguments | description |
|---|---|---|
| `load()` |  | Begin progressively loading images |
| `setVisible(element)` | `Element` | Manually make a progressively loaded image appear |


#### Events
All `QueueLoader` events:

| event | arguments | description |
|---|---|---|
| `image-loaded` | `Element` | Fires when an element's image is loaded |
| `complete` |  | Fires when entire queue has been processed |


## Installation
Install via npm:

```sh
$ npm i progressive-image-loader
```


## Usage
```javascript
import {QueueLoader, ScrollLoader} from 'progressive-image-loader';

// Begin loading all images with a 5 second timeout
const queueLoader = new QueueLoader({timeout: 5000});
queueLoader.on('image-loaded', el => console.log(el));
queueLoader.on('complete', () => console.log('images loaded'));
queueLoader.load();

// Begin loading image when they are within 1 viewport of entering the viewport
const scrollLoader = new ScrollLoader({offset: '100vh'});
scrollLoader.on('image-loaded', el => console.log(el));
scrollLoader.on('complete', () => console.log('images loaded'));
scrollLoader.load();
```

### Required CSS
You will need to include CSS on the page to support the functionality offered by these classes.
The CSS should progressively enhance, therefore hiding of progressively-loaded images should be disabled
if JavaScript is not supported. Assuming you have an initial `no-js` class on the `html` element, and replace 
it with a `js` class, the following CSS works assuming you use the default selector options:

```css
html.js [data-progressive-image],
html.js [data-progressive-image] * {
	background-image: none !important;
	-webkit-mask-image: none !important;
	mask-image: none !important;
	opacity: 0;
}

html.js .progressive-image-animated,
html.js .progressive-image-animated * {
	will-change: opacity;
	opacity: 0;
	-webkit-transition: opacity 1s ease-out;
	transition: opacity 1s ease-out;
}

html.js .progressive-image-animated[data-progressive-image-loaded],
html.js .progressive-image-animated[data-progressive-image-loaded] *,
html.js .progressive-image-animated *[data-progressive-image-loaded],
html.js .progressive-image-animated *[data-progressive-image-loaded] * {
	opacity: 1;
}
```

#### Generating Customized CSS
You can generate the required SCSS/CSS using non-default values by running the `css` npm script, or by 
calling `$(npm bin)/progressive-image-loader-css` from the project this module is installed to.  This will load a 
series of questions via an interactive prompt allowing you to customize the selectors and data attributes 
used by the instance, the progressive enhancement HTML class, the output format (css or scss), and the 
output location.

```shell
$ $(npm bin)/progressive-image-loader-css
```

```shell
$ npm run css
```
