# Fitness Journal Client

This is the Next.js client application for the Fitness Journal project.

## Features

- **Home Dashboard**: Shows real-time statistics including weekly sessions, total duration, and current streak
- **Journal**: Displays all workout entries fetched from the server
- **Add Entry**: Form to create new workout entries that are saved to the server

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the API URL (optional):
   Create a `.env.local` file in the client directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
   If not set, it defaults to `http://localhost:4000`.

3. Make sure the server is running on the configured port (default: 4000)

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Integration

The client now connects to the real server API:

- **GET /entries**: Fetches all workout entries
- **POST /entries**: Creates a new workout entry
- **GET /entries/:id**: Fetches a specific entry by ID

All API calls are handled through the `lib/api.ts` utility functions.
