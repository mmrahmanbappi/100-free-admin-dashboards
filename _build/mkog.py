"""Makes a 1200x630 Open Graph image (og.jpg) for every indexable page of a site.
Reads each page's og:title and its screenshot (link rel=image_src, or the old og:image)."""
import glob, html, io, os, re, sys, urllib.request
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = "/tmp/fonts/Inter.ttf"
BG, INK, MUTED, ACC, CARD = (238, 238, 234), (23, 21, 24), (95, 93, 97), (178, 58, 10), (255, 255, 255)


def font(size, weight):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_axes([min(32, max(14, size)), weight])
    except Exception: pass
    return f


def wrap(d, text, f, width, max_lines):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= width: cur = t
        else:
            lines.append(cur); cur = w
    lines.append(cur)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while d.textlength(lines[-1] + "...", font=f) > width and " " in lines[-1]: lines[-1] = lines[-1].rsplit(" ", 1)[0]
        lines[-1] += "..."
    return lines


def make(out, title, site, mark, shot):
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)
    # screenshot card on the right, slightly tilted, with a soft shadow
    if shot is not None:
        s = shot.convert("RGB"); tw = 600; th = int(tw * s.height / s.width); th = min(th, 420)
        s = s.resize((tw, int(tw * shot.height / shot.width))).crop((0, 0, tw, th))
        mask = Image.new("L", (tw, th), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, tw - 1, th - 1), 18, fill=255)
        card = Image.new("RGBA", (tw, th)); card.paste(s, (0, 0), mask)
        ImageDraw.Draw(card).rounded_rectangle((0, 0, tw - 1, th - 1), 18, outline=(217, 216, 210, 255), width=2)
        rot = card.rotate(4, resample=Image.BICUBIC, expand=True)
        shadow = Image.new("RGBA", rot.size, (0, 0, 0, 0)); sm = rot.split()[3].point(lambda a: 70 if a else 0)
        shadow.putalpha(sm); shadow = shadow.filter(ImageFilter.GaussianBlur(18))
        x, y = W - rot.width + 60, (H - rot.height) // 2 + 20
        im.paste((20, 18, 22), (x + 10, y + 24), shadow); im.paste(rot, (x, y), rot)
    # left column: mark, site name, title, footer
    d.ellipse((64, 60, 116, 112), fill=INK)
    fm = font(18 if len(mark) <= 2 else 14, 800); d.text((90, 86), mark, font=fm, fill=BG, anchor="mm")
    d.text((132, 86), site, font=font(24, 650), fill=INK, anchor="lm")
    ft = font(54, 640); lines = wrap(d, title, ft, 560, 4)
    if len(lines) >= 4: ft = font(44, 640); lines = wrap(d, title, ft, 560, 5)
    lh = int(ft.size * 1.12); y = 160 + max(0, (4 - len(lines))) * lh // 3
    for ln in lines:
        d.text((64, y), ln, font=ft, fill=INK); y += lh
    fb = font(20, 700); pill = "FREE"
    pw = d.textlength(pill, font=fb) + 28
    d.rounded_rectangle((64, 530, 64 + pw, 566), 18, fill=ACC); d.text((64 + pw / 2, 548), pill, font=fb, fill=(255, 255, 255), anchor="mm")
    d.text((64 + pw + 16, 548), "MIT license  |  mmrahmanbappi.github.io", font=font(21, 500), fill=MUTED, anchor="lm")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, "JPEG", quality=84, optimize=True, progressive=True)


def run(root, base, site, mark):
    made = 0; cache = {}
    for f in glob.glob(os.path.join(root, "**", "index.html"), recursive=True):
        if "/_build/" in f or "/node_modules/" in f: continue
        s = open(f, errors="ignore").read()
        m = re.search(r'<meta property="og:image" content="([^"]+/og\.jpg)"', s)
        if not m or "noindex" in s[:3000]: continue
        og = m.group(1)
        if not og.startswith(base): continue
        out = os.path.join(root, og[len(base):].lstrip("/"))
        t = re.search(r'<meta property="og:title" content="([^"]*)"', s)
        title = html.unescape(t.group(1)) if t else html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1))
        src = re.search(r'<link rel="image_src" href="([^"]+)"', s)
        shot = None
        if src:
            u = src.group(1); local = os.path.join(root, u[len(base):].lstrip("/")) if u.startswith(base) else None
            try:
                if local and os.path.isfile(local): shot = Image.open(local)
                else:
                    if u not in cache: cache[u] = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read()
                    shot = Image.open(io.BytesIO(cache[u]))
            except Exception as e:
                print("  no screenshot for", f.replace(root, ""), e)
        make(out, title, site, mark, shot); made += 1
    print(f"{site}: {made} OG images")


if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2].rstrip("/"), sys.argv[3], sys.argv[4])
