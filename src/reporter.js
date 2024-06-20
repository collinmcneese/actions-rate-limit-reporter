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

    const { data } = await octokit.rest.rateLimit.get();

    core.debug(`Rate limit data: ${JSON.stringify(data)}`);

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
  try {
    // Build the table header data
    let table = '| Resource | Limit | Remaining | Reset |\n';
    table += '| --- | --- | --- | --- |\n';

    // Create a row for each resource
    for (const resource in rateLimitObject.resources) {
      const rowLimit = rateLimitObject.resources[resource].limit;
      let rowRemaining = rateLimitObject.resources[resource].remaining;
      const rowReset = Date(rateLimitObject.resources[resource].reset);

      if (rowRemaining < rowLimit * .25) {
        rowRemaining = `<span style="color:red">:red_circle: ${rowRemaining}</span>`;
      } else if (rowRemaining < rowLimit * .5) {
        rowRemaining = `<span style="color:orange">:orange_circle: ${rowRemaining}</span>`;
      } else if (rowRemaining > rowLimit * .75) {
        rowRemaining = `<span style="color:green">:green_circle: ${rowRemaining}</span>`;
      }

      table += `| ${resource} | ${rowLimit} | ${rowRemaining} | ${rowReset} |\n`;
    }

    core.debug(`Rate limit table: ${table}`);

    return table;
  } catch (error) {
    core.setFailed(error.message);
  }
}

/**
 * Fetch rate limit data from the GitHub API and optionally render it as a Markdown table
 * @param {Object} options - The options object
 * @param {string} options.render - Whether to render the rate limit data as a Markdown table
 * @returns {Promise<Object>} - The rate limit data object
 */
async function reporter({ render, token }) {
  try {
    const rateLimitObject = await fetchRateLimit({ token });

    if (render) {
      const markDown = await renderRateLimitTable({ rateLimitObject });
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
