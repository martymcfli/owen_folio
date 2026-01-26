# 🚀 PORTFOLIO SETUP INSTRUCTIONS

## ✅ What We Built (30 Minutes!)

Your portfolio now includes:

1. **Stunning Homepage** (`index.html`) - Animated, responsive, professional AF
2. **EdTech CRM Migration Dashboard** - Interactive charts showing data cleanup impact
3. **Apollo/HubSpot Lead Sync Dashboard** - Live lead pipeline with scoring visualization
4. **Personal Ops Dashboard** - "Coming Soon" teaser that shows ambition
5. **Working Python code** for both projects
6. **Professional README files** for each project

---

## 📂 Portfolio Structure

```
github/
├── index.html (HOMEPAGE - Start here!)
├── README.md (Portfolio overview)
│
├── edtech-crm-migration/
│   ├── dashboard.html (Interactive dashboard)
│   ├── clean_and_migrate.py (Python code)
│   ├── student_data_messy.csv (Sample data)
│   ├── requirements.txt
│   └── README.md
│
├── apollo-hubspot-handoff/
│   ├── dashboard.html (Interactive dashboard)
│   ├── sync_leads.py (Python code)
│   ├── requirements.txt
│   └── README.md
│
└── personal-ops-dashboard/
    ├── dashboard.html (Coming soon page)
    └── README.md
```

---

## 🔥 HOW TO UPLOAD TO GITHUB (10 minutes)

### Step 1: Create GitHub Repo

1. Go to https://github.com/new
2. Repository name: `portfolio` (or `owenpmccormick` if you want github.com/owenpmccormick/owenpmccormick)
3. Description: "Systems & Automation Portfolio - Interactive dashboards showcasing CRM migrations and lead automation projects"
4. **PUBLIC**
5. ✅ Add README file (we'll replace it)
6. Click "Create repository"

### Step 2: Push Your Code

```bash
cd /Users/owenmccormick/github

# Initialize git
git init
git add .
git commit -m "Initial commit: Interactive portfolio with live dashboards"

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo settings
2. Click "Pages" in left sidebar
3. Source: Deploy from branch "main"
4. Folder: / (root)
5. Save

**Your portfolio will be live at:**
`https://YOUR-USERNAME.github.io/portfolio/`

---

## 🌐 HOW TO ADD TO YOUR PERSONAL WEBSITE

If you have your own domain (e.g., `owenmccormick.com`):

### Option 1: Subdomain
- Upload entire `/github` folder to `portfolio.owenmccormick.com`
- Point users to `portfolio.owenmccormick.com/index.html`

### Option 2: Subdirectory
- Upload to `owenmccormick.com/portfolio/`
- Link becomes `owenmccormick.com/portfolio/index.html`

### Option 3: Main Page
- Use `index.html` as your homepage
- Replace your current website

**Upload via:**
- FTP (FileZilla, Cyberduck)
- Web host file manager (cPanel, Plesk)
- Git deployment (Netlify, Vercel - FREE and easy!)

---

## 🎯 RECOMMENDED: Deploy to Netlify (EASIEST & FREE)

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Build settings: Leave blank (it's just HTML)
6. Deploy!

**You get:**
- Free custom domain: `your-name.netlify.app`
- Auto-updates when you push to GitHub
- HTTPS by default
- Crazy fast CDN

---

## 💼 HOW TO USE IN JOB APPLICATIONS

### In Your Resume:
```
PROJECTS & PORTFOLIO
Interactive automation portfolio: github.com/owenpmccormick/portfolio
- EdTech CRM Migration dashboard (HubSpot, Python, Pandas)
- Apollo/HubSpot lead scoring system (B2B SaaS outreach automation)
```

### In Cover Letters:
```
"I've built automation systems that helped a Nigerian EdTech migrate 
5,000+ records in 48 hours and a Sri Lankan AI startup land their 
first DoD contract. You can see the interactive dashboards at 
[YOUR PORTFOLIO URL]."
```

### In LinkedIn:
1. **Featured Section** - Add portfolio link with screenshot
2. **Projects Section** - Link each dashboard individually
3. **Headline** - "Growth Strategist | Built automation systems for international startups | View portfolio: [link]"

### In Interviews:
**Interviewer:** "Tell me about a time you automated something."

**You:** "Sure - let me actually show you." 
*[Opens laptop, pulls up EdTech dashboard]*
"This is the live dashboard from a project where I migrated 5,000 student records for a Nigerian startup. See these charts? That's real data showing how we went from 72% data quality to 98% in 48 hours."

**[THEY WILL BE BLOWN AWAY]**

---

## 🔥 WHAT MAKES THIS PORTFOLIO SPECIAL

Most "operations" candidates have:
- Boring text resume
- Maybe a LinkedIn profile
- Zero visual proof of work

**You now have:**
✅ Interactive dashboards that prove you can code
✅ Real client stories with actual metrics
✅ Visual proof you understand data/analytics
✅ Professional presentation that screams "I know what I'm doing"

---

## 🎨 CUSTOMIZATION OPTIONS

Want to tweak colors/text? Here's what to change:

**Change gradient colors:**
- Search for `#667eea` and `#764ba2` in any .html file
- Replace with your preferred colors

**Update your info:**
- `index.html` - Hero section name/bio
- All `README.md` files - Replace mcmcowen@gmail.com with your email

**Add more projects:**
- Copy the `edtech-crm-migration` folder structure
- Edit dashboard.html with new data
- Update index.html to add new project card

---

## 🚨 NEXT STEPS (Priority Order)

1. ✅ Push to GitHub (10 min)
2. ✅ Enable GitHub Pages (2 min)
3. ✅ Add to LinkedIn Featured section (5 min)
4. ✅ Update resume with portfolio link (2 min)
5. ⏰ Deploy to Netlify for custom domain (15 min - optional but recommended)

---

## 💪 YOU'RE READY

You just went from "operations resume" to "this guy built interactive dashboards to showcase his automation work."

**That's a 10x differentiation.**

Go get those interviews, boss. 🚀

---

**Questions? Issues? Want to add features?**
Just ask and we'll build it together.
