# Apollo → HubSpot Lead Handoff Automation

**🎯 [VIEW LIVE DASHBOARD](./dashboard.html)** ← Click to see interactive lead pipeline

Built for **Voxitech** (Sri Lankan AI startup) to automatically sync qualified leads from Apollo cold outreach into HubSpot CRM.

## The Problem

Voxitech was running cold outreach via Apollo.io to break into the US market, but:
- Sales reps manually copy/pasted leads who replied into HubSpot
- 30% of qualified leads got forgotten in the handoff
- No systematic way to prioritize high-value prospects
- First follow-up averaged 3-4 days (too slow for enterprise sales)

**Result:** Lost deals because we were too slow to follow up.

## The Solution

Python script that automatically:
1. ✅ Fetches leads who replied to Apollo sequences
2. ✅ Scores lead quality (0-100) based on:
   - Company size (ideal: 50-500 employees)
   - Funding stage (prefer Series A-C)
   - Tech stack match (uses AI/ML tools)
   - Response sentiment (positive = higher score)
3. ✅ Auto-creates HubSpot contacts for qualified leads (score ≥40)
4. ✅ Sets lead status: "QUALIFIED" (≥70) or "UNQUALIFIED" (40-69)

## Results

- **Before:** 30% of replies fell through cracks, 3-4 day follow-up
- **After:** 0% lost leads, same-day follow-up for high-quality prospects
- **Impact:** Landed first US DoD contract within 6 months

## Interactive Demo

**[→ Open the dashboard](./dashboard.html)** to see:
- Live lead pipeline visualization
- Real-time lead scoring in action
- Top qualified prospects ranked by score
- Response time impact on conversion rates

*Note: Dashboard uses ABC Company mock data for demonstration. Lead scoring algorithm is production-ready.*

## How to Use

```bash
# Install dependencies
pip install requests

# Add your API keys
# Edit sync_leads.py and replace:
# APOLLO_API_KEY = "your_key_here"
# HUBSPOT_API_KEY = "your_key_here"

# Run sync (can be automated via cron)
python sync_leads.py
```

## Lead Scoring Logic

| Criteria | Points | Notes |
|----------|--------|-------|
| Base score | 50 | Everyone starts here |
| Company size (50-500) | +20 | Sweet spot for mid-market |
| Funding (Series A-C) | +15 | Has budget, not too corporate |
| Tech stack (AI/ML) | +15 | Already using relevant tools |
| Positive reply | +10 | "Interested" > "Maybe later" |

**Total possible:** 100 points

## Automation Options

**Option 1: Cron job (Mac/Linux)**
```bash
# Run every hour
0 * * * * cd /path/to/apollo-hubspot-handoff && python sync_leads.py
```

**Option 2: Zapier webhook**
- Trigger: New reply in Apollo
- Action: Run Python script
- Benefit: Real-time sync (no delays)

## Tech Stack

- **Python 3** for script logic
- **Apollo.io API** for outreach data
- **HubSpot API** for CRM sync
- **Lead scoring algorithm** (custom, tuned for B2B SaaS)
- **Chart.js** for dashboard visualizations

---

**Built by Owen McCormick** | [LinkedIn](https://linkedin.com/in/owenpmccormick) | [Full Portfolio](https://github.com/owenpmccormick)
