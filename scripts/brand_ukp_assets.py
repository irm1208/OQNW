"""Create local OmniQure-branded copies of the UK Peptides homepage imagery.

The source photography is kept intact.  This script only masks the source
mark on the labels/kit lid and places the OmniQure wordmark in the same
visual area.  Keeping this deterministic makes the result repeatable and
avoids changing lighting, product geometry, or the composition of the source
photography.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path("/tmp/ukp-assets")
OUT = ROOT / "artifacts/omniqure/public/ukp-branded"
LOGO_PATH = ROOT / "artifacts/omniqure/public/omniqure-logo-transparent.png"

BLUE = (22, 73, 208, 255)
INK = (7, 20, 58, 255)
WHITE = (255, 255, 255, 255)


def source(name: str) -> Path:
    p = SOURCE / name
    if not p.exists():
        raise FileNotFoundError(p)
    return p


def load_logo(color: tuple[int, int, int, int]) -> Image.Image:
    logo = Image.open(LOGO_PATH).convert("RGBA")
    alpha = logo.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        logo = logo.crop(bbox)
    layer = Image.new("RGBA", logo.size, color)
    layer.putalpha(logo.getchannel("A"))
    return layer


LOGOS = {"blue": load_logo(BLUE), "ink": load_logo(INK), "white": load_logo(WHITE)}


def fit_logo(color: str, width: int, height: int | None = None) -> Image.Image:
    logo = LOGOS[color]
    if height is None:
        height = max(1, round(width * logo.height / logo.width))
    else:
        width = max(1, round(height * logo.width / logo.height))
    return logo.resize((width, height), Image.Resampling.LANCZOS)


def patch_rect(
    im: Image.Image,
    rect: tuple[int, int, int, int],
    *,
    logo_color: str = "blue",
    fill: tuple[int, int, int, int] = WHITE,
    logo_scale: float = 0.78,
    radius: int = 0,
) -> None:
    """Cover a source mark and center the replacement logo in the same area."""
    x, y, w, h = rect
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    xy = (x, y, x + w, y + h)
    if radius:
        draw.rounded_rectangle(xy, radius=radius, fill=fill)
    else:
        draw.rectangle(xy, fill=fill)
    # A tiny blur on the patch edge avoids a visible hard rectangle over the
    # softly lit paper label while leaving all surrounding pixels untouched.
    mask = overlay.getchannel("A")
    edge = mask.filter(ImageFilter.GaussianBlur(0.35))
    overlay.putalpha(edge)
    im.alpha_composite(overlay)

    logo_h = max(2, round(h * logo_scale))
    logo = fit_logo(logo_color, max(2, round(logo_h * LOGOS[logo_color].width / LOGOS[logo_color].height)), logo_h)
    # Keep the mark inside the patch even when a narrow target is supplied.
    if logo.width > round(w * 0.9):
        logo = fit_logo(logo_color, round(w * 0.9))
    px = x + (w - logo.width) // 2
    py = y + (h - logo.height) // 2
    im.alpha_composite(logo, (px, py))


def patch_polygon(
    im: Image.Image,
    points: list[tuple[int, int]],
    *,
    logo_color: str = "blue",
    fill: tuple[int, int, int, int] = WHITE,
    logo_width: int | None,
    angle: float = 0,
) -> None:
    """Patch a quadrilateral and place a lightly rotated wordmark in it."""
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(overlay).polygon(points, fill=fill)
    im.alpha_composite(overlay)
    if logo_width is None:
        return
    logo = fit_logo(logo_color, logo_width)
    if angle:
        logo = logo.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    x = round((min(xs) + max(xs) - logo.width) / 2)
    y = round((min(ys) + max(ys) - logo.height) / 2)
    im.alpha_composite(logo, (x, y))


def save(im: Image.Image, path: Path, *, quality: int = 94) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(path, "WEBP", quality=quality, method=6)


def brand_product(src_name: str, out_name: str) -> None:
    im = Image.open(source(src_name)).convert("RGBA")
    # All eight catalogue shots use the same 1254px studio template.  The
    # top mark is on a flat white paper label; KGlow25 is the sole dark-label
    # variant and receives the white mark on its navy label.
    dark = "kglow" in src_name.lower() or "klow" in out_name.lower()
    patch_rect(
        im,
        (500, 584, 270, 80) if dark else (454, 584, 250, 80),
        logo_color="white" if dark else "blue",
        fill=(30, 48, 70, 255) if dark else (250, 250, 250, 255),
        logo_scale=0.62,
        radius=5,
    )
    save(im, OUT / "products" / out_name)


def brand_nasal(src_name: str, out_name: str) -> None:
    im = Image.open(source(src_name)).convert("RGBA")
    # The product and box are photographed in a fixed 1024px composition.
    # Both original Adaptog marks sit in white areas immediately below the
    # coloured honeycomb strip.
    patch_rect(im, (309, 636, 166, 46), logo_color="blue", fill=(252, 252, 252, 255), logo_scale=0.55, radius=2)
    patch_rect(im, (596, 225, 148, 42), logo_color="blue", fill=(248, 248, 248, 255), logo_scale=0.55, radius=2)
    save(im, OUT / "nasal" / out_name)


def brand_hero(src_name: str, out_name: str, mobile: bool = False) -> None:
    im = Image.open(source(src_name)).convert("RGBA")
    if mobile:
        # Product grouping in hero-mobile-16.
        boxes = [
            (128, 613, 122, 66),   # GLP-3
            (370, 455, 105, 62),   # BPC-157
            (589, 358, 105, 62),   # GHK-Cu
            (804, 496, 98, 62),    # Glow
            (1040, 639, 152, 66),  # Semax spray
            (1215, 639, 152, 66),  # Selank spray
        ]
    else:
        boxes = [
            (48, 645, 124, 66),    # Semax spray
            (230, 611, 100, 60),   # GLP-3
            (436, 405, 86, 58),    # BPC-157
            (602, 613, 102, 60),   # GHK-Cu
            (796, 608, 98, 60),    # Glow
            (1000, 645, 138, 66),  # Selank spray
        ]
    for rect in boxes:
        patch_rect(im, rect, logo_color="blue", fill=(249, 249, 249, 255), logo_scale=0.52, radius=2)
    save(im, OUT / out_name)


def brand_kit() -> None:
    im = Image.open(source("ukpeptides.com_assets_kit4-Dq7mR3xK.webp")).convert("RGBA")
    # Box lid: retain the lid's perspective and pale-blue paper tone while
    # replacing only the source wordmark and URL.
    patch_polygon(
        im,
        [(485, 178), (845, 121), (866, 240), (506, 299)],
        logo_color="ink",
        fill=(249, 249, 250, 255),
        logo_width=235,
        angle=8,
    )
    # Remove the source URL printed on the lower part of the lid.  It is
    # intentionally left blank so the replacement image carries no competing
    # web address while retaining the same clean packaging surface.
    patch_polygon(
        im,
        [(615, 302), (815, 270), (825, 356), (625, 385)],
        logo_color="ink",
        fill=(249, 249, 250, 255),
        logo_width=None,
    )
    # Five vials are tilted slightly in the kit.  Their marks are small, so a
    # white patch plus a compact blue wordmark is cleaner than redrawing the
    # product labels and preserves every product name/dose line below it.
    vial_boxes = [
        (362, 625, 112, 70),
        (522, 597, 112, 70),
        (683, 571, 112, 70),
        (846, 545, 112, 70),
        (1003, 519, 112, 70),
    ]
    for rect in vial_boxes:
        patch_rect(im, rect, logo_color="blue", fill=(250, 250, 250, 255), logo_scale=0.52, radius=2)
    save(im, OUT / "kit.webp")


def copy_article(src_name: str, out_name: str) -> None:
    # Article covers carry no third-party product branding; preserve them
    # pixel-for-pixel except for format normalization for predictable loading.
    im = Image.open(source(src_name)).convert("RGB")
    save(im.convert("RGBA"), OUT / "articles" / out_name, quality=95)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    brand_hero("ukpeptides.com_assets_hero-9-Ht5cVn3q.webp", "hero-desktop.webp")
    brand_hero("ukpeptides.com_assets_hero-mobile-16-Pz9wKd4m.webp", "hero-mobile.webp", mobile=True)
    brand_kit()

    products = {
        "api.ukpeptides.com_static_private-1788186696030-1788186696030-7f75e55c-323a-44a8-bda6-6d04bbf01c29.webp": "bpc-157.webp",
        "api.ukpeptides.com_static_private-1788186884987-1788186884986-bb39c068-53c1-420e-a12d-a60e878299e0.webp": "bpc-157-tb-500.webp",
        "api.ukpeptides.com_static_private-1788203065417-1788203065416-386a8ca4-9dc6-44bd-8db3-8a186b928ce0.webp": "ghk-cu.webp",
        "api.ukpeptides.com_static_private-1788203109936-1788203109936-e0fa314d-322e-47f6-92fc-2dced9d5dc76.webp": "glow.webp",
        "api.ukpeptides.com_static_private-1788203127504-1788203127504-58266968-32bf-4424-96a8-3d9e1ceae0db.webp": "klow.webp",
        "api.ukpeptides.com_static_private-1788204028817-1788204028817-039005f7-95ba-4a76-8167-6461ec6ca320.webp": "tb500.webp",
        "api.ukpeptides.com_static_private-1789368438476-1789368438475-ac62d17f-33c6-4b67-8926-35aecf89c100.webp": "cjc-ipamorelin.webp",
        "api.ukpeptides.com_static_private-1789942340394-1789942340394-ff075a4d-c744-43b1-8e5e-53d78c33577e.webp": "glp-3.webp",
    }
    for src_name, out_name in products.items():
        brand_product(src_name, out_name)

    nasal = {
        "ukpeptides.com_assets_p-bpc-157-nasal-spray-DH9PWxnW.webp": "bpc-157.webp",
        "ukpeptides.com_assets_p-bpc-157-tb-500-nasal-spray-BxzfxiQx.webp": "bpc-157-tb-500.webp",
        "ukpeptides.com_assets_p-dsip-nasal-spray-aHxFnmYx.webp": "dsip.webp",
        "ukpeptides.com_assets_p-glow-nasal-spray-BPGTa-Qf.webp": "glow.webp",
        "ukpeptides.com_assets_p-kisspeptin-nasal-spray-D0I2Wq5c.webp": "kisspeptin.webp",
        "ukpeptides.com_assets_p-nad-500-nasal-spray-D1vQ7dOC.webp": "nad-500.webp",
        "ukpeptides.com_assets_p-oxytocin-nasal-spray-i8Mj9I3v.webp": "oxytocin.webp",
        "ukpeptides.com_assets_p-pt-141-nasal-spray-BPyyMVKK.webp": "pt-141.webp",
        "ukpeptides.com_assets_p-selank-nasal-spray-CGNaMmaL.webp": "selank.webp",
        "ukpeptides.com_assets_p-semax-nasal-spray-BLuBHloT.webp": "semax.webp",
    }
    for src_name, out_name in nasal.items():
        brand_nasal(src_name, out_name)
    # These two square assets are already branded as a separate product line;
    # retain their exact photography and expose them alongside the sprays.
    for src_name, out_name in [
        ("api.ukpeptides.com_static_nasal-tanners-1-p5.webp", "nasal-tanners.webp"),
        ("api.ukpeptides.com_static_melanotan-ii-nasal-spray-1-p5.webp", "melanotan-ii.webp"),
    ]:
        im = Image.open(source(src_name)).convert("RGB")
        save(im.convert("RGBA"), OUT / "nasal" / out_name, quality=95)

    articles = {
        "api.ukpeptides.com_static_1780777166078-1780777166078-cover-storage.webp~v_11": "storage.webp",
        "api.ukpeptides.com_static_1780777118953-1780777118953-cover-glp1.webp~v_11": "glp1.webp",
        "api.ukpeptides.com_static_1780776177770-1780776177770-cover-peptide-bonds.webp~v_11": "peptide-bonds.webp",
    }
    for src_name, out_name in articles.items():
        copy_article(src_name, out_name)

    manifest = {
        "brand": "OmniQure",
        "source": "https://ukpeptides.com/",
        "hero": ["hero-desktop.webp", "hero-mobile.webp"],
        "kit": "kit.webp",
        "products": sorted((OUT / "products").glob("*.webp")),
        "nasal": sorted((OUT / "nasal").glob("*.webp")),
        "articles": sorted((OUT / "articles").glob("*.webp")),
    }
    # Keep the manifest human-readable and relative to this asset directory.
    manifest = {k: [str(p.relative_to(OUT)) for p in v] if isinstance(v, list) and v and isinstance(v[0], Path) else v for k, v in manifest.items()}
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main()
