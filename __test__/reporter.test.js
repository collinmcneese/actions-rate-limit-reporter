import { expect } from 'chai';
import * as reporter from '../dist/reporter.js';
const { renderRateLimitTable } = reporter.reporterPrivate;
import fc from 'fast-check';
// Test the renderRateLimitTable function
describe('renderRateLimitTable', async () => {
    const rateLimitObject = {
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
    const renderedTable = await renderRateLimitTable({ rateLimitObject });
    it('renderRateLimitTable', async () => {
        expect(renderedTable).to.be.a('string');
        expect(renderedTable).to.match(/\| Resource \| Limit \| Remaining \| Reset \|/);
        expect(renderedTable).to.match(/\| --- \| --- \| --- \| --- \|/);
    });
    it('should render the correct circle colors based on the remaining rate limit', async () => {
        expect(renderedTable).to.match(/core.*color:green/)
        expect(renderedTable).to.match(/search.*color:red/)
        expect(renderedTable).to.match(/graphql.*color:orange/)
        expect(renderedTable).to.match(/code_search.*color:yellow/)
    });
    it('renderRateLimitTable with fuzz testing', async () => {
        await fc.assert(fc.asyncProperty(fc.record({
            resources: fc.record({
                core: fc.record({
                    limit: fc.integer({ min: 0, max: 1000 }),
                    remaining: fc.integer({ min: 0, max: 1000 }),
                    reset: fc.integer({ min: 0, max: 1000 }),
                }),
                search: fc.record({
                    limit: fc.integer({ min: 0, max: 1000 }),
                    remaining: fc.integer({ min: 0, max: 1000 }),
                    reset: fc.integer({ min: 0, max: 1000 }),
                }),
                graphql: fc.record({
                    limit: fc.integer({ min: 0, max: 1000 }),
                    remaining: fc.integer({ min: 0, max: 1000 }),
                    reset: fc.integer({ min: 0, max: 1000 }),
                }),
                code_search: fc.record({
                    limit: fc.integer({ min: 0, max: 1000 }),
                    remaining: fc.integer({ min: 0, max: 1000 }),
                    reset: fc.integer({ min: 0, max: 1000 }),
                }),
            }),
        }), async (rateLimitObject) => {
            expect(renderedTable).to.be.a('string');
            expect(renderedTable).to.match(/\| Resource \| Limit \| Remaining \| Reset \|/);
            expect(renderedTable).to.match(/\| --- \| --- \| --- \| --- \|/);
        }));
    });
});
