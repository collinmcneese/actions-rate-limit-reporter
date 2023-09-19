// index.js

const core = require('@actions/core');
const { reporter } = require('./reporter');

let token = core.getInput('access-token');
let renderInput = core.getInput('render');

let render = renderInput === 'true';

// Run the Reporter action
reporter({ render, token }).then((result) => {
  core.debug(`reporter result:\n${result}`);
  core.setOutput('rateLimitObject', result);
});
