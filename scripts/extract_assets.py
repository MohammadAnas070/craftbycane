"""
Extracts the illustrated artwork from the Cane Atelier design PDF into
src/assets/images as optimised WebP files.

Usage:  python -I scripts/extract_assets.py "<path to Cane-Handicrafts-Website-Page-Designs.pdf>"
Needs:  pip install pymupdf pillow

Every artwork in the PDF is vector, so it is re-rendered at a high zoom. Text
overlays (badges, hearts, captions) are removed with redaction zones; the hero
cut-outs drop their background by redacting everything outside the object box.
"""
import io
import os
import sys

import pymupdf
from PIL import Image

PDF = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "images")
os.makedirs(OUT, exist_ok=True)

# name: (page, tile rect, extra overlay-removal zones, inset for the cut-out)
TILES = {
    "chair":     (7, (105, 642, 308, 896)),
    "lamp":      (7, (328, 642, 530, 896)),
    "swing":     (7, (550, 642, 753, 896), [(553, 850, 750, 890)]),
    "stepler":   (7, (772, 642, 975, 896)),
    "stick":     (7, (105, 1039, 308, 1292)),
    "rope":      (7, (328, 1039, 530, 1292)),
    "basket":    (7, (550, 1039, 753, 1292)),
    "tray":      (7, (772, 1039, 975, 1292)),
    "jhula":     (7, (105, 1415, 308, 1669)),
    "sidetable": (7, (328, 1415, 530, 1669)),
    "mirror":    (7, (550, 1415, 753, 1669)),
    "cluster":   (7, (772, 1415, 975, 1669)),
}
# larger / variant scenes taken from other pages: name: (page, rect, zones)
SCENES = {
    "swing-large":   (5, (105, 1321, 465, 1771), [(108, 1745, 260, 1770)]),
    "chair-terra":   (5, (480, 1321, 720, 1538), [(483, 1515, 600, 1537)]),
    "pendants":      (5, (735, 1321, 975, 1538), [(738, 1515, 880, 1537)]),
    "mirror-wide":   (5, (735, 1553, 975, 1771), [(738, 1748, 880, 1770)]),
    "sidetable-wide": (5, (480, 1553, 720, 1771), [(483, 1748, 620, 1770)]),
}
# opaque texture crops: name: (page, rect)
CROPS = {
    "weave": (4, (108, 2154, 281, 2330)),
}
# transparent cut-outs of hero objects on page 4: name: (rect)
HERO = {
    "hero-swing":   (740, 225, 925, 560),
    "hero-lamp":    (556, 205, 680, 345),
    "hero-basket":  (535, 515, 745, 640),
    "hero-table":   (938, 480, 1040, 606),
}
ZOOM = 4.5


def render(pageno, rect, name, zoom=ZOOM, zones=(), isolate=None, alpha=False, quality=84, maxw=None):
    doc = pymupdf.open(PDF)
    page = doc[pageno - 1]
    W, H = page.rect.width, page.rect.height
    x0, y0, x1, y1 = rect
    if isolate:
        a, b, c, d = isolate
        for r in [(-50, -50, W + 50, b), (-50, d, W + 50, H + 50), (-50, b, a, d), (c, b, W + 50, d)]:
            page.add_redact_annot(pymupdf.Rect(r), fill=False)
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE,
                              graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED,
                              text=pymupdf.PDF_REDACT_TEXT_REMOVE)
    zs = list(zones)
    if zs:
        for z in zs:
            page.add_redact_annot(pymupdf.Rect(z), fill=False)
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE,
                              graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,
                              text=pymupdf.PDF_REDACT_TEXT_REMOVE)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=pymupdf.Rect(rect), alpha=alpha)
    im = Image.open(io.BytesIO(pix.tobytes("png")))
    if maxw and im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    path = os.path.join(OUT, name + ".webp")
    if alpha:
        im.save(path, "WEBP", quality=88, method=6, exact=True)
    else:
        im.convert("RGB").save(path, "WEBP", quality=quality, method=6)
    print(f"{name:16s} {im.width}x{im.height} {os.path.getsize(path)//1024} KB")


def overlay_zones(r):
    x0, y0, x1, y1 = r
    return [(x0 + 2, y0 + 2, x0 + 112, y0 + 30), (x1 - 52, y0 + 2, x1 - 2, y0 + 48)]


if __name__ == "__main__":
    for name, spec in TILES.items():
        page, rect = spec[0], spec[1]
        extra = spec[2] if len(spec) > 2 else []
        zones = overlay_zones(rect) + extra
        render(page, rect, name, zones=zones)
    for name, (page, rect, zones) in SCENES.items():
        render(page, rect, name, zones=zones)
    for name, (page, rect) in CROPS.items():
        render(page, rect, name, zoom=6)
    for name, rect in HERO.items():
        render(4, rect, name, zoom=4, isolate=rect, alpha=True)
