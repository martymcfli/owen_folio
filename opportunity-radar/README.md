# Opportunity Radar

Real-time AI career intelligence engine that scans breaking news and predicts emerging job opportunities before they're posted.

## How It Works

1. Enter an industry topic or news query
2. Gemini AI with Google Search Grounding scans live news sources
3. Returns opportunity cards with predicted job roles, impact scores, and strategic portfolio project ideas

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini 3 Flash with real-time Search Grounding
- **Charts**: Recharts for impact visualization
- **Icons**: Lucide React
- **Build**: Vite 6

## Run Locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and add your [Gemini API key](https://aistudio.google.com/apikey)
3. Run: `npm run dev`

## Demo

The `demo.html` file provides a fully interactive preview with realistic mock data — no API key required.

## Related

Part of the [Culture Heat Map](https://cultheatmap-vt5pqowf.manus.space) ecosystem — company culture intelligence meets career opportunity forecasting.
