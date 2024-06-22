// index.js

import core from '@actions/core';
import { reporter } from './reporter.js';

const token = core.getInput('access-token');
const renderInput = core.getInput('render');

const render = renderInput === 'true';

// Run the Reporter action
reporter({ render, token }).then((result) => {
  core.debug(`reporter result:\n${result}`);
  core.setOutput('rateLimitObject', result);
});
