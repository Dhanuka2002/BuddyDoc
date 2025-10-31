#!/usr/bin/env python
"""Simple extractor for .docx files that prints paragraphs to stdout.
If python-docx is missing, the script will pip-install it.
"""
import sys
import os
import subprocess

try:
    from docx import Document
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"]) 
    from docx import Document


def extract(path):
    doc = Document(path)
    texts = []
    for p in doc.paragraphs:
        if p.text and p.text.strip():
            texts.append(p.text)
    return "\n\n".join(texts)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: extract_docx.py <path-to-docx>")
        sys.exit(2)
    path = sys.argv[1]
    if not os.path.exists(path):
        print(f"File not found: {path}")
        sys.exit(1)
    try:
        out = extract(path)
        print(out)
    except Exception as e:
        print("ERROR extracting docx:", e)
        sys.exit(3)
