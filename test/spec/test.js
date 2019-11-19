'use strict';

// Tape - https://github.com/substack/tape
const tape = require('tape');
const {QueueLoader, ScrollLoader} = require('../..');

const queueMarkup = '<style>@charset "UTF-8";html{-webkit-text-size-adjust:100%}body{margin:0;padding:0}body *{font-family:arial,helvetica,sans-serif}h1{font-weight:400;text-align:center;margin:20px auto}section{height:100vh;border-bottom:1px solid #000;border-top:1px solid #000}.image{float:left;margin:20px 50px}.image-1{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=0);width:125px;height:225px;background-size:125px 225px}.image-2{width:125px;height:225px;background-size:125px 225px}.image-3{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=2);width:125px;height:225px;background-size:125px 225px}.image-4{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/dontexistfile_example_JPG_500kB.jpg?t=3);width:125px;height:225px;background-size:125px 225px}.image-5{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=4);width:125px;height:225px;background-size:125px 225px}.image-5{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=5);width:125px;height:225px;background-size:125px 225px}.image-6{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=6);width:125px;height:225px;background-size:125px 225px}.image-7{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=7);width:125px;height:225px;background-size:125px 225px}.image-8{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=8);width:125px;height:225px;background-size:125px 225px}.image-9{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=10);width:125px;height:225px;background-size:125px 225px}.image-10{width:125px;height:225px}html.progressive-image.js [data-progressive-image],html.progressive-image.js [data-progressive-image] *{background-image:none!important;-webkit-mask-image:none!important;mask-image:none!important;opacity:0}html.progressive-image.js .progressive-image-animated,html.progressive-image.js .progressive-image-animated *{will-change:opacity;opacity:0;-webkit-transition:opacity 1s ease-out;transition:opacity 1s ease-out}html.progressive-image.js .progressive-image-animated [data-progressive-image-loaded],html.progressive-image.js .progressive-image-animated [data-progressive-image-loaded] *,html.progressive-image.js .progressive-image-animated[data-progressive-image-loaded],html.progressive-image.js .progressive-image-animated[data-progressive-image-loaded] *{opacity:1}</style><figure class="image image-1" data-progressive-image></figure>	<figure class="image image-2" data-progressive-image></figure>	<figure class="image image-3" data-progressive-image></figure>	<figure class="image image-4" data-progressive-image></figure>	<figure class="image image-5" data-progressive-image></figure>	<figure class="image image-6" data-progressive-image></figure>	<figure class="image image-7" data-progressive-image></figure>	<figure class="image image-8" data-progressive-image></figure>	<figure class="image image-9" data-progressive-image></figure>	<img src="https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=120" class="image image-10" data-progressive-image>';
const scrollMarkup = '<style>@charset "UTF-8";html{-webkit-text-size-adjust:100%}body{margin:0;padding:0}body *{font-family:arial,helvetica,sans-serif}h1{font-weight:400;text-align:center;margin:20px auto}section{height:100vh;border-bottom:1px solid #000;border-top:1px solid #000}.image{float:left;margin:20px 50px}.image-1{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=0);width:125px;height:225px;background-size:125px 225px}.image-2{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=1);width:125px;height:225px;background-size:125px 225px}.image-3{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=2);width:125px;height:225px;background-size:125px 225px}.image-4{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=3);width:125px;height:225px;background-size:125px 225px}.image-5{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=4);width:125px;height:225px;background-size:125px 225px}.image-5{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=5);width:125px;height:225px;background-size:125px 225px}.image-6{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=6);width:125px;height:225px;background-size:125px 225px}.image-7{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=7);width:125px;height:225px;background-size:125px 225px}.image-8{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=8);width:125px;height:225px;background-size:125px 225px}.image-9{background-image:url(https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_500kB.jpg?t=10);width:125px;height:225px;background-size:125px 225px}.image-10{width:125px;height:225px}html.progressive-image.js [data-progressive-image],html.progressive-image.js [data-progressive-image] *{background-image:none!important;-webkit-mask-image:none!important;mask-image:none!important;opacity:0}html.progressive-image.js .progressive-image-animated,html.progressive-image.js .progressive-image-animated *{will-change:opacity;opacity:0;-webkit-transition:opacity 1s ease-out;transition:opacity 1s ease-out}html.progressive-image.js .progressive-image-animated [data-progressive-image-loaded],html.progressive-image.js .progressive-image-animated [data-progressive-image-loaded] *,html.progressive-image.js .progressive-image-animated[data-progressive-image-loaded],html.progressive-image.js .progressive-image-animated[data-progressive-image-loaded] *{opacity:1}</style><h1>ScrollLoader - ProgressiveImageLoader</h1>	<section>		<figure class="image image-1" data-progressive-image></figure>		<figure class="image image-2" data-progressive-image></figure>	</section>	<section>		<figure class="image image-3" data-progressive-image></figure>		<figure class="image image-4" data-progressive-image></figure>	</section>';

tape.onFinish(() => {
	setTimeout(() => window.close(), 500);
});

tape('should export constructors', test => {
	test.equal(typeof QueueLoader, 'function', 'QueueLoader is a constructor');
	test.equal(typeof ScrollLoader, 'function', 'ScrollLoader is a constructor');
	test.end();
});

tape('QueueLoader should emit events', test => {
	document.body.innerHTML = queueMarkup;
	window.scrollTo(0, 0);

	const queueLoader = new QueueLoader({
		animate: true,
		timeout: 5000
	});

	const total = document.querySelectorAll('.image').length;
	let newElementCount = null;
	let elementCount = null;
	let loaded = 0;

	queueLoader.on('image-loaded', () => {
		loaded += 1;
	});

	queueLoader.on('complete', () => {
		test.equal(loaded, total, 'all images fire image-loaded event');
		test.pass('complete event fired');
		test.end();
	});

	test.equal(queueLoader.isRunning, false, 'instance reports idle state accurately');
	queueLoader.load();
	elementCount = queueLoader.elements.length;
	queueLoader.load();
	newElementCount = queueLoader.elements.length;
	test.equal(queueLoader.isRunning, true, 'instance reports running state accurately');
	test.equal(newElementCount, elementCount, 'instance does not update elements if already running');
});

tape('ScrollLoader should emit events', test => {
	document.body.innerHTML = scrollMarkup;
	window.scrollTo(0, 0);

	window.requestAnimationFrame(() => {
		const scrollLoader = new ScrollLoader({
			animate: true,
			timeout: 5000
		});

		const total = document.querySelectorAll('.image').length;
		let newElementCount = null;
		let elementCount = null;
		let loaded = 0;

		scrollLoader.on('image-loaded', () => {
			loaded += 1;
		});

		scrollLoader.on('complete', () => {
			test.equal(loaded, total, 'all images fire image-loaded event');
			test.pass('complete event fired');
			test.end();
		});

		test.equal(scrollLoader.isRunning, false, 'instance reports idle state accurately');

		setTimeout(() => {
			scrollLoader.load();
			test.equal(scrollLoader.isRunning, true, 'instance reports running state accurately');
			elementCount = scrollLoader.elements.length;
			scrollLoader.load();
			newElementCount = scrollLoader.elements.length;
			test.equal(newElementCount, elementCount, 'instance does not update elements if already running');
		}, 750);

		setTimeout(() => {
			test.equal(loaded, 2, 'in-view images fire image-loaded event');
			window.scrollTo(0, window.innerHeight / 2);
			window.requestAnimationFrame(() => window.scrollTo(0, window.innerHeight));
		}, 2000);
	});
});
