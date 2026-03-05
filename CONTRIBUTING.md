# Contributing to chrome-focus-mode

Thank you for your interest in contributing to **chrome-focus-mode**! This project is part of the [Zovo](https://zovo.one) developer tools family and we welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Code Style](#code-style)
- [Testing](#testing)
- [Questions](#questions)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](https://github.com/theluckystrike/chrome-focus-mode/blob/main/CODE_OF_CONDUCT.md). Please report unacceptable behavior to hello@zovo.one.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/chrome-focus-mode.git`
3. **Navigate** to the project: `cd chrome-focus-mode`
4. **Install** dependencies: `npm install`

## Development Setup

This project is a TypeScript library for Chrome extensions. You'll need:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **TypeScript** (installed via npm)

```bash
# Install dependencies
npm install

# Build the TypeScript project
npm run build
```

## Making Changes

1. Create a new branch for your feature or bugfix:

   ```bash
   # For a new feature
   git checkout -b feature/your-feature-name

   # For a bugfix
   git checkout -b fix/description-of-bug
   ```

2. Make your changes in the `src/` directory
3. Build the project to check for TypeScript errors:

   ```bash
   npm run build
   ```

4. Ensure your code follows our style guidelines (see below)

## Submitting a Pull Request

1. **Push** your changes to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open** a Pull Request against the `main` branch of `theluckystrike/chrome-focus-mode`

3. **Fill out** the PR template with:
   - A clear description of what your changes do
   - Link to any related issues
   - Screenshots for UI changes (if applicable)
   - Test results/output

4. **Respond** to any feedback from maintainers

## Bug Reports

We use GitHub Issues for bug tracking. Please use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) when submitting a bug.

Before submitting a bug report:
- Search existing issues to avoid duplicates
- Reproduce the bug in a clean environment
- Collect relevant information (Node version, Chrome version, etc.)

## Feature Requests

We welcome feature requests! Please use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) to submit ideas.

When submitting a feature request:
- Explain the problem you're trying to solve
- Describe your proposed solution
- Consider alternatives you may have explored
- Explain how this feature would benefit other users

## Code Style

- **TypeScript**: Follow the [TypeScript style guide](https://github.com/microsoft/TypeScript/wiki/Coding-conventions)
- **Formatting**: Use consistent indentation (2 spaces)
- **Naming**: Use PascalCase for types/interfaces, camelCase for variables/functions
- **Comments**: Add JSDoc comments for public APIs
- **Imports**: Use absolute imports when possible

Example:

```typescript
/**
 * Represents a focus session configuration
 */
export interface FocusSessionConfig {
  /** Duration in minutes */
  duration: number;
  /** List of blocked domains */
  blocklist: string[];
  /** Whether to enable Pomodoro mode */
  pomodoro?: boolean;
}

/**
 * Starts a new focus session
 * @param config - Session configuration
 * @returns Promise that resolves when session starts
 */
export async function startSession(config: FocusSessionConfig): Promise<void> {
  // Implementation
}
```

## Testing

Before submitting changes, verify the TypeScript compiles without errors:

```bash
npm run build
```

## Questions

- **Discord**: Join our [Discord community](https://discord.gg/zovo)
- **Website**: Visit [zovo.one](https://zovo.one)
- **Email**: hello@zovo.one

---

*Thank you for contributing to chrome-focus-mode!*
