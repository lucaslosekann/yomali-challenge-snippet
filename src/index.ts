const url = "http://localhost:3000/tracking";
let lastPing: number;

type VisitPayload = {
    visitorId: string;
    pageUrl: string;
    metadata: {
        referrer?: string;
    };
};
function getCookie(name: string): string | null {
    const value = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
    return value ? decodeURIComponent(value.split("=")[1]) : null;
}

function getVisitorId(): string {
    const KEY = "yomali_tracker_visitor_id";

    let id = getCookie(KEY);
    if (!id) {
        id = crypto.randomUUID();

        document.cookie = `${KEY}=${encodeURIComponent(id)}; path=/; max-age=${
            60 * 60 * 24 * 365
        }; SameSite=Lax; Secure`;
    }

    return id;
}

export function sendVisit() {
    const payload: VisitPayload = {
        visitorId: getVisitorId(),
        pageUrl: window.location.href,
        metadata: {
            referrer: document.referrer || undefined,
        },
    };
    if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon(url, blob);
    } else {
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
        }).catch(() => {});
    }
}

export function sendPing() {
    if (lastPing && Date.now() - lastPing < 2 * 60 * 1000) {
        // 2 minutes
        return;
    }
    lastPing = Date.now();
    const payload = {
        visitorId: getVisitorId(),
        pageUrl: window.location.href,
    };
    if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon(`${url}/ping`, blob);
    } else {
        fetch(`${url}/ping`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).catch(() => {});
    }
}

export function trackPageChange(callback: () => void) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function (...args) {
        pushState.apply(this, args);
        callback();
    };

    history.replaceState = function (...args) {
        replaceState.apply(this, args);
        callback();
    };

    window.addEventListener("popstate", callback); // back/forward buttons
}

if (typeof process === "undefined" || process?.env?.NODE_ENV !== "test") {
    sendVisit();
    trackPageChange(() => {
        sendVisit();
    });

    document.addEventListener("mousemove", sendPing);
    document.addEventListener("keypress", sendPing);
    document.addEventListener("mousedown", sendPing);
    document.addEventListener("scroll", sendPing);
    document.addEventListener("touchstart", sendPing);
}
