# APDP Frontend — Agentic Pharmacological Data Platform

A Next.js chat interface for querying drug-food, drug-herb, and drug-drug interactions. Users ask natural language questions and receive clinically formatted responses powered by the APDP backend pipeline.

## Features

- **Chat Interface** — conversational UI for drug interaction queries with message history
- **Spelling Correction Flow** — interactive UI for confirming or correcting misspelled drug/food/herb names
- **Clarification Flow** — prompts users for missing information when queries are incomplete, supports repeated clarifications
- **Markdown Rendering** — formatted responses with headers, lists, and emphasis via React Markdown
- **Responsive Design** — works on desktop and mobile with auto-resizing input

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Markdown:** react-markdown
- **Deployment:** Vercel

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── Message_bubble.tsx   # Message rendering (normal, clarification, spelling, error)
│   │   ├── MessageList.tsx      # Scrollable message list with loading indicator
│   │   └── Navbar.tsx           # Top navigation bar
│   ├── types/
│   │   └── chat.ts             # TypeScript types for messages and API responses
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── page.tsx                # Main chat page (state management, API calls)
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   └── favicon.ico
├── public/                     # Static assets
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── eslint.config.mjs
```

## Getting Started

### Prerequisites

- Node.js 18+
- APDP backend running (locally or deployed)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/samsaw777/apdp-project-frontend.git
   cd apdp-project-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

   Set the backend URL:

   ```
   NEXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable               | Required | Description                                                 |
| ---------------------- | -------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE` | Yes      | Backend API base URL (e.g., `http://localhost:8000/api/v1`) |

## How It Works

The frontend communicates with two backend endpoints:

1. **`POST /analyse`** — sends the user's query. The response is either a final answer (rendered as markdown), a spelling correction prompt (rendered with confirm/correct UI), or a clarification request (rendered with an input field).

2. **`POST /analyse/confirm`** — sends the user's reply to a spelling or clarification prompt. The response can be a final answer or another clarification if more information is still needed.

All response handling is unified through a single `handleBotResponse` function that checks the response type and renders the appropriate UI component.

## Message Types

| Type            | Description                       | UI Component                      |
| --------------- | --------------------------------- | --------------------------------- |
| `normal`        | Final formatted answer            | Markdown bubble                   |
| `clarification` | Spelling correction needed        | Confirm button + correction input |
| `missing`       | Incomplete query, needs more info | Text input field                  |
| `error`         | API or connection error           | Red error bubble                  |

## Deployment

The frontend is deployed on Vercel. Push to `main` triggers automatic deployment. Set `NEXT_PUBLIC_API_BASE` in Vercel's environment variables to point to the deployed backend URL.
