// index.js

const core = require('@actions/core');
const { reporter } = require('./reporter');

// Parse inputs
const render = core.getInput('render');

// Run the Reporter action
reporter({
  render: render,
}).then((result) => {
  console.log(result);
  core.setOutput('rateLimitObject', result);
});
