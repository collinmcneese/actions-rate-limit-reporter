// index.js

const core = require('@actions/core');
const { reporter } = require('./reporter');

const token = core.getInput('access-token');
const renderInput = core.getInput('render');

const render = renderInput === 'true';

// Run the Reporter action
reporter({ render, token }).then((result) => {
  core.debug(`reporter result:\n${result}`);
  core.setOutput('rateLimitObject', result);
});
