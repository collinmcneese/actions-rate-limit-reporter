// reporter.js

const github = require('@actions/github');
const core = require('@actions/core');

/**
 * Fetch rate limit data from the GitHub API
 * @returns {Promise<Octokit.RateLimitGetResponse>} - The rate limit data
 */
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

/**
 * Render the rate limit data as a Markdown table
 * @param {Octokit.RateLimitGetResponse} rateLimitObject - The rate limit data
 * @returns {Promise<string>} - The rate limit data as a Markdown table
 */
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

/**
 * Fetch rate limit data from the GitHub API and optionally render it as a Markdown table
 * @param {Object} options - The options object
 * @param {string} options.render - Whether to render the rate limit data as a Markdown table
 * @returns {Promise<Octokit.RateLimitGetResponse>} - The rate limit data
 */
async function reporter({ render }) {
  try {
    let rateLimitObject = await fetchRateLimit();

    if (render) {
      let markDown = await renderRateLimitTable(rateLimitObject);
      core.summary
        .addRaw(markDown)
        .write();
    }

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
