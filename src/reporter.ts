import * as core from '@actions/core';
import * as github from '@actions/github';

interface RateLimitResource {
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimitObject {
  resources: {
    [key: string]: RateLimitResource;
  };
}

/**
 * Fetch rate limit data from the GitHub API
 * @param {Object} options - The options object
 * @param {string} options.token - The GitHub API token
 * @returns {Promise<RateLimitObject>} - The rate limit data object from the GitHub API
 */
async function fetchRateLimit({ token }: { token: string }): Promise<RateLimitObject> {
  try {
    const octokit = github.getOctokit(token);

    const { data } = await octokit.rest.rateLimit.get();

    core.debug(`Rate limit data: ${JSON.stringify(data)}`);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
    throw error;
  }
}

/**
 * Render rate limit data as a Markdown table
 * @param {Object} options - The options object
 * @param {RateLimitObject} options.rateLimitObject - The rate limit data
 * @returns {Promise<string>} - The rate limit data rendered as a Markdown table
 */
async function renderRateLimitTable({ rateLimitObject }: { rateLimitObject: RateLimitObject }): Promise<string> {
  try {
    // Build the table header data
    let table = '| Resource | Limit | Remaining | Reset |\n';
    table += '| --- | --- | --- | --- |\n';

    // Create a row for each resource
    for (const resource in rateLimitObject.resources) {
      const rowLimit = rateLimitObject.resources[resource].limit;
      let rowRemaining: number = rateLimitObject.resources[resource].remaining;
      let rowRemainingOutput;
      const rowReset = new Date(rateLimitObject.resources[resource].reset * 1000).toISOString();
      switch (true) {
        case rowRemaining < rowLimit * 0.25:
          rowRemainingOutput = `<span style="color:red">:red_circle: ${rowRemaining}</span>`;
          break;
        case rowRemaining < rowLimit * 0.5 && rowRemaining >= rowLimit * 0.25:
          rowRemainingOutput = `<span style="color:orange">:orange_circle: ${rowRemaining}</span>`;
          break;
        case rowRemaining < rowLimit * 0.75 && rowRemaining >= rowLimit * 0.5:
          rowRemainingOutput = `<span style="color:yellow">:yellow_circle: ${rowRemaining}</span>`;
          break;
        case rowRemaining >= rowLimit * 0.75:
          rowRemainingOutput = `<span style="color:green">:green_circle: ${rowRemaining}</span>`;
          break;
      }

      table += `| ${resource} | ${rowLimit} | ${rowRemainingOutput} | ${rowReset} |\n`;
    }

    core.debug(`Rate limit table: ${table}`);

    return table;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
    throw error;
  }
}

interface ReporterOptions {
  render: boolean;
  token: string;
}

/**
 * Fetch rate limit data from the GitHub API and optionally render it as a Markdown table
 * @param {Object} options - The options object
 * @param {boolean} options.render - Whether to render the rate limit data as a Markdown table
 * @param {string} options.token - The GitHub API token
 * @returns {Promise<RateLimitObject>} - The rate limit data object
 */
async function reporter({ render, token }: ReporterOptions): Promise<RateLimitObject> {
  try {
    const rateLimitObject = await fetchRateLimit({ token });

    if (render) {
      const markDown = await renderRateLimitTable({ rateLimitObject });
      core.summary.addRaw(markDown).write();
    }

    return rateLimitObject;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
    throw error;
  }
}

// Export private functions for testing
const reporterPrivate = {
  fetchRateLimit,
  renderRateLimitTable,
};

export { reporter, reporterPrivate };
