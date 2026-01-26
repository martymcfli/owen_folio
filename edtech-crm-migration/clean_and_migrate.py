#!/usr/bin/env python3
"""
EdTech CRM Migration Tool
Cleans messy Google Sheets data and formats for HubSpot import
Built for Talstack (Nigerian EdTech) - Owen McCormick
"""

import pandas as pd
import re
from datetime import datetime

def clean_phone_number(phone):
    """Standardize phone numbers to E.164 format"""
    if pd.isna(phone):
        return ""
    # Remove all non-numeric characters
    phone = re.sub(r'\D', '', str(phone))
    # Add country code if missing (assuming Nigeria +234)
    if len(phone) == 10:
        phone = "234" + phone
    return "+" + phone if phone else ""

def clean_email(email):
    """Validate and clean email addresses"""
    if pd.isna(email):
        return ""
    email = str(email).strip().lower()
    # Basic email validation
    if re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return email
    return ""

def remove_duplicates(df):
    """Remove duplicate contacts, keeping most recent"""
    # Sort by date (most recent first) then drop duplicates
    df = df.sort_values('enrollment_date', ascending=False)
    df = df.drop_duplicates(subset=['email'], keep='first')
    return df

def map_to_hubspot_format(df):
    """Map cleaned data to HubSpot import format"""
    hubspot_df = pd.DataFrame()
    
    # Required HubSpot fields
    hubspot_df['Email'] = df['email'].apply(clean_email)
    hubspot_df['First Name'] = df['first_name'].fillna('')
    hubspot_df['Last Name'] = df['last_name'].fillna('')
    hubspot_df['Phone Number'] = df['phone'].apply(clean_phone_number)
    
    # Custom properties
    hubspot_df['Student ID'] = df['student_id']
    hubspot_df['Enrollment Status'] = df['status'].fillna('Pending')
    hubspot_df['Course Name'] = df['course'].fillna('')
    hubspot_df['Enrollment Date'] = df['enrollment_date']
    
    # Deal pipeline mapping
    status_to_stage = {
        'enrolled': 'Active Student',
        'pending': 'Enrollment Started',
        'completed': 'Course Completed',
        'dropped': 'Inactive'
    }
    hubspot_df['Deal Stage'] = df['status'].str.lower().map(status_to_stage).fillna('Enrollment Started')
    
    return hubspot_df

def main():
    """Main migration workflow"""
    print("🚀 Starting EdTech CRM Migration...")
    
    # Load messy data
    print("📂 Loading Google Sheets export...")
    df = pd.read_csv('student_data_messy.csv')
    print(f"   Found {len(df)} total records")
    
    # Clean data
    print("🧹 Cleaning data...")
    df = remove_duplicates(df)
    print(f"   Removed duplicates: {len(df)} unique students")
    
    # Map to HubSpot format
    print("🗺️  Mapping to HubSpot format...")
    hubspot_ready = map_to_hubspot_format(df)
    
    # Remove rows with invalid emails
    hubspot_ready = hubspot_ready[hubspot_ready['Email'] != '']
    print(f"   Valid contacts: {len(hubspot_ready)}")
    
    # Export
    output_file = f'hubspot_import_{datetime.now().strftime("%Y%m%d")}.csv'
    hubspot_ready.to_csv(output_file, index=False)
    print(f"✅ Migration complete! Import file: {output_file}")
    
    # Stats
    print(f"\n📊 Summary:")
    print(f"   - Total processed: {len(df)}")
    print(f"   - Ready for HubSpot: {len(hubspot_ready)}")
    print(f"   - Enrollment statuses: {hubspot_ready['Deal Stage'].value_counts().to_dict()}")

if __name__ == "__main__":
    main()
