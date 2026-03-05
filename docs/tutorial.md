# Chrome Focus Mode — Complete Tutorial

A step-by-step guide to building a productivity Chrome extension with site blocking, Pomodoro timer, and session tracking using the `chrome-focus-mode` library.

## What Problem This Solves

Modern web browsing is filled with distractions—social media, news sites, video platforms—that fragment our attention and reduce productivity. Whether you're a developer needing deep focus time, a student studying for exams, or a professional trying to meet deadlines, constant interruptions from websites like Facebook, Twitter, YouTube, and Reddit can derail your workflow.

The `chrome-focus-mode` library provides a ready-made solution for Chrome extension developers who want to build productivity tools. Instead of implementing site blocking, timers, and session tracking from scratch, you can integrate this library and get all these features working in minutes.

### Key Problems It Solves

1. **Site Blocking** — Automatically block distracting websites during focus sessions using Chrome's Declarative Net Request API (Manifest V3 compliant)
2. **Pomodoro Timer** — Built-in countdown timer for structured focus sessions (default 25 minutes)
3. **Whitelist Management** — Allow essential work-related sites while blocking distractions
4. **Session History** — Track completed focus sessions for productivity analysis
5. **Preset Blocklists** — Pre-configured blocklists for Social, News, and Video categories

---

## Step-by-Step Setup from Zero to Working

This section walks you through creating a complete Chrome extension that uses `chrome-focus-mode` for focus sessions.

### Prerequisites

Before starting, ensure you have:

