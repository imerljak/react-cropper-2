# GitHub Codespaces Configuration

This directory contains the configuration for GitHub Codespaces, allowing you to develop react-cropper-2 in a cloud-based development environment.

## Features

- **Node.js 20** - Latest LTS version
- **TypeScript support** - Full IntelliSense and type checking
- **ESLint & Prettier** - Automatic code formatting and linting
- **Vitest** - Test runner with explorer extension
- **Auto-install dependencies** - Runs `npm install` after container creation
- **Auto-build** - Builds the library on startup
- **Port forwarding** - Dev server (5173) automatically forwarded

## Usage

### Opening in Codespaces

1. Go to your GitHub repository
2. Click the green "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"

### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build library
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

## VS Code Extensions Included

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Enhanced TypeScript support
- **Vitest Explorer** - Interactive test runner
- **Tailwind CSS** - CSS intellisense (for examples)

## Configuration

The configuration automatically:
- Installs all dependencies on creation
- Builds the library on startup
- Forwards port 5173 for the dev server
- Enables format-on-save
- Enables ESLint auto-fix on save
- Uses workspace TypeScript version

## Customization

To customize the Codespace:
1. Edit `.devcontainer/devcontainer.json`
2. Commit and push changes
3. Rebuild the container (Cmd/Ctrl+Shift+P → "Rebuild Container")

## Resources

- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Dev Container Reference](https://containers.dev/)
