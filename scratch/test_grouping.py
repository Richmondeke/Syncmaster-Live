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
        
    state_pattern = re.compile(rf"^({'|'.join(STATES)}),\s+[A-Za-z]")
    
    blocks = []
    current_block = []
    
    for line in lines:
        stripped = line.strip()
        # skip page headers/footers
        if "--- PAGE" in line or "College Radio Stations Directory" in line or "School Station Email" in line:
            continue
        if "weekly for available updates" in line or "Fraud Check" in line:
            continue
            
        # check if it starts a new block
        if state_pattern.match(stripped):
            if current_block:
                blocks.append(current_block)
            current_block = [stripped]
        else:
            if current_block:
                current_block.append(stripped)
                
    if current_block:
        blocks.append(current_block)
        
    print(f"Total blocks found: {len(blocks)}")
    
    # Print the first 5 blocks
    for idx, block in enumerate(blocks[:8]):
        print(f"\nBLOCK {idx+1}:")
        print("\n".join(block))

if __name__ == "__main__":
    main()
