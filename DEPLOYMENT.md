# Deployment Guide

## Overview

This guide covers the deployment and release process for `@imerljak/react-cropper-2`.

## Prerequisites

### NPM Account Setup

1. **Create NPM Account**
   - Go to [npmjs.com](https://npmjs.com) and create an account
   - Enable 2FA (two-factor authentication) for security

2. **Generate Access Token**
   ```bash
   # Log in to npm
   npm login

   # Or generate a token at: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   # Token type: "Automation"
   ```

3. **Add Token to GitHub Secrets**
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Create new secret: `NPM_TOKEN`
   - Paste your npm token

## Release Process

### Automated Release (Recommended)

The project uses GitHub Actions for automated releases:

1. **Create a New Version Tag**
   ```bash
   # For a patch release (0.1.0 → 0.1.1)
   npm version patch

   # For a minor release (0.1.0 → 0.2.0)
   npm version minor

   # For a major release (0.1.0 → 1.0.0)
   npm version major
   ```

2. **Push the Tag**
   ```bash
   git push --follow-tags
   ```

3. **Automatic Deployment**

   The GitHub Actions workflow (`.github/workflows/release.yml`) will automatically:
   - Run all tests
   - Build the library
   - Create a GitHub Release with changelog
   - Publish to npm registry

4. **Verify the Release**
   ```bash
   # Check npm
   npm view @imerljak/react-cropper-2

   # Test installation
   npm install @imerljak/react-cropper-2@latest
   ```

### Manual Release (If Needed)

If you need to publish manually:

```bash
# Build the library
npm run build

# Publish to npm (with public access for scoped packages)
npm publish --access=public
```

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
  - API changes that break backward compatibility
  - Major dependency updates

- **MINOR** (0.1.0): New features
  - New functionality (backward compatible)
  - New component props or hook options

- **PATCH** (0.0.1): Bug fixes
  - Bug fixes
  - Performance improvements
  - Documentation updates

## CI/CD Pipeline

### Continuous Integration (`.github/workflows/ci.yml`)

Runs on every push to `main` and on pull requests:
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Tests with coverage (Vitest)
- ✅ Build verification

### Pull Request Checks (`.github/workflows/pr-check.yml`)

Additional checks for pull requests:
- ✅ All CI checks
- ✅ Test coverage threshold (85%+)

### Release Workflow (`.github/workflows/release.yml`)

Triggered by version tags (`v*.*.*`):
- ✅ Full test suite
- ✅ Production build
- ✅ GitHub Release creation
- ✅ NPM package publishing

### Storybook Deployment (`.github/workflows/deploy-storybook.yml`)

Automatically deploys Storybook to GitHub Pages on push to `main`:
- 📚 Interactive documentation
- 🎨 Live component examples
- 🔗 Available at: https://imerljak.github.io/react-cropper-2/

## GitHub Pages Setup

To enable Storybook deployment to GitHub Pages:

1. Go to repository **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. The Storybook will be available at `https://imerljak.github.io/react-cropper-2/`

See `.github/STORYBOOK_DEPLOYMENT.md` for detailed instructions.

## Pre-Release Checklist

Before creating a release, ensure:

- [ ] All tests pass locally (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Documentation is up to date
- [ ] Example app works (`npm run dev`)
- [ ] Storybook builds (`npm run build-storybook`)
- [ ] Version number is updated in `package.json`
- [ ] Breaking changes are documented (if any)

## Monitoring

### NPM Package

View package statistics:
```bash
# Package information
npm view @imerljak/react-cropper-2

# Install the package to test
npm install @imerljak/react-cropper-2
```

### GitHub Actions

Monitor all workflow runs:
- Go to **Actions** tab in the repository
- Check for failed builds or deployments
- Review workflow logs for errors

### Storybook

- Live documentation: https://imerljak.github.io/react-cropper-2/
- Check deployment status in GitHub Actions

## Troubleshooting

### Release Failed - NPM Publish Error

**Issue**: `npm publish` fails in GitHub Actions

**Solutions**:
1. Verify `NPM_TOKEN` secret is set correctly
2. Check you have publish permissions for the package
3. Ensure the version number hasn't been published already
4. Check npm registry status

### Storybook Build Failed

**Issue**: Storybook build fails in CI

**Solutions**:
1. Test locally: `npm run build-storybook`
2. Check for missing dependencies
3. Review build logs in GitHub Actions
4. Verify Node version matches CI (20.x)

### Tests Failing in CI

**Issue**: Tests pass locally but fail in CI

**Solutions**:
1. Use `npm ci` instead of `npm install` locally
2. Check Node.js version (should be 20.x)
3. Clear npm cache: `npm cache clean --force`
4. Review CI logs for specific errors

### GitHub Pages Not Updating

**Issue**: Storybook documentation not updating

**Solutions**:
1. Check GitHub Pages is enabled in repository settings
2. Verify source is set to "GitHub Actions"
3. Check the deploy workflow completed successfully
4. Wait a few minutes - GitHub Pages can take time to propagate
5. Clear browser cache and try again

## Security Best Practices

- 🔒 Never commit sensitive tokens or secrets
- 🔒 Use GitHub Secrets for all tokens
- 🔒 Enable 2FA on npm account
- 🔒 Regularly update dependencies
- 🔒 Review Dependabot security alerts

## Support

For deployment issues:
- Check GitHub Actions logs
- Review this guide
- Open an issue on GitHub
- Check npm registry status

## Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
