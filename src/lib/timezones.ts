export const FALLBACK_TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Singapore",
    "Asia/Kolkata",
    "Australia/Sydney",
];

export function getTimezones() {
    if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
        try {
            return Intl.supportedValuesOf("timeZone");
        } catch {
            // Fall back to the curated list below.
        }
    }

    return FALLBACK_TIMEZONES;
}
