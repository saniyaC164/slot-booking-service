# Decisions

## Auth
Used Auth.js credentials provider for simplicity.

## Database
Used Prisma + PostgreSQL because of strong type safety and fast iteration.

## Timezones
Stored all dates in UTC and converted to local timezone in the browser.

## Booking Safety
Used database transaction to prevent double booking.

## Tradeoffs
Did not implement email notifications.
Did not implement provider availability recurrence rules.

## With More Time
Add optimistic UI.
Add tests.
Add calendar integration.
Add slot recurrence support.