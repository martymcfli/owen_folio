# VibeDrive

**Your drive has a soundtrack. It ends exactly when you arrive.**

VibeDrive is an AI-powered travel companion that generates perfectly-timed playlists synchronized to your drive time. Enter your route and a vibe — the AI builds a playlist where the total runtime matches your estimated travel time down to the second. The last song is always an arrival anthem.

## The Idea

We've all had that moment: you're driving, the sun is setting, the perfect song comes on — and suddenly life feels like a movie. VibeDrive engineers that feeling on demand.

- **Enter your route** — Brooklyn to Montauk, Austin to Marfa, anywhere
- **Choose a vibe** — Sunset Drive, Late Night Synthwave, 90s Hip Hop, Cinematic
- **AI builds your soundtrack** — Gemini 2.5 Flash with Google Maps calculates your drive time, then curates a playlist that fills it *exactly*
- **Drive Mode** — Spinning vinyl player, real-time progress, trip countdown, and an "ARRIVED — Perfect Timing" overlay when you pull in

## How It Works

```
Route Input → Google Maps (drive time) → Gemini AI (playlist curation) → Synchronized Playback
```

1. **Google Maps Grounding** — Gemini uses the `googleMaps` tool to calculate realistic drive times
2. **Smart Curation** — The AI picks songs that match your vibe AND fit the timeline. Each track has a `reasoning` explaining why it belongs at that point in the journey
3. **Arrival Anthem** — The final track is always high-energy or emotionally fitting for your destination
4. **Music Service Integration** — Connect Spotify or Apple Music (simulated in demo)

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI:** Google Gemini 2.5 Flash with Google Maps tool
- **Design:** Space Grotesk font, neon purple/cyan palette, glass-morphism
- **Icons:** Lucide React
- **Build:** Vite 6

## Run Locally

```bash
npm install
cp .env.example .env.local
# Add your Gemini API key to .env.local
npm run dev
```

**Note:** Requires a Gemini API key with access to the `googleMaps` tool (Gemini 2.5 Flash).

## Demo

The `demo.html` file provides a fully interactive experience with pre-loaded trips:
- **Brooklyn → Montauk** with "Sunset Drive" vibe (12 curated tracks)
- **Late Night Synthwave** variant
- Accelerated playback (8x speed) so you can experience the full flow in ~17 minutes
- Working vinyl animation, playlist drawer, progress sync, and arrival overlay

No API key required for the demo.

## Why This Matters

This isn't just a playlist generator. It's a timing engine. The constraint — *total playlist duration must match drive time* — forces the AI to think about pacing, arc, and arrival. That's what makes it feel magical.

---

Built by [Owen McCormick](https://omccormick.com) — because the best drives deserve the best soundtracks.
