#!/usr/bin/env python3
"""
TS Queen Mary — photographic restoration pipeline.

Each source photo is taken through an edge-preserving restoration chain rather
than a single resize, because most of the supplied frames are small, heavily
re-compressed JPEGs pulled off social media:

  1. chroma denoise        kill JPEG colour blotching without touching detail
  2. luma bilateral        smooth flat areas, keep edges crisp
  3. auto levels           percentile black/white point per channel
  4. progressive upscale   iterative 2x Lanczos with micro-sharpen between steps
  5. clarity               large-radius low-amount unsharp (local contrast)
  6. filmic curve          S-curve + lifted blacks
  7. split tone            cool shadows / warm highlights, editorial grade
  8. vibrance              protects already-saturated pixels
  9. capture sharpen       small-radius unsharp, masked to edges
 10. export                WebP responsive ladder + JPEG fallback + LQIP

Monochrome sources skip vibrance/split-tone and get a richer black point.
"""

import json
import os

import numpy as np
from PIL import Image, ImageFilter

SRC = "/Users/raj/Documents/GitHub/tsqm/TSQM-photos"
OUT = "/Users/raj/Documents/GitHub/tsqm/High-End Charity Website Design/public/img"

Image.MAX_IMAGE_PIXELS = None


# ---------------------------------------------------------------- helpers ---

def to_f(img):
    return np.asarray(img, dtype=np.float32) / 255.0


def to_img(arr):
    return Image.fromarray(np.clip(arr * 255.0, 0, 255).astype(np.uint8))


def luma(a):
    return a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722


def chroma_denoise(img, radius=1.6):
    """Blur Cb/Cr only. Removes colour mottling; luma detail untouched."""
    ycbcr = img.convert("YCbCr")
    y, cb, cr = ycbcr.split()
    cb = cb.filter(ImageFilter.GaussianBlur(radius))
    cr = cr.filter(ImageFilter.GaussianBlur(radius))
    return Image.merge("YCbCr", (y, cb, cr)).convert("RGB")


def bilateral(img, radius=2, sigma_range=0.10):
    """
    Cheap separable approximation of a bilateral filter: blend the blurred
    image toward the original wherever the local difference is large, so
    edges survive while flat regions (sky, hull plate, water) get smoothed.
    """
    a = to_f(img)
    blur = to_f(img.filter(ImageFilter.GaussianBlur(radius)))
    diff = np.abs(a - blur).max(axis=2, keepdims=True)
    # weight -> 1 where flat (use blur), -> 0 where edge (keep original)
    w = np.exp(-(diff ** 2) / (2 * sigma_range ** 2))
    return to_img(a * (1 - w) + blur * w)


def white_balance(img, strength=0.55, max_shift=0.10):
    """
    Constrained grey-world. Full grey-world wrecks scenes with one dominant
    colour (a brick wharf, a red deck), so the correction is scaled back and
    hard-clamped to +/-max_shift.
    """
    a = to_f(img)
    means = a.reshape(-1, 3).mean(axis=0)
    grey = means.mean()
    gain = np.clip(grey / np.maximum(means, 1e-4), 1 - max_shift, 1 + max_shift)
    gain = 1.0 + (gain - 1.0) * strength
    return to_img(np.clip(a * gain, 0, 1))


def auto_levels(img, lo_pct=0.4, hi_pct=99.6, per_channel=True):
    a = to_f(img)
    out = np.empty_like(a)
    if per_channel:
        for c in range(3):
            lo, hi = np.percentile(a[..., c], [lo_pct, hi_pct])
            if hi - lo < 1e-4:
                out[..., c] = a[..., c]
            else:
                out[..., c] = (a[..., c] - lo) / (hi - lo)
    else:
        lo, hi = np.percentile(a, [lo_pct, hi_pct])
        out = (a - lo) / max(hi - lo, 1e-4)
    return to_img(np.clip(out, 0, 1))


