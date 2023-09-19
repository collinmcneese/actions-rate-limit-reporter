// index.js

const core = require('@actions/core');
const { reporter } = require('./reporter');

let renderInput = core.getInput('render');
let render = renderInput === 'true';

// Run the Reporter action
reporter({
  render: render,
}).then((result) => {
  core.debug(`reporter result:\n${result}`);
  core.setOutput('rateLimitObject', result);
});
