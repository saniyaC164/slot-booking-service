# Slot Booking Service

A small appointment booking app built with Next.js, Prisma, PostgreSQL, and NextAuth.

## What is included
- Providers can create slots.
- Users can browse available slots, filter by provider, and book them.
- Users can view, cancel, and reschedule their bookings.
- Demo seed data creates provider and user accounts, sample slots, and a sample booking so the app is immediately usable.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a PostgreSQL database and set the connection string:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/slot_booking"
   ```
3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed demo data:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Demo accounts
- Provider: provider@example.com / password123
- User: user@example.com / password123

## Notes
The app stores slot times in UTC and formats them with each user’s saved timezone preference so providers and booking users see appointments in a familiar local time.
