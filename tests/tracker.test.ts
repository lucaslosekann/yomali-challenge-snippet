import { sendVisit, trackPageChange } from "../src/index";

describe("Tracker snippet", () => {
    beforeEach(() => {
        localStorage.clear();
        (global as any).navigator.sendBeacon = jest.fn();
        (global as any).fetch = jest.fn(() => Promise.resolve({ ok: true }));
    });

    it("should generate a visitorId and send beacon", () => {
        sendVisit();
        expect(localStorage.getItem("yomali_tracker_visitor_id")).toBeTruthy();
        expect(navigator.sendBeacon).toHaveBeenCalled();
    });

    it("should fallback to fetch if sendBeacon not available", () => {
        (global as any).navigator.sendBeacon = undefined;
        sendVisit();

        expect(fetch).toHaveBeenCalled();
    });

    it("should reuse the same visitorId", () => {
        sendVisit();
        const firstId = localStorage.getItem("yomali_tracker_visitor_id");
        sendVisit();
        const secondId = localStorage.getItem("yomali_tracker_visitor_id");

        expect(firstId).toBe(secondId);
    });

    it("should sened visist again on page change", () => {
        const sendVisitMock = jest.fn();

        trackPageChange(sendVisitMock);

        history.pushState({}, "", "/new-page");
        expect(sendVisitMock).toHaveBeenCalledTimes(1);

        history.replaceState({}, "", "/another-page");
        expect(sendVisitMock).toHaveBeenCalledTimes(2);

        window.dispatchEvent(new PopStateEvent("popstate"));
        expect(sendVisitMock).toHaveBeenCalledTimes(3);
    });
});