- **Node.js** (version 18 or higher) — [Download](https://nodejs.org/)
- **Google Chrome** browser — [Download](https://www.google.com/chrome/)
- A code editor like **VS Code** — [Download](https://code.visualstudio.com/)

### Step 1: Create Your Extension Project

Open your terminal and create a new directory for your extension:

```bash
mkdir my-focus-extension
cd my-focus-extension
npm init -y
```

### Step 2: Install Dependencies

Install the `chrome-focus-mode` library and TypeScript:

```bash
npm install chrome-focus-mode
npm install --save-dev typescript @types/chrome @types/node
```

### Step 3: Configure TypeScript

Create a `tsconfig.json` file in your project root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 4: Create the Extension Source Files

Create the following directory structure:

```
my-focus-extension/
├── src/
│   ├── background.ts      # Background script
│   ├── popup.html         # Extension popup UI
│   ├── popup.ts           # Popup logic
│   └── content.ts         # Optional content script
├── manifest.json          # Extension manifest
├── popup.html             # HTML for the popup
└── tsconfig.json
```

### Step 5: Create the Manifest File

Create `manifest.json` in your project root. This tells Chrome about your extension's permissions and files:

```json
{
  "manifest_version": 3,
  "name": "My Focus Timer",
  "version": "1.0.0",
  "description": "Block distracting sites and stay focused",
  "permissions": [
    "storage",
    "declarativeNetRequest"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "dist/background.js",
    "type": "module"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    }
  },
  "icons": {
    "16": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
  }
}
```

### Step 6: Create the Background Script

Create `src/background.ts`. This is where the FocusMode instance lives and manages blocking:

```typescript
import { FocusMode } from 'chrome-focus-mode';

// Create a single FocusMode instance for the extension
const focusMode = new FocusMode();

// Handle messages from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    switch (message.type) {
        case 'START_FOCUS':
            const duration = message.duration || 25;
            focusMode.setBlocklist(message.blocklist || FocusMode.PRESETS.SOCIAL);
            focusMode.setWhitelist(message.whitelist || []);
            focusMode.start(duration).then(() => {
                sendResponse({ success: true, remaining: focusMode.getRemainingFormatted() });
            });
            return true;

        case 'STOP_FOCUS':
            focusMode.stop().then((result) => {
                focusMode.saveSession();
                sendResponse({ success: true, duration: result.duration });
            });
            return true;

        case 'GET_STATUS':
            sendResponse({
                active: focusMode.isActive(),
                remaining: focusMode.getRemainingFormatted()
            });
            return true;
    }
});
```

### Step 7: Create the Popup HTML

Create `popup.html`. This is the UI users see when clicking the extension icon:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: #1a1a2e;
            color: #eee;
        }
        h2 { margin: 0 0 20px 0; font-size: 18px; }
        .status {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .status.inactive { background: #16213e; }
        .status.active { background: #0f3460; }
        .timer { font-size: 32px; font-weight: bold; margin: 10px 0; }
        button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            margin-bottom: 10px;
        }
        .start-btn { background: #e94560; color: white; }
        .stop-btn { background: #533483; color: white; }
        .presets { margin-top: 15px; }
        .preset-btn {
            background: #0f3460;
            color: #eee;
            width: auto;
            padding: 8px 12px;
            margin: 3px;
        }
        label { display: block; margin: 10px 0 5px; font-size: 12px; }
        input, select {
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #0f3460;
            background: #16213e;
            color: #eee;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <h2>🎯 Focus Mode</h2>
    
    <div class="status inactive" id="status">
        <div class="timer" id="timer">25:00</div>
        <div id="statusText">Ready to focus</div>
    </div>

    <label>Duration (minutes)</label>
    <select id="duration">
        <option value="15">15 minutes</option>
        <option value="25" selected>25 minutes</option>
        <option value="45">45 minutes</option>
        <option value="60">60 minutes</option>
    </select>

    <label>Blocklist Preset</label>
    <select id="preset">
        <option value="SOCIAL">Social Media</option>
        <option value="NEWS">News Sites</option>
        <option value="VIDEO">Video Platforms</option>
        <option value="ALL">All (Social + News + Video)</option>
    </select>

    <label>Custom domains (comma-separated)</label>
    <input type="text" id="customDomains" placeholder="example.com, distract.com">

    <div class="presets">
        <button class="preset-btn" data-preset="SOCIAL">Social</button>
        <button class="preset-btn" data-preset="NEWS">News</button>
        <button class="preset-btn" data-preset="VIDEO">Video</button>
    </div>

    <br><br>
    <button class="start-btn" id="startBtn">Start Focus Session</button>
    <button class="stop-btn" id="stopBtn" style="display:none;">End Session</button>

    <script src="dist/popup.js"></script>
</body>
</html>
```

### Step 8: Create the Popup Script

Create `src/popup.ts`. This handles user interactions in the popup:

```typescript
import { FocusMode } from 'chrome-focus-mode';

let isActive = false;
let updateInterval: number | null = null;

const statusEl = document.getElementById('status')!;
const timerEl = document.getElementById('timer')!;
const statusTextEl = document.getElementById('statusText')!;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const durationSelect = document.getElementById('duration') as HTMLSelectElement;
const presetSelect = document.getElementById('preset') as HTMLSelectElement;
const customDomainsInput = document.getElementById('customDomains') as HTMLInputElement;

function getBlocklist(): string[] {
    const preset = presetSelect.value;
    let domains: string[] = [];

    if (preset === 'SOCIAL') domains = FocusMode.PRESETS.SOCIAL;
    else if (preset === 'NEWS') domains = FocusMode.PRESETS.NEWS;
    else if (preset === 'VIDEO') domains = FocusMode.PRESETS.VIDEO;
    else if (preset === 'ALL') {
        domains = [...FocusMode.PRESETS.SOCIAL, ...FocusMode.PRESETS.NEWS, ...FocusMode.PRESETS.VIDEO];
    }

    // Add custom domains
    const custom = customDomainsInput.value
        .split(',')
        .map(d => d.trim())
        .filter(d => d.length > 0);
    
    return [...domains, ...custom];
}

async function updateStatus() {
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
    
    if (response.active) {
        isActive = true;
        statusEl.className = 'status active';
        statusTextEl.textContent = 'Focus mode active';
        timerEl.textContent = response.remaining;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
    } else {
        isActive = false;
        statusEl.className = 'status inactive';
        statusTextEl.textContent = 'Ready to focus';
        timerEl.textContent = '25:00';
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
    }
}

startBtn.addEventListener('click', async () => {
    const duration = parseInt(durationSelect.value);
    const blocklist = getBlocklist();
    
    await chrome.runtime.sendMessage({
        type: 'START_FOCUS',
        duration,
        blocklist
    });
    
    updateStatus();
    updateInterval = window.setInterval(updateStatus, 1000);
});

stopBtn.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'STOP_FOCUS' });
    
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
    
    updateStatus();
});

// Initial status check
updateStatus();
```

### Step 9: Compile and Load

Compile your TypeScript:

```bash
npx tsc
```

This creates a `dist/` folder with compiled JavaScript files.

### Step 10: Add a Placeholder Icon

Create a simple 128x128 PNG icon and name it `icon.png` in your project root. You can use any image or create one online.

### Step 11: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select your `my-focus-extension` folder

Your extension is now installed! Click the extension icon in Chrome's toolbar to open the popup and start a focus session.

---

## Features Explained

This section details each feature of the `chrome-focus-mode` library and how it works under the hood.

### 1. Site Blocking (declarativeNetRequest)

The library uses Chrome's **Declarative Net Request API**, which is required for Manifest V3 extensions. Unlike the old Web Request API, this doesn't require broad host permissions and is more privacy-friendly.

**How it works:**

```typescript
// Blocked domains are converted to DNR rules
const rules = blockedDomains.map((domain, i) => ({
    id: 50000 + i,
    priority: 1,
    action: { type: 'redirect', redirect: { url: 'about:blank' } },
    condition: { urlFilter: `*://${domain}/*`, resourceTypes: ['main_frame'] }
}));

// Rules are added to Chrome's dynamic rules
await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
    removeRuleIds: [] // Remove nothing
});
```

When a user visits a blocked site, Chrome automatically redirects them to `about:blank`. The blocking happens at the browser level, so it doesn't require a background script to stay running.

### 2. Pomodoro Timer

The built-in timer manages focus sessions:

```typescript
// Start a 25-minute session
await focus.start(25);

// Check remaining time
const remainingMs = focus.getRemaining();  // Returns milliseconds
const formatted = focus.getRemainingFormatted();  // Returns "24:59"
const isActive = focus.isActive();  // Returns boolean

// Timer automatically calls stop() when done
this.timer = setTimeout(() => this.stop(), this.sessionDuration);
```

The timer runs in the extension's context, not on a web page, so it continues even when all tabs are closed.

### 3. Whitelist Management

Allow essential sites during focus sessions:

```typescript
// Block social media but allow work tools
focus.setBlocklist(['facebook.com', 'twitter.com', 'instagram.com']);
focus.setWhitelist(['slack.com', 'notion.so', 'github.com']);

// Sites in the whitelist are never blocked
const rules = blockedDomains
    .filter(d => !whitelistDomains.includes(d))  // Exclude whitelisted
    .map(/* ... create rules ... */);
```

### 4. Session History

Track completed focus sessions for productivity analysis:

```typescript
// Sessions are automatically saved to chrome.storage.local
await focus.saveSession();

// Retrieved sessions include duration and blocked domains
const result = await chrome.storage.local.get('__focus_sessions__');
console.log(result.__focus_sessions__);
/*
[
    {
        start: 1699459200000,
        duration: 1500000,  // 25 minutes in ms
        blocked: ['facebook.com', 'twitter.com']
    },
    ...
]
*/
```

### 5. Preset Blocklists

Pre-configured blocklists for common distraction categories:

```typescript
// Social media preset
FocusMode.PRESETS.SOCIAL
// ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'reddit.com', 'x.com']

// News sites preset
FocusMode.PRESETS.NEWS
// ['cnn.com', 'bbc.com', 'news.google.com', 'nytimes.com']

// Video platforms preset
FocusMode.PRESETS.VIDEO
// ['youtube.com', 'netflix.com', 'twitch.tv', 'hulu.com']
```

You can combine presets:

```typescript
const allDistractions = [
    ...FocusMode.PRESETS.SOCIAL,
    ...FocusMode.PRESETS.NEWS,
    ...FocusMode.PRESETS.VIDEO
];
```

---

## Common Use Cases with Real Examples

### Example 1: Developer Deep Work Session

**Scenario:** You're a developer who needs 2 hours of uninterrupted coding time.

```typescript
const focus = new FocusMode();

// Block everything except essential dev tools
focus.setBlocklist([
    ...FocusMode.PRESETS.SOCIAL,
    ...FocusMode.PRESETS.NEWS,
    ...FocusMode.PRESETS.VIDEO,
    'discord.com',  // Add more distractions
    'reddit.com',
]);

// Allow your work tools
focus.setWhitelist([
    'github.com',   // Your code repos
    'stackoverflow.com',  // Debugging help
    'docs.microsoft.com', // Documentation
    'localhost:3000',  // Your local dev server
]);

// Start a 2-hour session (120 minutes)
await focus.start(120);
```

**Expected behavior:** When you try to visit Twitter, YouTube, or Reddit, you'll be redirected to a blank page. GitHub and Stack Overflow remain accessible.

### Example 2: Student Exam Preparation

**Scenario:** A student studying for finals needs to block distractions for structured study sessions.

```typescript
const studyFocus = new FocusMode();

// Use social media preset to start
studyFocus.setBlocklist(FocusMode.PRESETS.SOCIAL);

// Start multiple 25-minute Pomodoro sessions
async function studySession() {
    await studyFocus.start(25);  // 25-minute session
    
    // Take a 5-minute break
    await breakTime(5);
    
    // Repeat...
}

function breakTime(minutes) {
    return new Promise(resolve => setTimeout(resolve, minutes * 60000));
}
```

### Example 3: Work-Life Balance Blocker

**Scenario:** You want to stop checking work email and Slack after hours.

```typescript
const eveningFocus = new FocusMode();

// Block work-related sites in the evening
eveningFocus.setBlocklist([
    'mail.google.com',
    'slack.com',
    'teams.microsoft.com',
    'outlook.office.com',
]);

// This helps create boundaries between work and personal time
// Start this when you finish work for the day
await eveningFocus.start(480);  // 8 hours until midnight
```

### Example 4: Custom Blocking for Specific Task

**Scenario:** You're writing a document and want to block only specific time-wasting sites.

```typescript
const writingFocus = new FocusMode();

// Block only specific sites for your writing task
writingFocus.setBlocklist([
    'youtube.com',
    'netflix.com',
    '9gag.com',
]);

// No whitelist needed - only blocking specific sites
await writingFocus.start(60);
```

---

## Troubleshooting

This section covers common issues and how to resolve them.

### Issue: "Permission denied" when starting focus session

**Problem:** You see an error about permissions when calling `focus.start()`.

**Solution:** Ensure your `manifest.json` includes the required permissions:

```json
{
  "permissions": [
    "storage",
    "declarativeNetRequest"
  ],
  "host_permissions": [
    "<all_urls>"
  ]
}
```

After updating the manifest, reload your extension in `chrome://extensions/`.

---

### Issue: Sites not being blocked

**Problem:** Blocked sites still load normally.

**Possible causes:**

1. **Extension not loaded** — Verify the extension is installed and enabled
2. **Wrong domain format** — Ensure domains match exactly (e.g., use `youtube.com` not `www.youtube.com`)
3. **HTTPS vs HTTP** — The rules use `*://${domain}/*` which should catch both, but verify
4. **Cache** — Clear your browser cache or try in incognito mode

**Debugging tip:** Check Chrome's extension logs:

1. Go to `chrome://extensions/`
2. Find your extension and click "Service worker" link
3. Look at the Console for any errors

---

### Issue: Timer not showing correct remaining time

**Problem:** The timer shows incorrect time or doesn't update.

**Solution:** The timer needs to be polled from the popup. Ensure you're calling `GET_STATUS` periodically:

```typescript
// In popup.ts - update every second
setInterval(async () => {
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
    document.getElementById('timer').textContent = response.remaining;
}, 1000);
```

The timer runs in the background script, but the popup needs to actively request updates.

---

### Issue: "Manifest version 2" warning

**Problem:** Chrome shows a warning about Manifest V2.

**Solution:** Ensure your `manifest.json` uses `"manifest_version": 3`:

```json
{
  "manifest_version": 3,
  ...
}
```

The `chrome-focus-mode` library is designed for Manifest V3 only.

---

### Issue: Whitelist not working

**Problem:** Sites in the whitelist are still being blocked.

**Solution:** The whitelist is checked during rule creation. Make sure:

```typescript
// Correct usage
focus.setBlocklist(FocusMode.PRESETS.SOCIAL);
focus.setWhitelist(['instagram.com']);  // This won't work - it's in the blocklist!

// Instead, start with a larger blocklist but whitelist specific sites
focus.setBlocklist([...FocusMode.PRESETS.SOCIAL, ...FocusMode.PRESETS.VIDEO]);
focus.setWhitelist(['linkedin.com']);  // LinkedIn won't be blocked
```

The whitelist filters out domains from the blocklist before creating rules.

---

### Issue: Sessions not being saved

**Problem:** Session history is empty after stopping focus mode.

**Solution:** You must explicitly call `saveSession()`:

```typescript
// In your stop handler
const result = await focus.stop();
await focus.saveSession();  // This saves to chrome.storage.local
```

---

### Issue: Cannot load unpacked extension

**Problem:** Chrome says the extension cannot be loaded.

**Common causes and solutions:**

1. **Missing manifest.json** — Ensure it's in the project root
2. **Invalid JSON in manifest** — Validate using [Chrome Extension Manifest Validator](https://chrome.google.com/webstore/detail/json-validator/aimiipgcinmecomfepbgkjilbbcjnebfh)
3. **Missing required fields** — Manifest must have `name` and `version`
4. **File path errors** — Ensure background script path in manifest matches actual file location

---

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/theluckystrike/chrome-focus-mode/issues) for similar problems
2. Review Chrome's [Extension Development Documentation](https://developer.chrome.com/docs/extensions/mv3/)
3. Examine the library source code in `src/focus.ts` for implementation details

---

## Summary

You've now learned how to:

1. ✅ Install and set up the `chrome-focus-mode` library
2. ✅ Create a complete Chrome extension with focus mode features
3. ✅ Use all library features: site blocking, timers, whitelists, and session history
4. ✅ Customize the extension for different use cases
5. ✅ Troubleshoot common issues

The `chrome-focus-mode` library handles all the complexity of site blocking and timer management, letting you focus on building a great user interface for your productivity extension.
