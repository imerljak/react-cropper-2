# Deployment Guide

## Overview

This guide covers deploying react-cropper-2 to production, including CI/CD setup, release process, and monitoring.

## Prerequisites

### GitHub Repository Setup

1. **Create GitHub Repository**
   ```bash
   gh repo create react-cropper-2 --public --source=. --remote=origin
   git push -u origin main
   ```

2. **Configure Branch Protection**
   - Go to Settings → Branches → Add rule
   - Branch name pattern: `main`
   - Enable:
     - ✅ Require pull request reviews (1 reviewer)
     - ✅ Require status checks: Test (18.x), Test (20.x), Build
     - ✅ Require branches to be up to date
     - ✅ Require linear history

### Required Secrets

Configure in GitHub Settings → Secrets → Actions:

#### 1. NPM_TOKEN (Required for releases)

```bash
# 1. Log in to npmjs.com
# 2. Go to Account Settings → Access Tokens
# 3. Generate New Token → Automation
# 4. Copy token
# 5. Add to GitHub Secrets as NPM_TOKEN
```

#### 2. CODECOV_TOKEN (Optional, recommended)

```bash
# 1. Go to codecov.io
# 2. Sign in with GitHub
# 3. Add repository
# 4. Copy token
# 5. Add to GitHub Secrets as CODECOV_TOKEN
```

## CI/CD Pipeline

### Automatic Workflows

#### On Every Push to main/develop
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Tests on Node 18.x and 20.x
- ✅ Coverage reporting
- ✅ Build verification
- ✅ Example app validation

#### On Every Pull Request
- ✅ All CI checks above
- ✅ Conventional commit validation
- ✅ Bundle size reporting
- ✅ Coverage comparison
- ✅ PR statistics

#### On Version Tags
- ✅ Full test suite
- ✅ Production build
- ✅ GitHub Release creation
- ✅ NPM package publishing

## Release Process

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### Creating a Release

#### 1. Update Version

```bash
# For a patch release (0.1.0 → 0.1.1)
npm version patch

# For a minor release (0.1.1 → 0.2.0)
npm version minor

# For a major release (0.2.0 → 1.0.0)
npm version major
```

This automatically:
- Updates `package.json`
- Creates a git commit
- Creates a git tag

#### 2. Push with Tags

```bash
git push --follow-tags
```

#### 3. Automatic Release

The CI/CD pipeline automatically:
1. Runs full test suite
2. Builds the library
3. Generates changelog from commits
4. Creates GitHub Release
5. Publishes to npm

#### 4. Verify Release

```bash
# Check GitHub Releases
https://github.com/your-org/react-cropper-2/releases

# Check npm
npm view react-cropper-2

# Test installation
npm install react-cropper-2@latest
```

### Manual Release (If Needed)

```bash
# Build
npm run build

# Publish to npm
npm publish

# Create GitHub Release manually
gh release create v0.1.0 \
  --title "Release 0.1.0" \
  --notes "Release notes here"
```

## Monitoring

### GitHub Actions

View all workflow runs:
```
https://github.com/your-org/react-cropper-2/actions
```

### NPM Statistics

```bash
# Downloads
npm-stat react-cropper-2

# Package info
npm view react-cropper-2
```

### Codecov

View coverage reports:
```
https://codecov.io/gh/your-org/react-cropper-2
```

## GitHub Codespaces

### Opening in Codespaces

1. Go to repository on GitHub
2. Click "Code" → "Codespaces" → "Create codespace on main"
3. Wait for container to build (~2-3 minutes first time)
4. Start developing!

### Codespaces Features

- ✅ Node.js 20 pre-installed
- ✅ Dependencies auto-installed
- ✅ Library auto-built
- ✅ VS Code extensions configured
- ✅ Port forwarding for dev server
- ✅ Format-on-save enabled
- ✅ ESLint auto-fix enabled

### Running in Codespaces

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Troubleshooting

### Release Failed

**Issue:** Release workflow failed during npm publish

**Solution:**
1. Check `NPM_TOKEN` is valid
2. Verify you have publish permissions
3. Ensure package name is available
4. Check npm registry status

### CI Tests Failing

**Issue:** Tests pass locally but fail in CI

**Solution:**
1. Check Node.js version matches CI (18.x or 20.x)
2. Run `npm ci` instead of `npm install`
3. Check for environment-specific issues
4. Review CI logs for detailed errors

### Coverage Not Uploading

**Issue:** Coverage reports not appearing on Codecov

**Solution:**
1. Verify `CODECOV_TOKEN` is set
2. Check repository is linked to Codecov
3. Ensure coverage files are generated
4. Review workflow logs

### Conventional Commits Failing

**Issue:** PR check fails on commit validation

**Solution:**
1. Use proper format: `type(scope): subject`
2. Valid types: feat, fix, docs, style, refactor, perf, test, chore
3. Example: `feat: add new crop mode`
4. Amend commits if needed:
   ```bash
   git commit --amend -m "feat: correct commit message"
   git push --force-with-lease
   ```

## Best Practices

### Before Releasing

✅ **Checklist:**
- [ ] All tests pass locally
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped appropriately
- [ ] Breaking changes documented
- [ ] Examples tested

### Security

- 🔒 Never commit secrets
- 🔒 Use GitHub Secrets for tokens
- 🔒 Enable Dependabot security updates
- 🔒 Review dependencies regularly
- 🔒 Enable 2FA on npm account

### Performance

- ⚡ Keep bundle size <10KB
- ⚡ Monitor bundle size in CI
- ⚡ Use tree-shaking
- ⚡ Minimize dependencies

## Support

### Getting Help

- 📖 Documentation: See README.md
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Email: maintainers@react-cropper-2.org

### Contributing

See CONTRIBUTING.md for guidelines on:
- Code style
- Commit conventions
- PR process
- Testing requirements

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Codecov Documentation](https://docs.codecov.com/)
