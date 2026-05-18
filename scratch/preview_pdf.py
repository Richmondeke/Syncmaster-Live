import pdfplumber
import sys

pdf_path = "/Users/mac/Downloads/College+Radio+playbook.pdf"

try:
    with pdfplumber.open(pdf_path) as pdf:
        # Extract first 5 pages to understand layout
        for i in range(min(5, len(pdf.pages))):
            print(f"--- PAGE {i+1} ---")
            print(pdf.pages[i].extract_text())
            tables = pdf.pages[i].extract_tables()
            if tables:
                print(f"Found {len(tables)} tables on page {i+1}")
                for j, table in enumerate(tables):
                    print(f"Table {j+1}: {table[:3]}") # Print first 3 rows
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
