import re

STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", 
    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", 
    "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "Alaska", "Alabama", "Arkansas", "Arizona", 
    "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", 
    "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
    "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
]

def main():
    with open("/Users/mac/.gemini/antigravity/scratch/syncmaster/scratch/directory_pages.txt", "r") as f:
        lines = f.readlines()
        
    cleaned_lines = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        # Check if line matches a state name or abbreviation followed by a comma
        state_comma_match = re.match(rf"^({'|'.join(STATES)}),$", line)
        if state_comma_match and i + 1 < len(lines):
            next_line = lines[i+1].strip()
            # Merge them!
            merged = f"{line} {next_line}"
            cleaned_lines.append(merged)
            i += 2
        else:
            cleaned_lines.append(line)
            i += 1
            
    # Now let's do the grouping on these cleaned lines
    state_pattern = re.compile(rf"^({'|'.join(STATES)}),\s+[A-Za-z]")
    
    blocks = []
    current_block = []
    
    for line in cleaned_lines:
        if not line:
            continue
        if "--- PAGE" in line or "College Radio Stations Directory" in line or "School Station Email" in line:
            continue
        if "weekly for available updates" in line or "Fraud Check" in line:
            continue
            
        if state_pattern.match(line):
            if current_block:
                blocks.append(current_block)
            current_block = [line]
        else:
            if current_block:
                current_block.append(line)
                
    if current_block:
        blocks.append(current_block)
        
    print(f"Total blocks found: {len(blocks)}")
    
    # Print the blocks around block 8 to check
    for idx, block in enumerate(blocks[6:10]):
        print(f"\nBLOCK {idx+7}:")
        print("\n".join(block))

if __name__ == "__main__":
    main()
