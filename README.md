# chrome-focus-mode

Focus mode toolkit for Chrome MV3 extensions. Block distracting sites with declarativeNetRequest rules, run timed Pomodoro sessions, manage a whitelist, persist session history to chrome.storage, and use built-in domain presets for social media, news, and video sites. Ships with full TypeScript definitions.

INSTALL

```bash
npm install chrome-focus-mode
```

Your extension manifest needs the declarativeNetRequest and storage permissions.

QUICK START

```typescript
import { FocusMode } from "chrome-focus-mode";

const focus = new FocusMode();

// Load a preset blocklist and allow one domain through
focus.setBlocklist(FocusMode.PRESETS.SOCIAL);
focus.setWhitelist(["reddit.com"]);

// Start a 25-minute session (default is 25 if omitted)
await focus.start(25);

// Check status while running
console.log(focus.isActive());            // true
console.log(focus.getRemainingFormatted()); // "24:58"
console.log(focus.getRemaining());         // milliseconds left

// End early and get a summary
const result = await focus.stop();
// result.duration  -> elapsed ms
// result.blocked   -> ["facebook.com", "twitter.com", ...]

// Persist the session for later analytics
await focus.saveSession();
```

API REFERENCE

FocusMode (class)

setBlocklist(domains: string[]): this
    Accepts an array of domain strings to block during focus. Returns the instance for chaining.

setWhitelist(domains: string[]): this
    Accepts an array of domain strings that should remain accessible even if they appear in the blocklist. Returns the instance for chaining.

start(durationMinutes?: number): Promise<void>
    Activates focus mode. Installs declarativeNetRequest dynamic rules that redirect blocked domains to about:blank. Defaults to 25 minutes. Automatically calls stop() when time runs out.

stop(): Promise<{ duration: number; blocked: string[] }>
    Ends the session, removes all blocking rules, and returns an object with the elapsed time in milliseconds and the list of domains that were blocked.

isActive(): boolean
    Returns true while a session is running.

getRemaining(): number
    Returns the number of milliseconds left in the current session, or 0 if no session is active.

getRemainingFormatted(): string
    Returns the remaining time as a "m:ss" string, e.g. "12:05".

saveSession(): Promise<void>
    Writes the current session (start timestamp, duration, blocked domains) to chrome.storage.local under the key __focus_sessions__.

FocusMode.PRESETS (static)

PRESETS.SOCIAL
    facebook.com, twitter.com, instagram.com, tiktok.com, reddit.com, x.com

PRESETS.NEWS
    cnn.com, bbc.com, news.google.com, nytimes.com

PRESETS.VIDEO
    youtube.com, netflix.com, twitch.tv, hulu.com

LICENSE

MIT. See the LICENSE file for details.

ABOUT

chrome-focus-mode is maintained by theluckystrike and published through zovo.one, a small studio focused on privacy-first Chrome extensions and developer tooling.

https://github.com/theluckystrike/chrome-focus-mode