def progressive_upscale(img, target_w, micro_sharpen=True):
    """Repeated 2x Lanczos beats one large jump: less ringing, more apparent detail."""
    w, h = img.size
    if target_w <= w:
        return img
    cur = img
    while cur.size[0] * 2 <= target_w:
        cur = cur.resize((cur.size[0] * 2, cur.size[1] * 2), Image.LANCZOS)
        if micro_sharpen:
            cur = cur.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=2))
    if cur.size[0] < target_w:
        ratio = target_w / cur.size[0]
        cur = cur.resize((target_w, max(1, round(cur.size[1] * ratio))), Image.LANCZOS)
        if micro_sharpen:
            cur = cur.filter(ImageFilter.UnsharpMask(radius=1.0, percent=40, threshold=2))
    return cur


def clarity(img, radius=28, amount=0.30):
    """Large-radius low-amount unsharp = local contrast / 'clarity'."""
    a = to_f(img)
    base = to_f(img.filter(ImageFilter.GaussianBlur(radius)))
    return to_img(np.clip(a + (a - base) * amount, 0, 1))


def filmic_curve(img, contrast=0.16, lift=0.012, mono=False):
    a = to_f(img)
    # symmetric S-curve around mid grey
    x = np.clip(a, 0, 1)
    s = x + contrast * np.sin(2 * np.pi * x) * -1.0 * 0.5
    s = np.clip(s, 0, 1)
    # smoothstep blend keeps extremes tame
    a = s
    if mono:
        # deeper, richer black point for archival monochrome
        a = np.clip((a - 0.008) / 0.992, 0, 1)
        a = a ** 1.04
    a = a * (1 - lift) + lift
    return to_img(np.clip(a, 0, 1))


def split_tone(img, shadow=(0.00, 0.012, 0.030), highlight=(0.022, 0.012, -0.006), strength=1.0):
    """Cool the shadows, warm the highlights — the classic editorial grade."""
    a = to_f(img)
    l = luma(a)[..., None]
    sh = np.clip(1.0 - l * 1.9, 0, 1)
    hi = np.clip((l - 0.45) * 1.9, 0, 1)
    a = a + np.array(shadow, np.float32) * sh * strength
    a = a + np.array(highlight, np.float32) * hi * strength
    return to_img(np.clip(a, 0, 1))


def vibrance(img, amount=0.26):
    """Boost muted colour, protect already-saturated pixels (and skin-ish tones)."""
    a = to_f(img)
    mx = a.max(axis=2, keepdims=True)
    mn = a.min(axis=2, keepdims=True)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    g = luma(a)[..., None]
    boost = amount * (1.0 - sat)          # less boost where already saturated
    return to_img(np.clip(g + (a - g) * (1.0 + boost), 0, 1))


def edge_masked_sharpen(img, radius=1.0, percent=95, threshold=2, protect_flat=True):
    sharp = img.filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=threshold))
    if not protect_flat:
        return sharp
    a, s = to_f(img), to_f(sharp)
    # edge mask from gradient magnitude, so we don't amplify sky/water noise
    g = luma(a)
    gx = np.abs(np.gradient(g, axis=1))
    gy = np.abs(np.gradient(g, axis=0))
    m = np.clip((gx + gy) * 9.0, 0, 1)[..., None]
    m = to_f(to_img(np.repeat(m, 3, axis=2)).filter(ImageFilter.GaussianBlur(1.0)))
    return to_img(np.clip(a * (1 - m) + s * m, 0, 1))


def lqip(img, w=20):
    """Tiny blurred base64 WebP used as the blur-up placeholder."""
    import base64, io
    h = max(1, round(img.size[1] * w / img.size[0]))
    t = img.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    buf = io.BytesIO()
    t.save(buf, "WEBP", quality=52, method=6)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


# ------------------------------------------------------------------- jobs ---
# role drives the grade; widths drive the responsive ladder.

