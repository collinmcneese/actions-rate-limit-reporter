// reporter.js

const github = require('@actions/github');
const core = require('@actions/core');

/**
 * Fetch rate limit data from the GitHub API
 * @param {Object} options - The options object
 * @param {string} options.token - The GitHub API token
 * @returns {Promise<Object>} - The rate limit data object from the GitHub API
 */
async function fetchRateLimit({ token }) {
  try {
    const octokit = github.getOctokit(token);

    let { data } = await octokit.rest.rateLimit.get();

    return data;
  } catch (error) {
    core.setFailed(error.message);
  }
}

/**
 * Render rate limit data as a Markdown table
 * @param {Object} options - The options object
 * @param {Object} options.rateLimitObject - The rate limit data
 * @returns {Promise<string>} - The rate limit data rendered as a Markdown table
 */
async function renderRateLimitTable({ rateLimitObject }) {
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
    let token = core.getInput('access-token');
    let rateLimitObject = await fetchRateLimit({ token });

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
