import pypdf

def main():
    reader = pypdf.PdfReader("/Users/mac/Downloads/College+Radio+Playbook.pdf")
    print(f"Total pages: {len(reader.pages)}")
    
    with open("/Users/mac/.gemini/antigravity/scratch/syncmaster/scratch/directory_pages.txt", "w") as f:
        for i in range(8, len(reader.pages)):
            f.write(f"\n--- PAGE {i} ---\n")
            text = reader.pages[i].extract_text()
            f.write(text)
    print("Dumped directory pages to /Users/mac/.gemini/antigravity/scratch/syncmaster/scratch/directory_pages.txt")

if __name__ == "__main__":
    main()