JOBS = [
    # ---- the ship -----------------------------------------------------
    dict(src="01-ship/historic-bw-underway_2014x960.jpg", out="ship-underway-1933",
         role="mono", widths=[640, 1280, 1920, 2560], crop=None,
         grade=dict(contrast=0.20, clarity_amt=0.34, sharpen=100)),
    dict(src="01-ship/hull-side-and-gangway_2048x1536.jpg", out="ship-hull-gangway",
         role="colour", widths=[640, 1280, 1920, 2400],
         grade=dict(contrast=0.15, clarity_amt=0.30, vib=0.30, sharpen=90)),
    dict(src="01-ship/colour-arriving-glasgow_315x315.jpg", out="ship-arriving-glasgow",
         role="colour-small", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.26, vib=0.2, sharpen=95)),
    dict(src="01-ship/colour-quayside-distant_315x315.jpg", out="ship-quayside",
         role="colour-small", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.24, vib=0.18, sharpen=92)),

    # ---- restoration --------------------------------------------------
    dict(src="02-restoration/salvaged-teak-timber-1_1280x960.jpg", out="teak-salvage-1",
         role="colour", widths=[640, 1280, 1800],
         grade=dict(contrast=0.15, clarity_amt=0.32, vib=0.28, sharpen=88)),
    dict(src="02-restoration/salvaged-teak-timber-2_1280x960.jpg", out="teak-salvage-2",
         role="colour", widths=[640, 1280, 1800],
         grade=dict(contrast=0.15, clarity_amt=0.32, vib=0.28, sharpen=88)),
    dict(src="02-restoration/salvaged-teak-timber-3_1280x960.jpg", out="teak-salvage-3",
         role="colour", widths=[640, 1280, 1800],
         grade=dict(contrast=0.15, clarity_amt=0.32, vib=0.28, sharpen=88)),
    dict(src="02-restoration/salvaged-teak-timber-4_1280x960.jpg", out="teak-salvage-4",
         role="colour", widths=[640, 1280, 1800],
         grade=dict(contrast=0.15, clarity_amt=0.32, vib=0.28, sharpen=88)),
    dict(src="02-restoration/teak-deck-before_315x315.jpg", out="teak-deck-before",
         role="colour-small", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.26, vib=0.16, sharpen=95)),
    dict(src="02-restoration/teak-deck-lifting_315x315.jpg", out="teak-deck-lifting",
         role="colour-small", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.26, vib=0.16, sharpen=95)),
    dict(src="02-restoration/teak-deck-detail_315x315.jpg", out="teak-deck-detail",
         role="colour-small", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.28, vib=0.18, sharpen=98)),
    dict(src="02-restoration/deck-works_315x315.jpg", out="deck-works",
         role="colour-small", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.26, vib=0.17, sharpen=95)),
    dict(src="02-restoration/painted-deck-clyde_315x315.jpg", out="deck-painted-clyde",
         role="colour-small", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.26, vib=0.19, sharpen=95)),
    dict(src="02-restoration/covered-deck-interior_315x315.jpg", out="deck-covered-interior",
         role="colour-small", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.28, vib=0.17, sharpen=98)),

    # ---- events & patrons ---------------------------------------------
    dict(src="03-events-and-patrons/patron-sam-neill_315x315.jpg", out="patron-sam-neill",
         role="portrait", widths=[440, 880],
         grade=dict(contrast=0.13, clarity_amt=0.2, vib=0.14, sharpen=80)),
    dict(src="03-events-and-patrons/princess-royal-90th-reception-1.jpg", out="royal-reception-1",
         role="portrait", widths=[640, 1280],
         grade=dict(contrast=0.13, clarity_amt=0.24, vib=0.20, sharpen=85)),
    dict(src="03-events-and-patrons/princess-royal-90th-reception-2.jpg", out="royal-reception-2",
         role="portrait", widths=[640, 1280],
         grade=dict(contrast=0.13, clarity_amt=0.24, vib=0.20, sharpen=85)),
    dict(src="03-events-and-patrons/princess-royal-90th-reception-3.jpg", out="royal-reception-3",
         role="portrait", widths=[640, 1280],
         grade=dict(contrast=0.13, clarity_amt=0.24, vib=0.20, sharpen=85)),
    dict(src="03-events-and-patrons/princess-royal-90th-reception-4.jpg", out="royal-reception-4",
         role="portrait", widths=[640, 1280],
         grade=dict(contrast=0.13, clarity_amt=0.24, vib=0.20, sharpen=85)),
    dict(src="03-events-and-patrons/princess-royal-90th-reception-5.jpg", out="royal-reception-5",
         role="portrait", widths=[640, 1280],
         grade=dict(contrast=0.13, clarity_amt=0.24, vib=0.20, sharpen=85)),
    dict(src="03-events-and-patrons/princess-royal-90th-reception-6.jpg", out="royal-reception-6",
         role="portrait", widths=[640, 1280],
         grade=dict(contrast=0.13, clarity_amt=0.24, vib=0.20, sharpen=85)),
]



