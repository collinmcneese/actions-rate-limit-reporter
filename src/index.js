// index.js

const core = require('@actions/core');
console.log('loading resources from reporter.js');
const { reporter } = require('./reporter');

// Parse inputs
const render = core.getInput('render');

// Run the Reporter action
reporter({
  render: render,
}).then((result) => {
  console.log(`reporter result:\n${result}`);
  core.setOutput('rateLimitObject', result);
});
