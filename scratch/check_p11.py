import pdfplumber

pdf_path = "/Users/mac/Downloads/College+Radio+playbook.pdf"

try:
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[10] # Page 11
        table = page.extract_table()
        if table:
            print("Page 11 table:")
            print(table[:3])
        else:
            print("No table on Page 11")
            print(page.extract_text()[:500])
except Exception as e:
    print(f"Error: {e}")
