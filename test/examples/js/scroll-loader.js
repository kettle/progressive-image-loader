'use strict';

import {ScrollLoader} from '../../..';

const scrollLoader = new ScrollLoader({
	timeout: 5000,
	concurrency: 4,
	offset: '100vh'
});

scrollLoader.on('image-loaded', el => console.log(el));
scrollLoader.on('complete', () => console.log('images loaded'));
scrollLoader.load();
