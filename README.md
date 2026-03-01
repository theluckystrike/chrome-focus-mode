# chrome-focus-mode — Focus Mode for Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i chrome-focus-mode`

Block distracting sites, timed Pomodoro sessions, whitelist, session history, and presets.

```typescript
import { FocusMode } from 'chrome-focus-mode';
const focus = new FocusMode();
focus.setBlocklist(FocusMode.PRESETS.SOCIAL);
await focus.start(25);
console.log(focus.getRemainingFormatted());
```
MIT License
