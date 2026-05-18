import json
import re

with open('scratch/radio_stations.json') as f:
    stations = json.load(f)

print(f"Total stations: {len(stations)}")

# Standard state mapping for full names
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

# 2-letter state regex
STATE_RE = re.compile(r'\b([A-Z]{2})\b')

count_ok = 0
count_fixed = 0

for i, s in enumerate(stations):
    raw_sc = s.get('SSttaattee//CCiittyy', s.get('State/City', '')).strip()
    addr = s.get('Address', '')
    
    # Try to find a 2-letter state code from raw_sc
    state = None
    city = None
    
    # 1. Check if first part before comma/space is a 2-letter state
    parts = [p.strip() for p in re.split(r'[\s,]+', raw_sc) if p.strip()]
    if parts:
        first = parts[0]
        if len(first) == 2 and first.isupper():
            state = first
            city = " ".join(parts[1:])
        elif first.lower() in STATE_MAP:
            state = STATE_MAP[first.lower()]
            city = " ".join(parts[1:])
            
    # 2. If not found, try searching the Address for a state code near zip
    if not state and addr:
        # Look for e.g. "AL 36849" or "AL, 36849" or just state at the end
        # Find 2-letter uppercase words
        matches = STATE_RE.findall(addr)
        if matches:
            # Usually the last one is the state code in an address
            state = matches[-1]
            city = raw_sc
            
    # Fallback to NY if we really can't find anything
    if not state:
        state = "NY"
        city = raw_sc
        
    print(f"Row {i+1:3d} | Raw: {raw_sc[:30]:30s} | Cleaned State: {state:2s} | Cleaned City: {city[:20]}")
