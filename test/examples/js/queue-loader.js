'use strict';

import {QueueLoader} from '../../..';

const queueLoader = new QueueLoader({timeout: 1000});

queueLoader.on('image-loaded', el => console.log(el));
queueLoader.on('complete', () => console.log('images loaded'));
queueLoader.load();
