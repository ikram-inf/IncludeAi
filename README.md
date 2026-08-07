# Momentum

Momentum is a focus companion app designed for people with ADHD. Instead of relying on willpower or self-discipline, it externalizes the things ADHD makes difficult — tracking time, breaking down tasks, capturing stray thoughts, and staying motivated — so the app helps regulate focus instead of the person having to do it alone.

## Why Momentum

ADHD challenges are rarely about *knowing* what to do. They're about **starting**, **staying on task**, and **feeling rewarded** for following through. Momentum is built around that gap:

- **Time blindness** → a visible, externally-paced timer instead of relying on an internal sense of time.
- **Task paralysis** → tasks broken into small, concrete micro-steps to lower the activation energy needed to start.
- **Intrusive thoughts breaking focus** → a dedicated space to quickly park a thought without losing it or breaking flow.
- **Getting stuck with no next step** → an AI assistant that acts as an external executive function to help think things through.
- **Motivation that needs immediate reward** → a visual, growing reward system instead of a plain checklist.
- **Trouble sensing transitions** → ambient sound and completion chimes to mark the start and end of a focus block clearly.

## Features

- **Focus Timer** — Pomodoro-style focus, short break, and long break timers with configurable durations and auto-start options.
- **AI Chat** — An in-app assistant (powered by the Gemini API) to help you plan, think through problems, or get unstuck.
- **To-Do List** — Tasks with priorities, estimated Pomodoros, and micro-steps to make starting easier.
- **Thought Parking Lot** — Quickly jot down stray thoughts during a focus session so you can deal with them later without losing focus.
- **Garden & Butterflies** — Earn butterflies as rewards for completed focus sessions and grow your own garden over time.
- **Ambient Sound & Completion Chimes** — Optional ambient audio during focus sessions and a chime when a session completes.

## Tech Stack

- React 19 + Vite
- Express server
- TypeScript
- Tailwind CSS
- Motion (animations)
- @google/genai (AI chat features)

## Getting Started

1. Install dependencies

   npm install

2. Configure environment variables

   Copy .env.example to .env.local and set your Gemini API key:

   cp .env.example .env.local

   GEMINI_API_KEY="your-gemini-api-key"

3. Run the app

   npm run dev

   The app will start locally — check your terminal output for the URL (typically http://localhost:5173).

## Available Scripts

| Script          | Description                                             |
| --------------- | -------------------------------------------------------- |
| npm run dev     | Start the app in development mode                        |
| npm run build   | Build the client and bundle the server for production    |
| npm start       | Run the production build                                 |
| npm run clean   | Remove build output                                      |
| npm run lint    | Type-check the project with tsc                          |

## Project Structure
IncludeAI/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages
│   ├── assets/          # Images, icons, and static assets
│   ├── services/        # API and AI integration
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Public static files
├── server/              # Backend server files
├── .gitignore
├── package.json
├── README.md
└── .env

This project currently has no license specified.
