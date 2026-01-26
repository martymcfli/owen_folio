#!/usr/bin/env python3
"""
Apollo.io → HubSpot Lead Handoff Automation
Automatically syncs replied leads from Apollo cold outreach to HubSpot CRM
Built for Voxitech (Sri Lankan AI startup entering US market) - Owen McCormick
"""

import requests
import json
from datetime import datetime

# Configuration (replace with your API keys)
APOLLO_API_KEY = "your_apollo_key_here"
HUBSPOT_API_KEY = "your_hubspot_key_here"

def get_apollo_replies():
    """Fetch leads who replied to outreach sequences"""
    url = "https://api.apollo.io/v1/emailer_campaigns/replies"
    headers = {
        "Content-Type": "application/json",
        "X-Api-Key": APOLLO_API_KEY
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json().get('contacts', [])
    else:
        print(f"❌ Apollo API error: {response.status_code}")
        return []

def score_lead(contact):
    """Score lead quality (0-100) based on firmographics"""
    score = 50  # Base score
    
    # Company size (ideal: 50-500 employees)
    employees = contact.get('organization', {}).get('employees', 0)
    if 50 <= employees <= 500:
        score += 20
    elif employees > 500:
        score += 10
    
    # Funding stage (prefer Series A-C)
    funding = contact.get('organization', {}).get('funding_stage', '')
    if funding in ['Series A', 'Series B', 'Series C']:
        score += 15
    
    # Tech stack match (checks if they use AI/ML tools)
    tech_stack = contact.get('organization', {}).get('technologies', [])
    ai_keywords = ['tensorflow', 'pytorch', 'aws', 'azure', 'google cloud']
    if any(keyword in str(tech_stack).lower() for keyword in ai_keywords):
        score += 15
    
    # Response sentiment (positive reply = higher score)
    reply_text = contact.get('last_reply', '').lower()
    positive_words = ['interested', 'yes', 'sounds good', 'tell me more', 'schedule']
    if any(word in reply_text for word in positive_words):
        score += 10
    
    return min(score, 100)  # Cap at 100

def create_hubspot_contact(contact, lead_score):
    """Create contact in HubSpot with enriched data"""
    url = "https://api.hubapi.com/crm/v3/objects/contacts"
    headers = {
        "Authorization": f"Bearer {HUBSPOT_API_KEY}",
        "Content-Type": "application/json"
    }
    
    properties = {
        "email": contact.get('email'),
        "firstname": contact.get('first_name'),
        "lastname": contact.get('last_name'),
        "company": contact.get('organization', {}).get('name'),
        "phone": contact.get('phone_numbers', [{}])[0].get('raw_number', ''),
        "jobtitle": contact.get('title'),
        "lead_score": lead_score,
        "lead_source": "Apollo Cold Outreach",
        "hs_lead_status": "QUALIFIED" if lead_score >= 70 else "UNQUALIFIED"
    }
    
    data = {"properties": properties}
    response = requests.post(url, headers=headers, json=data)
    
    return response.status_code == 201

def main():
    """Main sync workflow"""
    print("🚀 Starting Apollo → HubSpot lead sync...")
    
    # Fetch replied leads from Apollo
    print("📧 Fetching leads who replied to outreach...")
    contacts = get_apollo_replies()
    print(f"   Found {len(contacts)} replies")
    
    if not contacts:
        print("✅ No new replies to sync")
        return
    
    # Process each contact
    synced = 0
    high_quality = 0
    
    for contact in contacts:
        # Score the lead
        score = score_lead(contact)
        
        # Only sync qualified leads (score >= 40)
        if score >= 40:
            success = create_hubspot_contact(contact, score)
            if success:
                synced += 1
                if score >= 70:
                    high_quality += 1
                print(f"   ✅ Synced: {contact.get('first_name')} {contact.get('last_name')} (Score: {score})")
        else:
            print(f"   ⏭️  Skipped: {contact.get('first_name')} {contact.get('last_name')} (Score too low: {score})")
    
    print(f"\n✅ Sync complete!")
    print(f"   - Total replies: {len(contacts)}")
    print(f"   - Synced to HubSpot: {synced}")
    print(f"   - High-quality leads (>70): {high_quality}")

if __name__ == "__main__":
    main()
