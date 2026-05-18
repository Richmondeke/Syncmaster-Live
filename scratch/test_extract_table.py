import pdfplumber
import json

pdf_path = "/Users/mac/Downloads/College+Radio+playbook.pdf"

try:
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[11] # Page 12
        table = page.extract_table()
        if table:
            print(json.dumps(table[:5], indent=2))
        else:
            print("No table found on page 12 via extract_table()")
            # Fallback to text parsing if needed
            text = page.extract_text()
            print(text[:1000])
except Exception as e:
    print(f"Error: {e}")
