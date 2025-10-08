# Storybook Deployment to GitHub Pages

This project is configured to automatically deploy Storybook to GitHub Pages on every push to the `main` branch.

## Initial Setup

To enable GitHub Pages deployment, you need to configure it in your GitHub repository settings:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. That's it! The workflow will automatically deploy on the next push to `main`

## Accessing Your Storybook

Once deployed, your Storybook will be available at:

```
https://<username>.github.io/<repository-name>/
```

For this repository:
```
https://react-cropper-2.github.io/react-cropper-2/
```

Or check your repository's Pages settings for the exact URL.

## Manual Deployment

You can also trigger a manual deployment:

1. Go to **Actions** tab in your repository
2. Select the "Deploy Storybook to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the `main` branch and click "Run workflow"

## Local Build Testing

To test the Storybook build locally before deployment:

```bash
npm run build-storybook
```

This will create a `storybook-static` directory that you can serve locally:

```bash
npx http-server storybook-static
```

## Workflow Details

The deployment workflow (`.github/workflows/deploy-storybook.yml`):

- Runs on push to `main` branch
- Installs dependencies with `npm ci`
- Builds Storybook with `npm run build-storybook`
- Deploys to GitHub Pages using official GitHub Actions

## Troubleshooting

### Deployment fails with permissions error

Make sure GitHub Actions has the correct permissions:
1. Go to **Settings** → **Actions** → **General**
2. Scroll to "Workflow permissions"
3. Ensure "Read and write permissions" is selected
4. Check "Allow GitHub Actions to create and approve pull requests"

### 404 error after deployment

1. Check that GitHub Pages is enabled in repository settings
2. Verify the source is set to "GitHub Actions"
3. Check the Actions tab to ensure the workflow completed successfully
4. Give it a few minutes - GitHub Pages can take time to propagate

### Need to change the base path

If your Storybook is deployed to a subdirectory, you may need to configure the base path in `.storybook/main.ts`:

```typescript
const config: StorybookConfig = {
  // ... other config
  viteFinal: async (config) => {
    config.base = '/your-repo-name/';
    return config;
  },
};
```
