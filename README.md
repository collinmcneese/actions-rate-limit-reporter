# GitHub Actions Rate-Limit Reporter

This action reports the remaining rate-limit for the GitHub API.

Accepts a GitHub token as input and `render` flag to render the output as step summary output.

## Inputs

### `github-token`

`String`, **Required** The GitHub token to use for authentication.

### `render`

`String`, **Optional** Render the output as step summary output.  Defaults to `'true'`.

## Outputs

### `rateLimitObject`

The rate-limit object returned by the GitHub API for the provided token.

## Example usage

Example with rendering the output as step summary output:

```yaml
- name: Report rate-limit
  uses: collinmcneese/actions-rate-limit-reporter@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    render: true
```

Example using this Action in a step and then using the output in a subsequent step:

```yaml
- name: Report rate-limit
  id: report-rate-limit
  uses: collinmcneese/actions-rate-limit-reporter@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
- name: Do something with the rate-limit
  run: echo "The rate-limit remaining for core is ${{ fromJson(steps.report-rate-limit.outputs.rateLimitObject).resources.core.remaining }}"
```
