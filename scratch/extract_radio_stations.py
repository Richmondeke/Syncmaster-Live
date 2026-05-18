import pdfplumber
import json
import os

pdf_path = "/Users/mac/Downloads/College+Radio+playbook.pdf"
output_path = "/Users/mac/.gemini/antigravity/scratch/syncmaster/scratch/radio_stations.json"

def clean_text(text):
    if text is None:
        return ""
    # Replace newlines with spaces for most fields, except maybe address
    return text.replace("\n", " ").strip()

def extract_all():
    all_stations = []
    headers = None
    
    with pdfplumber.open(pdf_path) as pdf:
        # Directory starts at page 11 (index 10) to 30 (index 29)
        for i in range(10, len(pdf.pages)):
            print(f"Processing page {i+1}...")
            page = pdf.pages[i]
            table = page.extract_table()
            
            if not table:
                continue
            
            # First page has headers
            if headers is None:
                headers = [clean_text(h) for h in table[0]]
                start_row = 1
            else:
                # Check if this page repeats headers
                first_row = [clean_text(h) for h in table[0]]
                if first_row == headers or "State/City" in first_row[0]:
                    start_row = 1
                else:
                    start_row = 0
            
            for row in table[start_row:]:
                if not any(row): continue # Skip empty rows
                
                station_data = {}
                for idx, col_name in enumerate(headers):
                    val = row[idx] if idx < len(row) else ""
                    # For Address and Notes, maybe keep newlines or clean them?
                    # Let's clean them for consistency in a directory search
                    station_data[col_name] = clean_text(val)
                
                all_stations.append(station_data)
                
    print(f"Extracted {len(all_stations)} stations.")
    with open(output_path, 'w') as f:
        json.dump(all_stations, f, indent=2)

if __name__ == "__main__":
    extract_all()