def run():
    os.makedirs(OUT, exist_ok=True)
    manifest = {}

    for job in JOBS:
        path = os.path.join(SRC, job["src"])
        role = job["role"]
        g = job["grade"]
        mono = role == "mono"
        img = Image.open(path).convert("RGB")
        w0, h0 = img.size
        small = w0 <= 700
        # Past ~2.8x, Lanczos stops recovering detail and starts inventing mush.
        target_w = min(max(job["widths"]), round(w0 * 2.8)) if small else max(job["widths"])

        # --- restore -------------------------------------------------
        img = chroma_denoise(img, radius=2.4 if small else 1.3)
        img = bilateral(img, radius=2 if small else 1,
                        sigma_range=0.13 if small else 0.08)
        # Per-channel levels on a small frame with one dominant colour drags the
        # whole white balance with it, so small sources get a luminance-only
        # stretch plus a constrained grey-world correction instead.
        img = auto_levels(img, per_channel=(not mono) and (not small))
        if small and not mono:
            img = white_balance(img)
        img = progressive_upscale(img, target_w)
        img = clarity(img, radius=max(18, target_w // 60), amount=g["clarity_amt"])
        img = filmic_curve(img, contrast=g["contrast"], mono=mono)
        if mono:
            # keep it a true, neutral archival monochrome with a whisper of warmth
            a = to_f(img)
            y = luma(a)[..., None]
            img = to_img(np.clip(y + np.array([0.012, 0.004, -0.010], np.float32)
                                 * (1 - np.abs(y - 0.5) * 2) * 0.9, 0, 1))
        else:
            img = vibrance(img, amount=g.get("vib", 0.24))
            img = split_tone(img, strength=0.55 if role == "portrait" else (0.6 if small else 1.0))
        img = edge_masked_sharpen(img, radius=1.1, percent=g["sharpen"], threshold=2)

        master = img
        mw, mh = master.size

        entry = {
            "src": job["src"],
            "width": mw,
            "height": mh,
            "aspect": round(mw / mh, 4),
            "mono": mono,
            "lqip": lqip(master),
            "widths": [],
        }

        for w in job["widths"]:
            if w > mw:
                continue
            h = max(1, round(mh * w / mw))
            v = master.resize((w, h), Image.LANCZOS) if w != mw else master
            if w != mw:
                v = v.filter(ImageFilter.UnsharpMask(radius=0.8, percent=42, threshold=2))
            v.save(f"{OUT}/{job['out']}-{w}.webp", "WEBP", quality=84, method=6)
            entry["widths"].append(w)

        # JPEG fallback at the largest rung, for mail clients / old browsers / OG
        fw = entry["widths"][-1]
        fh = max(1, round(mh * fw / mw))
        master.resize((fw, fh), Image.LANCZOS).save(
            f"{OUT}/{job['out']}-{fw}.jpg", "JPEG", quality=86, optimize=True, progressive=True)
        entry["fallback"] = fw

        manifest[job["out"]] = entry
        print(f"  {job['out']:26s} {w0}x{h0} -> {mw}x{mh}  {entry['widths']}")

    with open(f"{OUT}/manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\nwrote {len(manifest)} images to {OUT}")


if __name__ == "__main__":
    run()
