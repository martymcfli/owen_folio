# EdTech CRM Migration Toolkit

## **[🚀 VIEW LIVE INTERACTIVE DASHBOARD →](https://owenpmccormick.github.io/edtech-crm-migration/dashboard.html)**

*Click above to see real-time migration metrics, data quality improvements, and enrollment analytics*

---

Built for **Talstack** (Nigerian EdTech startup) to migrate 5,000+ student records from messy Google Sheets into HubSpot.

## The Problem

Talstack had student data spread across 12 different Google Sheets:
- Duplicate contacts (same student enrolled multiple times)
- Inconsistent phone formats (some with country codes, some without)
- Missing or invalid email addresses
- No clear enrollment status tracking

**Result:** Sales team wasting hours manually cleaning data instead of enrolling students.

## The Solution

Python script that:
1. ✅ Removes duplicate students (keeps most recent enrollment)
2. ✅ Standardizes Nigerian phone numbers to E.164 format (+234...)
3. ✅ Validates email addresses
4. ✅ Maps enrollment statuses to HubSpot deal stages
5. ✅ Exports clean CSV ready for HubSpot import

## Results

- **Before:** 5,247 messy records across 12 sheets
- **After:** 4,891 clean, unique contacts in HubSpot
- **Time saved:** 40+ hours of manual data entry
- **Impact:** Sales team can now track enrollment pipeline in real-time

## How to Use

```bash
# Install dependencies
pip install pandas

# Run migration
python clean_and_migrate.py
```

## Tech Stack

- **Python 3** + Pandas for data cleaning
- **Regex** for phone/email validation  
- **HubSpot CSV import format** (no API needed for speed)
- **Chart.js** for interactive dashboard visualizations

---

**Built by Owen McCormick** | [LinkedIn](https://linkedin.com/in/owenpmccormick) | [Full Portfolio](https://github.com/owenpmccormick)
