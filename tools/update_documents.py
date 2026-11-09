"""Registers the files listed in js/documents.js so the site works even when
index.html is opened by double-click (file://), where browsers block file checks.
Run from the project folder:  python tools/update_documents.py
Creates js/manifest.js and js/data/*.js (PDF copies embedded for the viewer)."""
import base64, os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
paths = re.findall(r'path:\s*"([^"]+)"', open("js/documents.js", encoding="utf-8").read())
os.makedirs("js/data", exist_ok=True)
for f in os.listdir("js/data"):
    if f.endswith(".js"): os.remove(os.path.join("js/data", f))
manifest, missing = {}, []
for p in paths:
    if not os.path.isfile(p): missing.append(p); continue
    entry = {"size": os.path.getsize(p)}
    if p.lower().endswith(".pdf"):
        slug = p.replace("/", "__").replace(" ", "_") + ".js"
        with open(p, "rb") as fh: b64 = base64.b64encode(fh.read()).decode()
        with open("js/data/" + slug, "w") as out:
            out.write('window.__PDF_DATA=window.__PDF_DATA||{};window.__PDF_DATA[%r]="%s";' % (p, b64))
        entry["embed"] = "js/data/" + slug
    manifest[p] = entry
with open("js/manifest.js", "w") as out:
    import json; out.write("window.DOC_MANIFEST=" + json.dumps(manifest, indent=1) + ";")
print("Registered %d file(s)." % len(manifest))
for p in manifest: print("  OK     ", p)
for p in missing: print("  missing", p)
