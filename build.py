"""Genera dist/SoF.html: la pagina con CSS e JS incorporati, apribile offline con doppio clic.

Uso: python build.py [versione]   es. python build.py v1.2 (senza versione resta "sviluppo")
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "dist" / "SoF.html"


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def inline_style(match):
    return "<style>\n" + read(match.group(1)) + "</style>"


def inline_script(match):
    # Un "</script" dentro il codice chiuderebbe il tag in anticipo.
    code = read(match.group(1)).replace("</script", "<\\/script")
    return "<script>\n" + code + "</script>"


html = read("index.html")
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_style, html)
html = re.sub(r'<script src="([^"]+)"></script>', inline_script, html)
if len(sys.argv) > 1:
    html = re.sub(r"(<div [^>]*data-version>)[^<]*", lambda m: m.group(1) + sys.argv[1], html)

OUT.parent.mkdir(exist_ok=True)
OUT.write_text(html, encoding="utf-8")
print(f"Creato {OUT.relative_to(ROOT)} ({len(html.encode('utf-8')) // 1024} KB)")
