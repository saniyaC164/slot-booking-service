# Decisions

## Auth
Used Auth.js credentials provider for simplicity.

## Database
Used Prisma + PostgreSQL because of strong type safety and fast iteration.

## Timezones
Stored slot timestamps in UTC and formatted them using each user’s saved timezone preference, which keeps the UI consistent for both providers and booking users.

## Booking Safety
Used Prisma transactions and slot ownership checks to prevent double booking and to make rescheduling/cancellation flows safe.

## Tradeoffs
Did not implement email notifications.
Did not implement provider availability recurrence rules.

## With More Time
Add optimistic UI.
Add tests.
Add calendar integration.
Add slot recurrence support.