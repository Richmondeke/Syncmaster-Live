import pypdf

def main():
    reader = pypdf.PdfReader("/Users/mac/Downloads/College+Radio+Playbook.pdf")
    print(f"Total pages: {len(reader.pages)}")
    
    # Let's inspect the text of the first few pages
    for i in range(min(5, len(reader.pages))):
        print(f"\n--- PAGE {i} ---")
        text = reader.pages[i].extract_text()
        print(text[:1500])

if __name__ == "__main__":
    main()
