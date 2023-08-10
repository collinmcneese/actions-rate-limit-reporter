// reporter.js

const github = require('@actions/github');
const core = require('@actions/core');

// Fetch rate limit data from the GitHub API
async function fetchRateLimit() {
  try {
    const accessToken = core.getInput('access-token');
    const octokit = github.getOctokit(accessToken);

    let response = await octokit.rest.rateLimit.get();

    return response.data;
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Render the rate limit data as a Markdown table
async function renderRateLimitTable(rateLimitObject) {
  // Build the table header data
  let table = '| Resource | Limit | Remaining | Reset |\n';
  table += '| --- | --- | --- | --- |\n';

  // Create a row for each resource
  for (let resource in rateLimitObject.resources) {
    let rowLimit = rateLimitObject.resources[resource].limit;
    let rowRemaining = rateLimitObject.resources[resource].remaining;
    let rowReset = Date(rateLimitObject.resources[resource].reset);

    table += `| ${resource} | ${rowLimit} | ${rowRemaining} | ${rowReset} |\n`;
  }

  return table;
}

// Main reporter function
async function reporter({ render }) {
  try {
    // Fetch rate limit data from the GitHub API
    let rateLimitObject = await fetchRateLimit();

    // If render is true, render the rate limit data as a Markdown table
    if (render === 'true') {
      let markDown = await renderRateLimitTable(rateLimitObject);
      core.summary
        .addRaw(markDown)
        .write();
    }

    // Return the rate limit data
    return rateLimitObject;
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Export private functions for testing
const reporterPrivate = {
  fetchRateLimit,
  renderRateLimitTable,
};

module.exports = {
  reporterPrivate,
  reporter,
};
