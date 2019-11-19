#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const sass = require('node-sass');
const ejs = require('ejs');
const questions = require('./questions');

const run = async () => {
	const answers = await inquirer.prompt(questions.first);
	const {writeTo} = await inquirer.prompt(questions.last(answers));
	const template = path.join(__dirname, 'template', '_progressive-image-loader.scss');
	const render = ejs.compile(fs.readFileSync(template).toString());
	let output = render(answers);

	if (answers.output === 'css') {
		output = sass.renderSync({data: output}).css.toString();
	}

	fs.writeFileSync(writeTo, output);
	console.log(`${answers.output} written to ${writeTo.replace(process.cwd(), '.')}\n`);
};

run();
