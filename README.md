# GitHub Actions Rate-Limit Reporter

This action reports the remaining rate-limit for the GitHub API.  Running this action will provide output for consumed and remaining rate-limit for the GitHub token used to run the action.  This action is useful for debugging rate-limit issues with GitHub Actions or to use the rate-limit in subsequent steps, such as logging the rate-limit to an external service or waiting for the rate-limit to reset before continuing with the workflow.

Accepts a GitHub token as input and `render` flag to render the output as step summary output.

## Inputs

### `access-token`

`String`, **Required**, The GitHub token to use for authentication.

### `render`

`String`, **Optional**, Render the output to the job's [step summary](https://github.blog/2022-05-09-supercharging-github-actions-with-job-summaries/).  Defaults to `'true'`.

The `render` option will generate output similar to the following:

| Resource | Limit | Remaining | Reset |
| :-: | :-: | :-: | :-: |
| core | 5000 | 4815 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| search | 30 | 30 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| graphql | 5000 | 4980 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| integration_manifest | 5000 | 5000 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| source_import | 100 | 100 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| code_scanning_upload | 1000 | 998 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| actions_runner_registration | 10000 | 10000 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| scim | 15000 | 15000 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| dependency_snapshots | 100 | 100 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| audit_log | 1750 | 1750 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |
| code_search | 10 | 10 | Wed Jun 19 2024 16:26:02 GMT+0000 (Coordinated Universal Time) |

## Outputs

### `rateLimitObject`

The rate-limit object returned by the GitHub API for the provided token.

## Example usage

Example with rendering the output as step summary output:

```yaml
- name: Report rate-limit
  uses: collinmcneese/actions-rate-limit-reporter@main
  with:
    access-token: ${{ secrets.GITHUB_TOKEN }}
```

Example using this Action in a step and then using the output in a subsequent step:

```yaml
- name: Report rate-limit
  id: report-rate-limit
  uses: collinmcneese/actions-rate-limit-reporter@main
  with:
    access-token: ${{ secrets.GITHUB_TOKEN }}
- name: Do something with the rate-limit
  run: echo "The rate-limit remaining for core is ${{ fromJson(steps.report-rate-limit.outputs.rateLimitObject).resources.core.remaining }}"
```
