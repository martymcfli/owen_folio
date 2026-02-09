# Personal Operations Dashboard

**Raspberry Pi 4 · Always On · Real-Time Tracking**

A self-hosted productivity and life metrics dashboard running 24/7 on a headless Raspberry Pi 4. Collects data from multiple APIs, stores it locally in SQLite, and visualizes everything through a custom web interface.

## What It Tracks

**Work & Productivity**
- GitHub commits per week
- Emails sent/received (Gmail API)
- Calendar utilization (% of week in meetings)
- Job applications submitted & response rates

**Health & Habits**
- Daily steps (Apple Health sync)
- Workout sessions logged
- Days since last music production session
- Books finished this month

**Finance**
- Monthly spending by category (Plaid API)
- Budget vs. actual
- Net worth trend

## Tech Stack

| Layer | Tool |
|-------|------|
| Hardware | Raspberry Pi 4 (4GB RAM) |
| OS | Raspberry Pi OS Lite (headless) |
| Database | SQLite |
| Dashboard | Custom HTML/CSS/JS + Chart.js |
| Data Collection | Python scripts + cron jobs |
| APIs | Gmail, Google Calendar, GitHub, Apple Health, Plaid |

## Key Insight

Tracking these metrics consistently revealed that days with fewer than 4 hours of meetings correlate with 3x higher deep work output. That led to aggressively blocking focus time on the calendar — a simple change with outsized impact.

---

**[View Live Dashboard](https://omccormick.com/personal-ops-dashboard/dashboard.html)** · **[Back to Portfolio](https://omccormick.com)**
