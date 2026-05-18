import pdfplumber
import sys

pdf_path = "/Users/mac/Downloads/College+Radio+playbook.pdf"

try:
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        # Print a page range to find where the directory begins
        for i in range(5, min(25, len(pdf.pages))):
            text = pdf.pages[i].extract_text()
            if text:
                first_line = text.split('\n')[0] if text.split('\n') else ""
                print(f"Page {i+1} first line: {first_line[:100]} | Length: {len(text)}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
