// Tests for functions in reporter.js

const reporter = require('../src/reporter');
const { renderRateLimitTable } = reporter.reporterPrivate;

// Test the renderRateLimitTable function
describe('renderRateLimitTable', () => {
  // Mock the rate limit data
  let rateLimitObject = {
    resources: {
      core: {
        limit: 5000,
        remaining: 4999,
        reset: 1609377600,
      },
      search: {
        limit: 30,
        remaining: 18,
        reset: 1609377600,
      },
    },
  };

  test('renderRateLimitTable', async () => {
    // Test that the function returns a string
    expect(typeof await renderRateLimitTable(rateLimitObject)).toBe('string');
    // Test that the function returns a string that includes the core resource
    expect(await renderRateLimitTable(rateLimitObject)).toMatch(/core/);
    // Test that the function returns a string that includes the search resource
    expect(await renderRateLimitTable(rateLimitObject)).toMatch(/search/);
    // Test that the function returns a string that has markdown table syntax
    expect(await renderRateLimitTable(rateLimitObject)).toMatch(/\|/);
  });
});
