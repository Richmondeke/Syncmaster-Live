import json
import re

with open('scratch/radio_stations.json') as f:
    stations = json.load(f)

# Standard 2-letter state codes
states_2letter = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
}

STATE_MAP = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR", "california": "CA",
    "colorado": "CO", "connecticut": "CT", "delaware": "DE", "florida": "FL", "georgia": "GA",
    "hawaii": "HI", "idaho": "ID", "illinois": "IL", "indiana": "IN", "iowa": "IA",
    "kansas": "KS", "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
    "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS",
    "missouri": "MO", "montana": "MT", "nebraska": "NE", "nevada": "NV", "new hampshire": "NH",
    "new jersey": "NJ", "new mexico": "NM", "new york": "NY", "north carolina": "NC",
    "north dakota": "ND", "ohio": "OH", "oklahoma": "OK", "oregon": "OR", "pennsylvania": "PA",
    "rhode island": "RI", "south carolina": "SC", "south dakota": "SD", "tennessee": "TN",
    "texas": "TX", "utah": "UT", "vermont": "VT", "virginia": "VA", "washington": "WA",
    "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY", "mass": "MA"
}

abnormal = []
for idx, s in enumerate(stations):
    raw_sc = s.get('SSttaattee//CCiittyy', s.get('State/City', '')).strip()
    station = s.get('Station', '').strip()
    school = s.get('School', '').strip()
    
    # Skip noise rows
    is_noise = False
    for field, val in s.items():
        if any(kw in str(val) for kw in ["Contact @", "Fraud Check", "ege_Radio_Dir"]):
            is_noise = True
            break
    if not station or not school or station == "Station" or school == "School":
        is_noise = True
        
    if is_noise:
        continue
        
    parts = [p.strip() for p in re.split(r'[\s,]+', raw_sc) if p.strip()]
    if not parts:
        abnormal.append((idx, s, "Empty SSttaattee//CCiittyy"))
        continue
        
    first = parts[0]
    if first not in states_2letter and first.lower() not in STATE_MAP:
        abnormal.append((idx, s, f"First token '{first}' is not a state"))

print(f"Found {len(abnormal)} abnormal records:")
for idx, r, reason in abnormal[:30]:
    print(f"Index {idx:3d} | Reason: {reason:30s} | Raw SSttaattee//CCiittyy: {r.get('SSttaattee//CCiittyy', ''):40s} | Address: {r.get('Address', '')}")
