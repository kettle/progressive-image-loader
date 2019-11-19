#!/usr/bin/env node
const path = require('path');

const validate = str => {
	if (str.trim() === '') {
		return 'You must enter a value';
	}

	return true;
};

module.exports = {
	first: [
		{
			type: 'input',
			name: 'selectorAttribute',
			message: 'Data attribute to indicate an element should load progressively',
			default: 'data-progressive-image',
			validate
		},
		{
			type: 'input',
			name: 'loadedAttribute',
			message: 'Data attribute to add to an element when it has loaded',
			default: 'data-progressive-image-loaded',
			validate
		},
		{
			type: 'input',
			name: 'animateClass',
			message: 'Class to apply to element if it should fade in (animate) when loaded',
			default: 'progressive-image-animated',
			validate
		},
		{
			type: 'input',
			name: 'jsSupportClass',
			message: 'Class applied to body to indicate that the page supports JavaScript',
			default: 'js',
			validate
		},
		{
			type: 'list',
			name: 'output',
			choices: [
				{
					name: 'SCSS',
					value: 'scss',
					checked: true
				}, {
					name: 'CSS',
					value: 'css'
				}
			]
		}
	],
	last: answers => {
		let outputFile = '_progressive-image-loader.scss';

		if (answers.output === 'css') {
			outputFile = 'progressive-image-loader.css';
		}

		return [
			{
				type: 'input',
				name: 'writeTo',
				message: 'Write output to',
				default: path.join(__dirname, '..', 'tmp', outputFile),
				validate
			}
		];
	}
};
