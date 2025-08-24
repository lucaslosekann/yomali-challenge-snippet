const url = "http://localhost:3000/tracking";

type VisitPayload = {
    visitorId: string;
    pageUrl: string;
};

function getVisitorId(): string {
    const KEY = "yomali_tracker_visitor_id";
    let id = localStorage.getItem(KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(KEY, id);
    }
    return id;
}

export function sendVisit() {
    const payload: VisitPayload = {
        visitorId: getVisitorId(),
        pageUrl: window.location.href,
    };

    if (navigator.sendBeacon) {
        navigator.sendBeacon(url, JSON.stringify(payload));
    } else {
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
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

if (typeof process === "undefined" || process.env.NODE_ENV !== "test") {
    sendVisit();
    trackPageChange(() => {
        sendVisit();
    });
}
