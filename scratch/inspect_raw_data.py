import json
import re

with open('scratch/radio_stations.json') as f:
    stations = json.load(f)

print(f"Total stations before cleaning: {len(stations)}")

# Let's inspect some of the values to identify footer/header noise
noise_keywords = ["Contact @", "Fraud Check", "ege_Radio_Dir", "State/City", "SSttaattee//CCiittyy", "School", "Station"]
noise_rows = []
unique_states = {}

for idx, s in enumerate(stations):
    raw_sc = s.get('SSttaattee//CCiittyy', s.get('State/City', '')).strip()
    station = s.get('Station', '').strip()
    school = s.get('School', '').strip()
    email = s.get('Email', '').strip()
    
    # Check if any field contains noise keywords
    is_noise = False
    for field, val in s.items():
        if any(keyword in str(val) for keyword in noise_keywords):
            is_noise = True
            break
            
    # Also if station/school is empty or represents a header
    if not station or not school or station == "Station" or school == "School":
        is_noise = True
        
    if is_noise:
        noise_rows.append((idx, s))
    else:
        # Check what state we have
        parts = [p.strip() for p in re.split(r'[\s,]+', raw_sc) if p.strip()]
        if parts:
            state = parts[0]
            unique_states[state] = unique_states.get(state, 0) + 1

print(f"\nDetected {len(noise_rows)} noise/footer/header rows:")
for idx, r in noise_rows[:15]:
    print(f"Index {idx}: {r}")

print("\nUnique state tokens found:")
for st, cnt in sorted(unique_states.items()):
    print(f"  {st}: {cnt}")
