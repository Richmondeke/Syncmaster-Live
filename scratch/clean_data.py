import json
import re

pdf_path = "/Users/mac/Downloads/College+Radio+playbook.pdf"
input_path = "scratch/radio_stations.json"
output_path = "scratch/radio_stations.json"

STATES = {
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC'
}

STATE_NAME_TO_CODE = {
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
    "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY", "mass": "MA", "district of columbia": "DC",
    "washington dc": "DC", "washington d.c.": "DC"
}

def parse_state_city(raw_val, address=""):
    raw_val = raw_val.strip()
    raw_val = re.sub(r'\s+', ' ', raw_val)
    
    # Special cases
    if "D.C." in raw_val or "Washington DC" in raw_val or "Washington, DC" in raw_val:
        return "DC", "Washington"
    if "KT" in raw_val:
        return "KY", "Lexington"
        
    if ',' in raw_val:
        parts = [p.strip() for p in raw_val.split(',')]
        if len(parts) >= 2:
            first = parts[0]
            second = parts[1]
            
            # Case A: "[State Code], [City]" (e.g. AL, Auburn)
            if len(first) == 2 and first.upper() in STATES:
                return first.upper(), ", ".join(parts[1:])
            
            # Case B: "[State Name], [City]" (e.g. Alabama, Auburn)
            if first.lower() in STATE_NAME_TO_CODE:
                return STATE_NAME_TO_CODE[first.lower()], ", ".join(parts[1:])
                
            # Case C: "[City], [State Code/Name]" (e.g. Danbury, Connecticut)
            second_words = second.split()
            if second_words:
                sec_first = second_words[0].upper()
                if sec_first in STATES:
                    return sec_first, first
                if second.lower() in STATE_NAME_TO_CODE:
                    return STATE_NAME_TO_CODE[second.lower()], first
                for word in second_words:
                    word_clean = re.sub(r'[^\w]', '', word)
                    if word_clean.upper() in STATES:
                        return word_clean.upper(), first
                    if word_clean.lower() in STATE_NAME_TO_CODE:
                        return STATE_NAME_TO_CODE[word_clean.lower()], first

    # No comma, try word by word
    words = raw_val.split()
    for i, w in enumerate(words):
        w_clean = re.sub(r'[^\w]', '', w)
        if w_clean.upper() in STATES:
            city_words = words[:i] + words[i+1:]
            return w_clean.upper(), " ".join(city_words)
        if w_clean.lower() in STATE_NAME_TO_CODE:
            city_words = words[:i] + words[i+1:]
            return STATE_NAME_TO_CODE[w_clean.lower()], " ".join(city_words)

    # Search in address
    if address:
        zip_match = re.search(r'\b([A-Z]{2})\b\s+\d{5}', address)
        if zip_match:
            return zip_match.group(1).upper(), raw_val
            
        addr_words = address.split()
        for w in reversed(addr_words):
            w_clean = re.sub(r'[^\w]', '', w).upper()
            if w_clean in STATES:
                return w_clean, raw_val
                
    return "NY", raw_val

def clean_data():
    with open(input_path) as f:
        stations = json.load(f)

    print(f"Total stations loaded: {len(stations)}")
    cleaned_stations = []
    noise_count = 0

    noise_keywords = ["Contact @", "Fraud Check", "ege_Radio_Dir"]

    for idx, s in enumerate(stations):
        # 1. Check for noise rows
        is_noise = False
        for field, val in s.items():
            if any(kw in str(val) for kw in noise_keywords):
                is_noise = True
                break
                
        station = s.get('Station', '').strip()
        school = s.get('School', '').strip()
        if not station or not school or station == "Station" or school == "School":
            is_noise = True
            
        if is_noise:
            noise_count += 1
            continue

        # 2. Extract and clean email
        email = s.get('Email', '').strip()
        if email:
            # remove spaces
            email = email.replace(" ", "")
            if email == "-":
                email = None
        else:
            email = None

        # 3. Clean and standardize state/city
        raw_sc = s.get('SSttaattee//CCiittyy', s.get('State/City', '')).strip()
        address = s.get('Address', '').strip()
        
        state_code, city = parse_state_city(raw_sc, address)
        
        # Ensure proper casing for city
        city = city.strip().title()
        
        # 4. Map and clean remaining fields
        cleaned_item = {
            "SSttaattee//CCiittyy": f"{state_code}, {city}",
            "School": school.strip(),
            "Station": station.strip(),
            "Email": email,
            "Notes": s.get('Notes', '').strip() if s.get('Notes', '').strip() != "-" else None,
            "Show": s.get('Show', '').strip() if s.get('Show', '').strip() != "-" else None,
            "DJ / Music Dir.": s.get('DJ / Music Dir.', '').strip() if s.get('DJ / Music Dir.', '').strip() != "-" else None,
            "Website": s.get('Website', '').strip() if s.get('Website', '').strip() != "-" else None,
            "Phone": s.get('Phone', '').strip() if s.get('Phone', '').strip() != "-" else None,
            "Address": address if address != "-" else None,
            "Submitted": s.get('Submitted', '').strip()
        }
        
        cleaned_stations.append(cleaned_item)

    print(f"Noise rows removed: {noise_count}")
    print(f"Clean stations remaining: {len(cleaned_stations)}")
    
    # Save back
    with open(output_path, 'w') as f:
        json.dump(cleaned_stations, f, indent=2)
    print(f"Cleaned data successfully written to {output_path}!")

if __name__ == "__main__":
    clean_data()
