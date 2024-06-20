// Tests for functions in reporter.js

const reporter = require('../src/reporter');
const { renderRateLimitTable } = reporter.reporterPrivate;

// Test the renderRateLimitTable function
describe('renderRateLimitTable', () => {
  // Mock the rate limit data
  let rateLimitObject = {
    resources: {
      core: {
        limit: 1000,
        remaining: 999,
        reset: 1609377600,
      },
      search: {
        limit: 1000,
        remaining: 1,
        reset: 1609377600,
      },
      graphql: {
        limit: 1000,
        remaining: 251,
        reset: 1609377600,
      },
      code_search: {
        limit: 1000,
        remaining: 501,
        reset: 1609377600,
      },
    },
  };

  test('renderRateLimitTable', async () => {
    const renderedTable = await renderRateLimitTable({ rateLimitObject });

    // Check that the rendered table is a string
    expect(typeof renderedTable)
      .toBe('string');
    // Check that the core resource is green (75-100% remaining)
    expect(renderedTable)
      .toMatch(/core.*green/);
    // Check that the search resource is red (0-25% remaining)
    expect(renderedTable)
      .toMatch(/search.*red/);
    // Check that the graphql resource is orange (25-50% remaining)
    expect(renderedTable)
      .toMatch(/graphql.*orange/);
    // Check that the code_search resource has no color added (50-75% remaining)
    expect(renderedTable)
      .not.toMatch(/code_search.*span/);

    // Check that the rendered table contains a Markdown table in the following format:
    // | Resource | Limit | Remaining | Reset |
    // | --- | --- | --- | --- |
    expect(renderedTable)
      .toMatch(/\| Resource \| Limit \| Remaining \| Reset \|/);
    expect(renderedTable)
      .toMatch(/\| --- \| --- \| --- \| --- \|/);

    console.log(await renderRateLimitTable({ rateLimitObject }));
  });
});
