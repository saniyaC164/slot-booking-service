export function formatDateTime(value: string | Date, timezone: string) {
    const date = typeof value === "string" ? new Date(value) : value;

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: timezone,
    }).format(date);
}
