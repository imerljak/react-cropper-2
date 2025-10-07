# GitHub Actions Workflows

This directory contains CI/CD pipelines for react-cropper-2.

## Workflows

### 1. CI (`ci.yml`)

**Trigger:** Push to main/develop, Pull Requests

**Jobs:**
- **Test** - Runs on Node.js 18.x and 20.x
  - Linting (ESLint)
  - Type checking (TypeScript)
  - Unit tests with coverage
  - Uploads coverage to Codecov

- **Build** - Builds the library
  - Creates distribution files
  - Reports bundle sizes
  - Uploads artifacts

- **Example** - Tests the example application
  - Ensures examples work with built library

### 2. Release (`release.yml`)

**Trigger:** Git tags matching `v*.*.*`

**Process:**
1. Runs full test suite
2. Builds the library
3. Generates changelog from commits
4. Creates GitHub Release
5. Publishes to npm

**Required Secrets:**
- `NPM_TOKEN` - npm authentication token

**Usage:**
```bash
# Create a release
npm version patch  # or minor, major
git push --follow-tags
```

### 3. PR Check (`pr-check.yml`)

**Trigger:** Pull Request events

**Checks:**
- **PR Information** - Stats about changes
- **Conventional Commits** - Validates commit message format
- **Bundle Size** - Reports size changes, warns if >10KB
- **Test Coverage** - Displays coverage metrics

### 4. Dependabot Auto-merge (`dependabot-auto-merge.yml`)

**Trigger:** Dependabot PRs

**Behavior:**
- Auto-merges patch and minor updates
- Requires manual review for major updates
- Comments on major version changes

## Setup Requirements

### Secrets

Configure these in GitHub Settings → Secrets:

1. **NPM_TOKEN** (Required for releases)
   ```bash
   # Generate on npmjs.com
   # Settings → Access Tokens → Generate New Token (Automation)
   ```

2. **CODECOV_TOKEN** (Optional, for coverage reports)
   ```bash
   # Get from codecov.io after linking repository
   ```

### Branch Protection

Recommended settings for `main` branch:

```yaml
Protected Branch Rules:
  ✓ Require pull request reviews (1 reviewer)
  ✓ Require status checks to pass:
    - Test (Node 18.x)
    - Test (Node 20.x)
    - Build
    - Conventional Commits
  ✓ Require branches to be up to date
  ✓ Require linear history
  ✓ Do not allow bypassing
```

## Workflow Triggers

| Workflow | Push to main | PR | Tag | Schedule |
|----------|--------------|----|----|----------|
| CI | ✅ | ✅ | ❌ | ❌ |
| Release | ❌ | ❌ | ✅ | ❌ |
| PR Check | ❌ | ✅ | ❌ | ❌ |
| Dependabot Auto-merge | ❌ | ✅* | ❌ | ❌ |

*Only for Dependabot PRs

## Badge Setup

Add these to your README.md:

```markdown
[![CI](https://github.com/your-org/react-cropper-2/workflows/CI/badge.svg)](https://github.com/your-org/react-cropper-2/actions)
[![codecov](https://codecov.io/gh/your-org/react-cropper-2/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/react-cropper-2)
[![npm version](https://badge.fury.io/js/react-cropper-2.svg)](https://www.npmjs.com/package/react-cropper-2)
```

## Troubleshooting

### Tests Failing in CI but Pass Locally

1. Check Node.js version (CI uses 18.x and 20.x)
2. Verify dependencies are locked (`npm ci` vs `npm install`)
3. Check for environment-specific issues

### Release Workflow Failing

1. Verify `NPM_TOKEN` is set correctly
2. Ensure you're authorized to publish
3. Check package.json version matches tag

### Dependabot Not Auto-merging

1. Verify repository permissions
2. Check if status checks are passing
3. Ensure branch protection allows auto-merge

## Monitoring

View workflow runs:
```
https://github.com/your-org/react-cropper-2/actions
```

## Local Testing

Test workflows locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Run CI workflow
act -j test

# Run with secrets
act -j test --secret-file .env.secrets
```

## Customization

### Adding a New Check

1. Create new workflow file: `.github/workflows/your-check.yml`
2. Define trigger and jobs
3. Update branch protection rules if needed
4. Document in this README

### Modifying Existing Workflows

1. Edit workflow YAML file
2. Test changes in a PR first
3. Update documentation
4. Commit with conventional commit message

## Best Practices

✅ **Do:**
- Keep workflows simple and focused
- Use matrix strategy for multiple versions
- Cache dependencies for speed
- Upload artifacts for debugging
- Add step summaries for visibility

❌ **Don't:**
- Store secrets in workflow files
- Run unnecessary jobs in parallel
- Skip status checks
- Use deprecated actions
- Hardcode versions without updates

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)
- [Conventional Commits](https://www.conventionalcommits.org/)
