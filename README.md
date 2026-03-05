# chrome-focus-mode — Focus Mode for Extensions

[![npm version](https://img.shields.io/npm/v/chrome-focus-mode)](https://npmjs.com/package/chrome-focus-mode)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/chrome-focus-mode/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/chrome-focus-mode/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-focus-mode?style=social)](https://github.com/theluckystrike/chrome-focus-mode)

> Block distracting sites, timed Pomodoro sessions, whitelist, session history, and presets.

**chrome-focus-mode** provides focus mode functionality for Chrome extensions. Block distracting sites, run timed Pomodoro sessions, manage whitelists, and track session history.

Part of the [Zovo](https://zovo.one) developer tools family.

## Features

- ✅ **Site Blocking** - Block distracting websites
- ✅ **Pomodoro Timer** - Built-in focus timer
- ✅ **Whitelist** - Allow specific sites
- ✅ **Session History** - Track focus sessions
- ✅ **Presets** - Pre-built blocklists
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install chrome-focus-mode
```

## Usage

```typescript
import { FocusMode } from 'chrome-focus-mode';

const focus = new FocusMode();

// Set blocklist using preset
focus.setBlocklist(FocusMode.PRESETS.SOCIAL);

// Start 25-minute focus session
await focus.start(25);

// Get remaining time
console.log(focus.getRemainingFormatted());
```

## Tutorial

For a complete step-by-step guide to building a focus mode Chrome extension, see the [Tutorial](docs/tutorial.md). It covers:

- **Setup from scratch** — Create a complete Chrome extension project
- **Feature deep dives** — Understand how site blocking, timers, and session tracking work
- **Real-world examples** — Developer deep work, student study sessions, work-life balance
- **Troubleshooting** — Common issues and solutions

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/focus-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/focus-feature`
7. **Submit** a Pull Request

## See Also

### Related Zovo Repositories

- [chrome-tab-discard](https://github.com/theluckystrike/chrome-tab-discard) - Tab discarding
- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)

---

*Built by developers, for developers. No compromises on privacy.*
