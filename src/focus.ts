/**
 * Focus Mode — Block distracting sites with timer sessions
 */
export class FocusMode {
    private blockedDomains: string[] = [];
    private whitelistDomains: string[] = [];
    private active = false;
    private sessionStart = 0;
    private sessionDuration = 0;
    private timer: any = null;
    private ruleIds: number[] = [];

    /** Set domains to block */
    setBlocklist(domains: string[]): this { this.blockedDomains = domains; return this; }

    /** Set allowed domains during focus */
    setWhitelist(domains: string[]): this { this.whitelistDomains = domains; return this; }

    /** Start focus session */
    async start(durationMinutes: number = 25): Promise<void> {
        this.active = true; this.sessionStart = Date.now(); this.sessionDuration = durationMinutes * 60000;

        const rules = this.blockedDomains
            .filter((d) => !this.whitelistDomains.includes(d))
            .map((domain, i) => ({
                id: 50000 + i, priority: 1,
                action: { type: 'redirect' as any, redirect: { url: 'about:blank' } },
                condition: { urlFilter: `*://${domain}/*`, resourceTypes: ['main_frame'] as any },
            }));

        this.ruleIds = rules.map((r) => r.id);
        await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: this.ruleIds, addRules: rules });

        this.timer = setTimeout(() => this.stop(), this.sessionDuration);
    }

    /** Stop focus session */
    async stop(): Promise<{ duration: number; blocked: string[] }> {
        if (this.timer) { clearTimeout(this.timer); this.timer = null; }
        const duration = Date.now() - this.sessionStart;

        if (this.ruleIds.length) {
            await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: this.ruleIds, addRules: [] });
        }

        const result = { duration, blocked: [...this.blockedDomains] };
        this.active = false; this.ruleIds = [];
        return result;
    }

    /** Get remaining time in ms */
    getRemaining(): number {
        if (!this.active) return 0;
        return Math.max(0, this.sessionDuration - (Date.now() - this.sessionStart));
    }

    /** Check if focus mode is active */
    isActive(): boolean { return this.active; }

    /** Get formatted remaining time */
    getRemainingFormatted(): string {
        const ms = this.getRemaining();
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    /** Save session history */
    async saveSession(): Promise<void> {
        const result = await chrome.storage.local.get('__focus_sessions__');
        const sessions = (result.__focus_sessions__ as any[]) || [];
        sessions.push({ start: this.sessionStart, duration: Date.now() - this.sessionStart, blocked: this.blockedDomains });
        await chrome.storage.local.set({ __focus_sessions__: sessions });
    }

    /** Common distraction presets */
    static readonly PRESETS = {
        SOCIAL: ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'reddit.com', 'x.com'],
        NEWS: ['cnn.com', 'bbc.com', 'news.google.com', 'nytimes.com'],
        VIDEO: ['youtube.com', 'netflix.com', 'twitch.tv', 'hulu.com'],
    };
}
