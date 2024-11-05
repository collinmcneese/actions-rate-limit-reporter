import * as core from '@actions/core';
import { reporter } from './reporter';

const token: string = core.getInput('access-token');
const renderInput: string = core.getInput('render');

const render: boolean = renderInput === 'true';

// Run the Reporter action
reporter({ render, token }).then((result) => {
  core.debug(`reporter result:\n${result}`);
  core.setOutput('rateLimitObject', result);
}).catch((error) => {
  core.setFailed(error.message);
});
