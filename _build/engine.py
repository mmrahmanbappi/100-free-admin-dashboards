"""Builds a complete multi-page admin dashboard from a short spec."""
import html
import math
import os
import random
import re
from datetime import date, timedelta

from assets import CSS, JS, icon

REPO = "https://github.com/mmrahmanbappi/100-free-admin-dashboards"
TODAY = date(2026, 9, 23)

FIRST = ["Amara", "Ben", "Chloe", "Daniel", "Elena", "Farid", "Grace", "Hugo", "Iris", "Jonah", "Kavya", "Liam", "Maya", "Noah",
         "Olivia", "Priya", "Quinn", "Rafael", "Sara", "Tomas", "Uma", "Victor", "Wen", "Yusuf", "Zoe", "Aisha", "Carlos", "Dina",
         "Ethan", "Fatima", "Gabriel", "Hana", "Isaac", "Julia", "Kenji", "Leila", "Marco", "Nadia", "Omar", "Paula", "Rohan", "Sofia"]
LAST = ["Adams", "Bennett", "Chen", "Diaz", "Evans", "Fischer", "Garcia", "Hughes", "Ito", "Jensen", "Khan", "Lopez", "Morris",
        "Novak", "Okafor", "Patel", "Quinn", "Rossi", "Silva", "Tanaka", "Usman", "Varga", "Walsh", "Young", "Zhang", "Rahman",
        "Costa", "Nguyen", "Kowalski", "Haddad", "Mensah", "Larsen", "Moreau", "Sato", "Ibrahim", "Ferreira"]
COMP1 = ["North", "Blue", "Summit", "Maple", "Harbor", "Silver", "Oak", "River", "Bright", "Stone", "Cedar", "Pioneer", "Atlas",
         "Beacon", "Crest", "Delta", "Evergreen", "Falcon", "Granite", "Horizon", "Ivory", "Juniper", "Keystone", "Lumen"]
COMP2 = ["Labs", "Group", "Studio", "Partners", "Works", "Co.", "Systems", "Foods", "Logistics", "Health", "Retail", "Media",
         "Capital", "Supply", "Energy", "Designs", "Holdings", "Traders", "Motors", "Clinic"]
CITIES = ["London", "Berlin", "Austin", "Toronto", "Lisbon", "Singapore", "Dubai", "Sydney", "Nairobi", "Seoul", "Madrid", "Chicago",
          "Mumbai", "Oslo", "Cape Town", "Denver", "Dublin", "Osaka", "Warsaw", "Lagos"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

GOOD = r"paid|active|complete|approved|delivered|online|healthy|success|resolved|published|won|open|in stock|settled|confirmed|verified|passed|live|done|ready|received|available|enrolled|on track|up|filed|cleared|accepted|shipped|signed|good|normal|running|booked|checked in"
WARN = r"pending|review|processing|draft|scheduled|trial|waiting|due|partial|in progress|low|at risk|queued|hold|planned|preparing|new|warning|maintenance|investigating|submitted|negotiation|reserved|delayed|limited|expiring|busy"
BAD = r"overdue|failed|cancel|reject|offline|critical|declined|lost|churn|blocked|expired|out of stock|breach|closed|refund|fraud|disputed|suspended|down|missed|void|late|error|inactive|high|stopped|urgent"


def tone(word):
    w = word.lower()
    if re.search(BAD, w):
        return "bad"
    if re.search(GOOD, w):
        return "good"
    if re.search(WARN, w):
        return "warn"
    return "info" if len(w) % 2 else "mute"


def esc(s):
    return html.escape(str(s), quote=True)


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def initials(name):
    parts = re.findall(r"[A-Za-z]+", name)
    return (parts[0][0] + (parts[1][0] if len(parts) > 1 else "")).upper() if parts else "?"


def rng(arg, default):
    m = re.match(r"^(-?[\d.]+)-(-?[\d.]+)$", arg or "")
    return (float(m.group(1)), float(m.group(2))) if m else default


class Data:
    """Seeded, believable demo data."""

    def __init__(self, seed, currency="$"):
        self.r = random.Random(seed)
        self.cur = currency

    def person(self):
        return f"{self.r.choice(FIRST)} {self.r.choice(LAST)}"

    def company(self):
        return f"{self.r.choice(COMP1)} {self.r.choice(COMP2)}"

    def money(self, lo=50, hi=20000):
        v = self.r.uniform(lo, hi)
        return v

    def fmt_money(self, v):
        if v >= 100:
            return f"{self.cur}{v:,.0f}"
        return f"{self.cur}{v:,.2f}"

    def day(self, back=120, fwd=0):
        return TODAY - timedelta(days=self.r.randint(-fwd, back))

    def value(self, ftype, i, prefix):
        r = self.r
        kind, _, arg = ftype.partition(":")
        if kind == "id":
            return f"{prefix}{1040 + i * 7 + r.randint(0, 5)}", None
        if kind == "person":
            return self.person(), None
        if kind == "company":
            return self.company(), None
        if kind == "email":
            return f"{r.choice(FIRST).lower()}@{r.choice(COMP1).lower()}.com", None
        if kind == "money":
            lo, hi = rng(arg, (50, 20000))
            v = self.money(lo, hi)
            return self.fmt_money(v), v
        if kind == "int":
            lo, hi = rng(arg, (1, 500))
            v = r.randint(int(lo), int(hi))
            return f"{v:,}", v
        if kind == "pct":
            lo, hi = rng(arg, (0, 100))
            v = r.uniform(lo, hi)
            return f"{v:.1f}%", v
        if kind == "date":
            d = self.day(120, 30 if arg == "future" else 0)
            if arg == "future":
                d = TODAY + timedelta(days=r.randint(1, 60))
            return d.strftime("%d %b %Y"), d.toordinal()
        if kind == "time":
            h = r.randint(7, 19)
            return f"{h:02d}:{r.choice(['00', '15', '30', '45'])}", h
        if kind in ("status", "choice"):
            opts = arg.split("|")
            weights = [max(1, len(opts) - k) * (3 if k == 0 else 1) for k in range(len(opts))]
            return r.choices(opts, weights=weights)[0], None
        if kind == "ratio":
            lo, hi = rng(arg, (1, 8))
            v = r.uniform(lo, hi)
            return f"{v:.1f}x", v
        if kind == "city":
            return r.choice(CITIES), None
        if kind == "phone":
            return f"+1 555 0{r.randint(100, 199)}", None
        if kind == "rating":
            v = r.choice([3.8, 4.1, 4.3, 4.5, 4.6, 4.8, 4.9, 5.0])
            return f"{v:.1f}", v
        if kind == "duration":
            m = r.randint(5, 240)
            return f"{m // 60}h {m % 60:02d}m" if m >= 60 else f"{m}m", m
        if kind == "words":
            return r.choice(arg.split("|")), None
        if kind == "code":
            return f"{arg}{r.randint(10000, 99999)}", None
        return "", None

    def series(self, n, base, vol=0.12, trend=0.02):
        out, v = [], base
        for _ in range(n):
            v = max(base * 0.3, v * (1 + trend + self.r.uniform(-vol, vol)))
            out.append(v)
        return out


# ---------------- charts (inline SVG) ----------------

def _fmt_axis(v):
    if v >= 1_000_000:
        return f"{v / 1_000_000:.1f}M"
    if v >= 1000:
        return f"{v / 1000:.0f}k"
    return f"{v:.0f}"


def line_chart(series, labels, w=640, h=240, area=True, names=None):
    pad_l, pad_b, pad_t = 42, 26, 10
    iw, ih = w - pad_l - 8, h - pad_b - pad_t
    mx = max(max(s) for s in series) * 1.1
    out = [f'<svg class="ch" viewBox="0 0 {w} {h}" role="img" aria-label="Line chart">']
    for k in range(5):
        y = pad_t + ih - ih * k / 4
        out.append(f'<line x1="{pad_l}" x2="{w - 8}" y1="{y:.1f}" y2="{y:.1f}" style="stroke:var(--line)"/>'
                   f'<text x="{pad_l - 8}" y="{y + 4:.1f}" text-anchor="end">{_fmt_axis(mx * k / 4)}</text>')
    n = len(labels)
    step = max(1, n // 7)
    for i, lab in enumerate(labels):
        if i % step == 0:
            out.append(f'<text x="{pad_l + iw * i / (n - 1):.1f}" y="{h - 6}" text-anchor="middle">{esc(lab)}</text>')
    colors = ["var(--c1)", "var(--c2)", "var(--c3)"]
    for si, s in enumerate(series):
        pts = [(pad_l + iw * i / (len(s) - 1), pad_t + ih - ih * v / mx) for i, v in enumerate(s)]
        d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        if area and si == 0:
            out.append(f'<path d="{d} L{pts[-1][0]:.1f},{pad_t + ih} L{pts[0][0]:.1f},{pad_t + ih} Z" style="fill:{colors[si]};opacity:.10"/>')
        dash = ";stroke-dasharray:5 5" if si == 1 else ""
        out.append(f'<path d="{d}" style="fill:none;stroke:{colors[si]};stroke-width:2.2{dash}" stroke-linejoin="round" stroke-linecap="round"/>')
    out.append("</svg>")
    if names:
        out.append('<div class="legend">' + "".join(f'<span><i style="background:{colors[k]}"></i>{esc(nm)}</span>' for k, nm in enumerate(names)) + "</div>")
    return "".join(out)


def bar_chart(values, labels, w=640, h=240, color="var(--c1)"):
    pad_l, pad_b, pad_t = 42, 26, 10
    iw, ih = w - pad_l - 8, h - pad_b - pad_t
    mx = max(values) * 1.12
    n = len(values)
    bw = iw / n * 0.62
    out = [f'<svg class="ch" viewBox="0 0 {w} {h}" role="img" aria-label="Bar chart">']
    for k in range(5):
        y = pad_t + ih - ih * k / 4
        out.append(f'<line x1="{pad_l}" x2="{w - 8}" y1="{y:.1f}" y2="{y:.1f}" style="stroke:var(--line)"/>'
                   f'<text x="{pad_l - 8}" y="{y + 4:.1f}" text-anchor="end">{_fmt_axis(mx * k / 4)}</text>')
    for i, v in enumerate(values):
        x = pad_l + iw * i / n + (iw / n - bw) / 2
        bh = ih * v / mx
        out.append(f'<rect x="{x:.1f}" y="{pad_t + ih - bh:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="3" style="fill:{color}"/>'
                   f'<text x="{x + bw / 2:.1f}" y="{h - 6}" text-anchor="middle">{esc(labels[i])}</text>')
    out.append("</svg>")
    return "".join(out)


def donut(parts, size=180):
    total = sum(v for _, v in parts)
    r, cx, cy, sw = 62, size / 2, size / 2, 22
    colors = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--line)"]
    out = [f'<svg class="ch" viewBox="0 0 {size} {size}" style="max-width:{size}px;margin:0 auto" role="img" aria-label="Donut chart">']
    a = -math.pi / 2
    for k, (_, v) in enumerate(parts):
        frac = v / total
        a2 = a + frac * 2 * math.pi
        large = 1 if frac > .5 else 0
        x1, y1, x2, y2 = cx + r * math.cos(a), cy + r * math.sin(a), cx + r * math.cos(a2 - 0.001), cy + r * math.sin(a2 - 0.001)
        out.append(f'<path d="M{x1:.1f},{y1:.1f} A{r},{r} 0 {large} 1 {x2:.1f},{y2:.1f}" style="fill:none;stroke:{colors[k % 5]};stroke-width:{sw}"/>')
        a = a2
    out.append(f'<text x="{cx}" y="{cy - 2}" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ink);font-family:var(--f-num)">{total:,.0f}</text>'
               f'<text x="{cx}" y="{cy + 16}" text-anchor="middle">total</text></svg>')
    out.append('<div class="legend">' + "".join(
        f'<span><i style="background:{colors[k % 5]}"></i>{esc(n)} {v / total * 100:.0f}%</span>' for k, (n, v) in enumerate(parts)) + "</div>")
    return "".join(out)


def spark(values, up=True):
    w, h = 120, 36
    mx, mn = max(values), min(values)
    rng = (mx - mn) or 1
    pts = " ".join(f"{w * i / (len(values) - 1):.1f},{h - 3 - (h - 6) * (v - mn) / rng:.1f}" for i, v in enumerate(values))
    col = "var(--good)" if up else "var(--bad)"
    return f'<svg class="spark" viewBox="0 0 {w} {h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="{pts}" style="fill:none;stroke:{col};stroke-width:2"/></svg>'


# ---------------- theme ----------------

def theme_css(t):
    f = t["fonts"]
    layout = t.get("layout", "dark")
    card = t.get("card", "border")
    v = {
        "--accent": t["accent"], "--on-accent": t.get("on_accent", "#fff"),
        "--bg": t.get("bg", "#f6f7f9"), "--surface": t.get("surface", "#fff"), "--surface-2": t.get("surface2", "#f3f4f6"),
        "--ink": t.get("ink", "#111827"), "--text": t.get("text", "#374151"), "--muted": t.get("muted", "#6b7280"),
        "--line": t.get("line", "#e5e7eb"),
        "--d-bg": t.get("d_bg", "#0f1115"), "--d-surface": t.get("d_surface", "#171a21"), "--d-surface-2": t.get("d_surface2", "#1e222b"),
        "--d-ink": "#f3f4f6", "--d-text": "#d1d5db", "--d-muted": "#9ca3af", "--d-line": t.get("d_line", "#2a2f3a"),
        "--c1": t["accent"], "--c2": t.get("c2", "#94a3b8"), "--c3": t.get("c3", "#f59e0b"), "--c4": t.get("c4", "#10b981"),
        "--radius": t.get("radius", "10px"),
        "--f-head": f"'{f[0]}',system-ui,sans-serif", "--f-body": f"'{f[1]}',system-ui,sans-serif",
        "--f-mono": f"'{f[2]}',ui-monospace,monospace", "--f-num": f"'{f[3] if len(f) > 3 else f[0]}',system-ui,sans-serif",
    }
    root = ";".join(f"{k}:{val}" for k, val in v.items())
    root += ";--accent-soft:color-mix(in srgb,var(--accent) 13%,var(--surface));--accent-ink:color-mix(in srgb,var(--accent) 78%,#000)"
    sb = {
        "dark": f"--sb-bg:{t.get('sidebar', '#111827')};--sb-text:#cbd5e1;--sb-ink:#fff;--sb-line:transparent;--sb-hover:rgba(255,255,255,.07);--sb-active:var(--accent);--sb-active-text:var(--on-accent)",
        "light": "--sb-bg:var(--surface);--sb-text:var(--text);--sb-ink:var(--ink);--sb-line:var(--line);--sb-hover:var(--surface-2);--sb-active:var(--accent-soft);--sb-active-text:var(--accent-ink)",
        "tint": "--sb-bg:color-mix(in srgb,var(--accent) 8%,var(--bg));--sb-text:var(--text);--sb-ink:var(--ink);--sb-line:var(--line);--sb-hover:color-mix(in srgb,var(--accent) 12%,var(--bg));--sb-active:var(--accent);--sb-active-text:var(--on-accent)",
        "accent": "--sb-bg:var(--accent);--sb-text:color-mix(in srgb,var(--on-accent) 80%,transparent);--sb-ink:var(--on-accent);--sb-line:transparent;--sb-hover:rgba(255,255,255,.12);--sb-active:var(--on-accent);--sb-active-text:var(--accent)",
    }[layout]
    cards = {
        "border": "--card-line:var(--line);--card-shadow:none",
        "shadow": "--card-line:transparent;--card-shadow:0 1px 2px rgba(16,24,40,.05),0 6px 20px -8px rgba(16,24,40,.12)",
        "flat": "--card-line:transparent;--card-shadow:none",
    }[card]
    extra = ""
    if card == "flat":
        extra = "body{background:var(--surface-2)}.card,.tile,.kc{background:var(--surface)}"
    if layout == "accent":
        extra += "[data-theme=dark]{--sb-bg:var(--d-surface);--sb-active:var(--accent);--sb-active-text:var(--on-accent)}"
    if layout == "tint":
        extra += "[data-theme=dark]{--sb-bg:var(--d-surface)}"
    return f":root{{{root};{sb};{cards}}}\n{extra}\n" + CSS.strip() + "\n"


# ---------------- page shell ----------------

class Dash:
    def __init__(self, spec):
        self.s = spec
        self.d = Data(spec["slug"], spec.get("currency", "$"))
        self.pages = []  # (file, title, group, icon)
        self.rows = {}
        self._plan()

    # ---- planning ----
    def _plan(self):
        s = self.s
        self.nav = [("Main", [("index.html", "Overview", "home")])]
        ents = []
        for e in s["entities"]:
            e.setdefault("slug", slugify(e["plural"]))
            e.setdefault("icon", "list")
            ents.append((f"{e['slug']}.html", e["plural"], e["icon"]))
        self.nav[0][1].extend(ents)
        sp = [(f"{slugify(x['title'])}.html", x["title"], x.get("icon", "chart")) for x in s["specials"]]
        self.nav.append(("Tools", sp))
        self.nav.append(("Workspace", [("team.html", "Team", "users"), ("notifications.html", "Notifications", "bell"),
                                       ("activity.html", "Activity log", "activity"), ("settings.html", "Settings", "settings"),
                                       ("help.html", "Help center", "help"), ("ui-components.html", "UI components", "components")]))
        for e in s["entities"]:
            self.rows[e["slug"]] = self._make_rows(e, 14)

    def _make_rows(self, e, n):
        rows = []
        for i in range(n):
            row = []
            for label, ftype in e["fields"]:
                txt, num = self.d.value(ftype, i, e.get("prefix", ""))
                row.append((label, ftype, txt, num))
            rows.append(row)
        return rows

    # ---- shell ----
    def head(self, title, body_cls=""):
        s = self.s
        fams = "&".join("family=" + f.replace(" ", "+") + ":wght@400;500;600;700" for f in dict.fromkeys(s["theme"]["fonts"]))
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} | {esc(s['brand'])} {esc(s['category'])} Dashboard</title>
<meta name="description" content="{esc(s['brand'])}: a free {esc(s['category'].lower())} admin dashboard template. {esc(title)} page.">
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="{s['theme']['accent']}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='{s['theme']['accent'].replace('#', '%23')}'/><text x='32' y='42' font-family='Arial' font-size='30' font-weight='700' text-anchor='middle' fill='white'>{s['brand'][0]}</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{fams}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/app.css">
</head>
<body data-app="{s['slug']}" class="{body_cls}">
"""

    def shell(self, file, title, content):
        s = self.s
        navh = []
        for group, items in self.nav:
            navh.append(f'<div class="lbl">{esc(group)}</div>')
            for f, t, ic in items:
                cur = ' aria-current="page"' if f == file else ""
                navh.append(f'<a href="{f}"{cur}>{icon(ic)}<span>{esc(t)}</span></a>')
        me = s.get("user", "Alex Morgan")
        return self.head(title) + f"""<div class="app">
<aside class="sb" aria-label="Main navigation">
<a class="brand" href="index.html"><span class="mk">{s['brand'][0]}</span><span>{esc(s['brand'])}<small>{esc(s['org'])}</small></span></a>
<nav class="nav">{''.join(navh)}</nav>
<div class="foot">{esc(s['brand'])} dashboard, free template<br><a href="login.html">Sign out</a></div>
</aside>
<div class="main">
<header class="tb">
<button class="ib burger" data-burger aria-label="Open menu">{icon('menu')}</button>
<label class="search">{icon('search')}<span class="sr">Search</span><input type="search" placeholder="Search {esc(s['entities'][0]['plural'].lower())}, people, reports"></label>
<span class="sp"></span>
<button class="ib" data-theme-toggle aria-label="Switch light or dark theme">{icon('moon')}</button>
<a class="ib" href="notifications.html" aria-label="Notifications">{icon('bell')}<span class="dot"></span></a>
<a class="av" href="profile.html" aria-label="Your profile">{initials(me)}</a>
</header>
<main class="ct" id="main">
{content}
</main>
</div>
</div>
<script src="assets/js/app.js"></script>
</body>
</html>
"""

    def ph(self, title, sub, actions="", crumb=None):
        c = f'<div class="crumb">{crumb}</div>' if crumb else ""
        return f'<div class="ph"><div>{c}<h1>{esc(title)}</h1><p>{esc(sub)}</p></div><div class="row">{actions}</div></div>'

    def add(self, file, title, html_):
        self.pages.append((file, title))
        self.out[file] = html_

    # ---- cells ----
    def cell(self, label, ftype, txt, num, ent=None, i=0, first=False):
        kind = ftype.split(":")[0]
        if first and ent:
            return f'<td><a class="t" href="{ent["slug"]}-detail.html">{esc(txt)}</a></td>'
        if kind == "person":
            return f'<td><span class="who"><span class="av">{initials(txt)}</span>{esc(txt)}</span></td>'
        if kind == "status":
            return f'<td><span class="pill p-{tone(txt)}">{esc(txt)}</span></td>'
        if kind in ("money", "int", "pct", "rating", "ratio"):
            return f'<td class="num" data-v="{num:.2f}">{esc(txt)}</td>'
        if kind == "date":
            return f'<td data-v="{num}">{esc(txt)}</td>'
        if kind in ("id", "code"):
            return f'<td class="mono">{esc(txt)}</td>'
        return f"<td>{esc(txt)}</td>"

    def table(self, ent, rows, tid=None, check=False, limit=None):
        heads = []
        for label, ftype in ent["fields"]:
            num = ftype.split(":")[0] in ("money", "int", "pct", "rating", "ratio")
            heads.append(f'<th data-sort{" class=num" if num else ""}>{esc(label)}</th>')
        chk_h = '<th><input type="checkbox" data-all aria-label="Select all"></th>' if check else ""
        body = []
        for i, row in enumerate(rows[:limit] if limit else rows):
            st = next((c[2] for c in row if c[1].startswith("status")), "")
            chk = f'<td><input type="checkbox" aria-label="Select row {i + 1}"></td>' if check else ""
            cells = "".join(self.cell(l, f, t, n, ent, i, k == 0) for k, (l, f, t, n) in enumerate(row))
            body.append(f'<tr data-status="{esc(st)}">{chk}{cells}</tr>')
        ta = f' data-table="{tid}"' if tid else ""
        return f'<div class="tw"><table{ta}><thead><tr>{chk_h}{"".join(heads)}</tr></thead><tbody>{"".join(body)}</tbody></table></div>'

    # ---------------- pages ----------------
    def build(self, outdir):
        self.out = {}
        s, d = self.s, self.d
        ents = s["entities"]
        self.p_overview()
        for e in ents:
            self.p_list(e)
            self.p_detail(e)
            self.p_form(e)
        for sp in s["specials"]:
            getattr(self, "sp_" + sp["type"])(sp)
        self.p_team()
        self.p_notifications()
        self.p_activity()
        self.p_settings()
        self.p_profile()
        self.p_help()
        self.p_components()
        self.p_auth()
        os.makedirs(os.path.join(outdir, "assets", "css"), exist_ok=True)
        os.makedirs(os.path.join(outdir, "assets", "js"), exist_ok=True)
        open(os.path.join(outdir, "assets", "css", "app.css"), "w").write(theme_css(s["theme"]))
        open(os.path.join(outdir, "assets", "js", "app.js"), "w").write(JS.strip() + "\n")
        for f, h in self.out.items():
            open(os.path.join(outdir, f), "w", encoding="utf-8").write(h)
        self.readme(outdir)
        return len(self.out)

    def p_overview(self):
        s, d = self.s, self.d
        k_html = []
        for label, kind, base, ic in s["kpis"]:
            ser = d.series(14, base, 0.08, 0.01)
            up = d.r.random() > 0.25
            delta = d.r.uniform(1.2, 18.5)
            val = ser[-1]
            if kind == "pct":
                ser = [min(x, base * 1.06, 99.4) for x in ser]
                val = ser[-1]
            v = d.fmt_money(val) if kind == "money" else (f"{val:.1f}%" if kind == "pct" else (f"{val:.1f}x" if kind == "ratio" else f"{val:,.0f}"))
            k_html.append(f'<div class="card kpi"><span class="l">{icon(ic)}{esc(label)}</span><span class="v">{v}</span>'
                          f'<span class="d {"up" if up else "down"}">{"+" if up else "-"}{delta:.1f}% vs last month</span>{spark(ser, up)}</div>')
        ch = s["chart"]
        labels = MONTHS[TODAY.month - 12:] + MONTHS[:TODAY.month] if TODAY.month < 12 else MONTHS
        labels = (MONTHS * 2)[TODAY.month:TODAY.month + 12]
        a = d.series(12, ch["base"], 0.1, 0.03)
        b = [x * d.r.uniform(0.7, 0.9) for x in d.series(12, ch["base"], 0.1, 0.02)]
        parts = [(n, d.r.randint(12, 60)) for n in s["mix"]["parts"]]
        e0 = s["entities"][0]
        acts = "".join(f'<li><span class="av">{initials(p)}</span><div class="grow"><b>{esc(p)}</b><span>{esc(a_)}</span></div><span class="mono" style="color:var(--muted);font-size:12px">{d.r.randint(2, 59)}m</span></li>'
                       for p, a_ in [(d.person(), x) for x in s["activity"][:5]])
        greet = f"Good morning, {s.get('user', 'Alex Morgan').split()[0]}"
        c = self.ph(greet, s["tagline"], f'<select aria-label="Date range"><option>Last 30 days</option><option>Last 90 days</option><option>This year</option></select><a class="btn pri" href="{e0["slug"]}-form.html">{icon("plus")}New {esc(e0["singular"].lower())}</a>')
        chart_card = f'<div class="card"><h2>{esc(ch["title"])}<small>Last 12 months</small></h2>{line_chart([a, b], labels, names=ch["names"])}</div>'
        mix_card = f'<div class="card"><h2>{esc(s["mix"]["title"])}</h2>{donut(parts)}</div>'
        tbl_card = f'<div class="card"><h2>Recent {esc(e0["plural"].lower())}<a class="btn ghost" href="{e0["slug"]}.html">View all</a></h2>{self.table(e0, self.rows[e0["slug"]], limit=6)}</div>'
        act_card = f'<div class="card"><h2>Latest activity<a class="btn ghost" href="activity.html">All</a></h2><ul class="list">{acts}</ul></div>'
        variant = s.get("ov", s.get("num", 0) % 3)
        if variant == 1:
            strip = "".join(f'<div class="kpi" style="padding:4px 18px;border-left:1px solid var(--line)">{h[h.index(">") + 1:h.rindex("</div>")]}</div>' if k else f'<div class="kpi" style="padding:4px 18px 4px 0">{h[h.index(">") + 1:h.rindex("</div>")]}</div>' for k, h in enumerate(k_html))
            c += f'<div class="card"><div class="g g4" style="gap:0">{strip}</div></div>'
            c += f'<div class="g g12">{mix_card}{chart_card}</div>'
            c += f'<div class="g g12">{act_card}{tbl_card}</div>'
        elif variant == 2:
            big = k_html[0].replace('class="card kpi"', 'class="card kpi" style="justify-content:space-between"')
            c += f'<div class="g g21"><div class="card"><h2>{esc(s["kpis"][0][0])}<small>{esc(ch["title"])}, last 12 months</small></h2><div class="kpi" style="margin-bottom:10px"><span class="v" style="font-size:34px">{k_html[0].split(chr(34) + "v" + chr(34) + ">")[1].split("<")[0]}</span></div>{line_chart([a, b], labels, names=ch["names"])}</div>'
            c += f'<div class="g" style="align-content:start">{"".join(k_html[1:])}</div></div>'
            c += tbl_card
            c += f'<div class="g g2">{mix_card}{act_card}</div>'
        else:
            c += f'<div class="g g4">{"".join(k_html)}</div>'
            c += f'<div class="g g21">{chart_card}{mix_card}</div>'
            c += f'<div class="g g21">{tbl_card}{act_card}</div>'
        self.add("index.html", "Overview", self.shell("index.html", "Overview", c))

    def p_list(self, e):
        rows = self.rows[e["slug"]]
        sf = next((f for _, f in e["fields"] if f.startswith("status")), None)
        chips = ""
        if sf:
            opts = sf.split(":")[1].split("|")
            counts = {o: sum(1 for r in rows if any(c[2] == o for c in r)) for o in opts}
            chips = f'<div class="chips" role="group" aria-label="Filter by status"><button class="chip" data-chip="{e["slug"]}" data-value="all" aria-pressed="true">All<b>{len(rows)}</b></button>' + "".join(
                f'<button class="chip" data-chip="{e["slug"]}" data-value="{esc(o)}" aria-pressed="false">{esc(o)}<b>{counts[o]}</b></button>' for o in opts) + "</div>"
        acts = f'<a class="btn" href="#">{icon("download")}Export</a><a class="btn pri" href="{e["slug"]}-form.html">{icon("plus")}New {esc(e["singular"].lower())}</a>'
        c = self.ph(e["plural"], e["desc"], acts)
        c += f'<div class="card"><div class="toolbar"><label class="inp">{icon("search")}<span class="sr">Search</span><input data-search="{e["slug"]}" placeholder="Search {esc(e["plural"].lower())}"></label>{chips}</div>'
        c += self.table(e, rows, tid=e["slug"], check=True)
        c += f'<div class="pager"><span>Showing 1 to {len(rows)} of {len(rows) * 9 + 3} {esc(e["plural"].lower())}</span><span class="pg"><a href="#" aria-current="page">1</a><a href="#">2</a><a href="#">3</a><a href="#">Next</a></span></div></div>'
        self.add(f"{e['slug']}.html", e["plural"], self.shell(f"{e['slug']}.html", e["plural"], c))

    def p_detail(self, e):
        d = self.d
        row = self.rows[e["slug"]][0]
        title = row[0][2]
        st = next((c[2] for c in row if c[1].startswith("status")), None)
        pill = f' <span class="pill p-{tone(st)}" style="vertical-align:middle;font-size:13px">{esc(st)}</span>' if st else ""
        facts = "".join(f"<div><dt>{esc(l)}</dt><dd>{esc(t)}</dd></div>" for l, f, t, n in row[1:])
        ser = d.series(12, 100, 0.12, 0.03)
        labels = (MONTHS * 2)[TODAY.month:TODAY.month + 12]
        tl = "".join(f"<li><b>{esc(x)}</b><span>{esc(d.person())}, {d.day(40).strftime('%d %b %Y')}</span></li>" for x in e.get("events", ["Created", "Updated details", "Status changed", "Note added", "Assigned owner"]))
        rel = self.s["entities"][1] if self.s["entities"][0] is e else self.s["entities"][0]
        rel_items = "".join(f'<li><div class="grow"><b>{esc(r[0][2])}</b><span>{esc(r[1][2])}</span></div></li>' for r in self.rows[rel["slug"]][:4])
        owner = d.person()
        crumb = f'<a href="{e["slug"]}.html">{esc(e["plural"])}</a> / {esc(title)}'
        c = self.ph(title, f"{e['singular']} details", f'<a class="btn" href="{e["slug"]}-form.html">Edit</a><a class="btn pri" href="#">{esc(e.get("action", "Save changes"))}</a>', crumb)
        c = c.replace(f"<h1>{esc(title)}</h1>", f"<h1>{esc(title)}{pill}</h1>")
        c += f'<div class="g g21"><div class="g"><div class="card"><h2>Key facts</h2><dl class="facts">{facts}</dl></div>'
        c += f'<div class="card" data-tabs><div class="tabs" role="tablist"><button role="tab" aria-selected="true">Trend</button><button role="tab" aria-selected="false">History</button><button role="tab" aria-selected="false">Notes</button></div>'
        c += f'<div data-panel>{line_chart([ser], labels, h=200)}</div><div data-panel hidden><ul class="tl">{tl}</ul></div>'
        c += f'<div data-panel hidden><div class="field full"><label for="nt">Add a note</label><textarea id="nt" rows="4" placeholder="Write a note for your team"></textarea></div><p style="color:var(--muted);margin-top:12px">No notes yet.</p></div></div></div>'
        c += f'<div class="g"><div class="card"><h2>Owner</h2><div class="who"><span class="av">{initials(owner)}</span><div><b style="color:var(--ink)">{esc(owner)}</b><br><span style="color:var(--muted);font-size:12.5px">{esc(e.get("owner_role", "Account owner"))}</span></div></div></div>'
        c += f'<div class="card"><h2>Related {esc(rel["plural"].lower())}</h2><ul class="list">{rel_items}</ul></div></div></div>'
        self.add(f"{e['slug']}-detail.html", f"{e['singular']} details", self.shell(f"{e['slug']}.html", title, c))

    def p_form(self, e):
        fields = []
        for label, ftype in e["fields"]:
            kind, _, arg = ftype.partition(":")
            fid = slugify(label)
            if kind == "id":
                inp = f'<input id="{fid}" value="Assigned automatically" disabled>'
            elif kind in ("status", "choice", "words"):
                inp = f'<select id="{fid}">' + "".join(f"<option>{esc(o)}</option>" for o in arg.split("|")) + "</select>"
            elif kind == "date":
                inp = f'<input id="{fid}" type="date">'
            elif kind in ("money", "int", "pct", "rating", "ratio"):
                inp = f'<input id="{fid}" type="number" step="any" placeholder="0">'
            elif kind == "email":
                inp = f'<input id="{fid}" type="email" placeholder="name@company.com">'
            elif kind == "time":
                inp = f'<input id="{fid}" type="time">'
            else:
                inp = f'<input id="{fid}" placeholder="{esc(label)}">'
            fields.append(f'<div class="field"><label for="{fid}">{esc(label)}</label>{inp}</div>')
        fields.append('<div class="field full"><label for="notes">Notes</label><textarea id="notes" rows="4" placeholder="Anything your team should know"></textarea></div>')
        crumb = f'<a href="{e["slug"]}.html">{esc(e["plural"])}</a> / New'
        c = self.ph(f"New {e['singular'].lower()}", f"Fill in the details below. You can change them later.", "", crumb)
        c += f'<form class="card" data-demo><div class="form">{"".join(fields)}</div><div class="row" style="margin-top:20px;justify-content:flex-end"><a class="btn" href="{e["slug"]}.html">Cancel</a><button class="btn pri" type="submit">Save {esc(e["singular"].lower())}</button></div></form>'
        self.add(f"{e['slug']}-form.html", f"New {e['singular'].lower()}", self.shell(f"{e['slug']}.html", f"New {e['singular']}", c))

    # ---------------- specials ----------------
    def _sp(self, sp, content, actions=""):
        f = f"{slugify(sp['title'])}.html"
        c = self.ph(sp["title"], sp["desc"], actions) + content
        self.add(f, sp["title"], self.shell(f, sp["title"], c))

    def sp_report(self, sp):
        d = self.d
        labels = (MONTHS * 2)[TODAY.month:TODAY.month + 12]
        mets = sp["items"]
        k = "".join(f'<div class="card kpi"><span class="l">{esc(m)}</span><span class="v">{d.fmt_money(d.money(2000, 90000)) if i % 2 == 0 else f"{d.r.uniform(2, 60):.1f}%"}</span><span class="d up">+{d.r.uniform(1, 12):.1f}%</span></div>'
                    for i, m in enumerate(mets[:4]))
        tbl = "".join(f'<tr><td class="t">{esc(n)}</td><td class="num">{d.fmt_money(d.money(500, 40000))}</td><td class="num">{d.r.uniform(-8, 22):+.1f}%</td><td style="width:30%"><div class="bar"><i style="width:{d.r.randint(20, 95)}%"></i></div></td></tr>'
                      for n in sp.get("rows", mets))
        c = f'<div class="g g4">{k}</div><div class="g g2"><div class="card"><h2>{esc(mets[0])} over time</h2>{line_chart([d.series(12, 1000, .1, .03), d.series(12, 800, .1, .02)], labels, names=["This year", "Last year"])}</div>'
        c += f'<div class="card"><h2>{esc(mets[1])} by month</h2>{bar_chart([v for v in d.series(12, 500, .15, .02)], [l[:1] for l in labels])}</div></div>'
        c += f'<div class="card"><h2>Breakdown</h2><div class="tw"><table><thead><tr><th>Name</th><th class="num">Value</th><th class="num">Change</th><th>Share</th></tr></thead><tbody>{tbl}</tbody></table></div></div>'
        self._sp(sp, c, f'<select aria-label="Period"><option>This quarter</option><option>Last quarter</option><option>This year</option></select><a class="btn" href="#">{icon("download")}Download PDF</a>')

    def sp_kanban(self, sp):
        d = self.d
        cols = []
        for k, colname in enumerate(sp["items"]):
            cards = "".join(f'<div class="kc"><b>{esc(d.r.choice(sp["cards"]))}</b><span>{esc(d.company() if sp.get("who") == "company" else d.person())}</span><div class="meta"><span>{d.day(20).strftime("%d %b")}</span><span class="mono">{d.fmt_money(d.money(200, 25000)) if sp.get("money") else f"#{d.r.randint(100, 999)}"}</span></div></div>'
                            for _ in range(d.r.randint(2, 4)))
            cols.append(f'<section class="col"><h3>{esc(colname)}<span style="color:var(--muted)">{d.r.randint(3, 18)}</span></h3>{cards}</section>')
        self._sp(sp, f'<div class="kb">{"".join(cols)}</div>', f'<a class="btn pri" href="#">{icon("plus")}Add card</a>')

    def sp_calendar(self, sp):
        d = self.d
        first = TODAY.replace(day=1)
        start = first - timedelta(days=first.weekday())
        cells = "".join(f'<div class="hd">{x}</div>' for x in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
        for i in range(35):
            day = start + timedelta(days=i)
            evs = ""
            if day.month == TODAY.month and d.r.random() < 0.45:
                for _ in range(d.r.randint(1, 2)):
                    evs += f'<span class="ev {d.r.choice(["", "b", "c"])}">{d.r.randint(8, 17):02d}:00 {esc(d.r.choice(sp["items"]))}</span>'
            cells += f'<div class="{"off" if day.month != TODAY.month else ""}"><span class="n">{day.day}</span>{evs}</div>'
        up = "".join(f'<li><div class="grow"><b>{esc(d.r.choice(sp["items"]))}</b><span>{(TODAY + timedelta(days=k)).strftime("%a %d %b")}, {d.r.randint(8, 17):02d}:00</span></div></li>' for k in range(1, 6))
        c = f'<div class="g g21"><div class="card"><h2>{TODAY.strftime("%B %Y")}<span class="row"><a class="btn" href="#">Today</a></span></h2><div class="cal">{cells}</div></div><div class="card"><h2>Coming up</h2><ul class="list">{up}</ul></div></div>'
        self._sp(sp, c, f'<a class="btn pri" href="#">{icon("plus")}New event</a>')

    def sp_timeline(self, sp):
        d = self.d
        items = "".join(f"<li><b>{esc(x)}</b><span>{esc(d.person())}, {d.day(30).strftime('%d %b %Y')} at {d.r.randint(8, 18):02d}:{d.r.choice(['05', '20', '45'])}</span></li>" for x in sp["items"])
        side = "".join(f'<li><div class="grow"><b>{esc(x)}</b><span>{d.r.randint(2, 40)} this week</span></div></li>' for x in sp.get("side", sp["items"][:4]))
        self._sp(sp, f'<div class="g g21"><div class="card"><h2>Timeline</h2><ul class="tl">{items}</ul></div><div class="card"><h2>Summary</h2><ul class="list">{side}</ul></div></div>')

    def sp_monitor(self, sp):
        d = self.d
        tiles = []
        for name in sp["items"]:
            st = d.r.choices(["Healthy", "Warning", "Critical"], weights=[7, 2, 1])[0]
            col = {"Healthy": "var(--good)", "Warning": "var(--warn)", "Critical": "var(--bad)"}[st]
            ser = d.series(14, 50, .2, 0)
            tiles.append(f'<div class="tile"><span style="color:var(--muted);font-size:12.5px"><i class="led" style="background:{col}"></i>{st}</span><b>{esc(name)}</b><span class="v">{d.r.uniform(10, 99):.1f}{esc(sp.get("unit", "%"))}</span>{spark(ser, st != "Critical")}</div>')
        self._sp(sp, f'<div class="tiles">{"".join(tiles)}</div>', '<span class="pill p-good">Live</span>')

    def sp_document(self, sp):
        d = self.d
        lines = [(n, d.r.randint(1, 8), d.money(40, 1500)) for n in sp["items"]]
        sub = sum(q * p for _, q, p in lines)
        tax = sub * 0.1
        rows = "".join(f'<tr><td>{esc(n)}</td><td class="num">{q}</td><td class="num">{d.fmt_money(p)}</td><td class="num">{d.fmt_money(q * p)}</td></tr>' for n, q, p in lines)
        to = d.company()
        doc = f"""<div class="doc"><div class="top"><div><h2 style="font-size:24px">{esc(sp.get('doc', sp['title']))}</h2><p class="mono" style="color:var(--muted)">{esc(sp.get('num', 'No. 2026-0418'))}</p></div>
<div style="text-align:right"><b style="color:var(--ink)">{esc(self.s['org'])}</b><br><span style="color:var(--muted)">{esc(d.r.choice(CITIES))}</span></div></div>
<div class="top"><div><span style="color:var(--muted);font-size:12.5px">Prepared for</span><br><b style="color:var(--ink)">{esc(to)}</b><br>{esc(d.person())}</div><div style="text-align:right"><span style="color:var(--muted);font-size:12.5px">Date</span><br><b style="color:var(--ink)">{TODAY.strftime('%d %B %Y')}</b></div></div>
<table><thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead><tbody>{rows}</tbody></table>
<div class="tot"><div><span>Subtotal</span><span class="mono">{d.fmt_money(sub)}</span></div><div><span>Tax (10%)</span><span class="mono">{d.fmt_money(tax)}</span></div><div class="big"><span>Total</span><span class="mono">{d.fmt_money(sub + tax)}</span></div></div>
<p style="color:var(--muted);margin-top:28px">{esc(sp.get('note', 'Thank you. Please contact us with any questions about this document.'))}</p></div>"""
        self._sp(sp, doc, f'<a class="btn" href="#" onclick="window.print();return false">Print</a><a class="btn pri" href="#">{icon("download")}Download</a>')

    def sp_map(self, sp):
        d = self.d
        pts = "".join(f'<circle cx="{d.r.randint(60, 740)}" cy="{d.r.randint(50, 300)}" r="{d.r.randint(8, 26)}" style="fill:var(--accent);opacity:.35"/>' for _ in range(sp.get("dots", 14)))
        grid = "".join(f'<path d="M0 {y} H800" style="stroke:var(--line)"/>' for y in range(40, 360, 40)) + "".join(f'<path d="M{x} 0 V360" style="stroke:var(--line)"/>' for x in range(40, 800, 40))
        land = '<path d="M80 120 q60 -60 150 -30 t140 40 q40 60 -20 110 t-160 30 q-90 -20 -110 -150z M430 90 q90 -40 180 0 t110 90 q-10 90 -110 110 t-170 -40 q-40 -80 -10 -160z" style="fill:var(--surface-2);stroke:var(--line)"/>'
        rows = "".join(f'<tr><td class="t">{esc(n)}</td><td class="num">{d.r.randint(40, 2400):,}</td><td style="width:40%"><div class="bar"><i style="width:{d.r.randint(15, 95)}%"></i></div></td></tr>' for n in sp["items"])
        c = f'<div class="g g21"><div class="card"><h2>Map view<small>Circle size shows volume</small></h2><svg class="ch" viewBox="0 0 800 360" role="img" aria-label="Map">{grid}{land}{pts}</svg></div><div class="card"><h2>By area</h2><div class="tw"><table><thead><tr><th>Area</th><th class="num">Count</th><th>Share</th></tr></thead><tbody>{rows}</tbody></table></div></div></div>'
        self._sp(sp, c)

    def sp_split(self, sp):
        d = self.d
        items = ""
        for k, subj in enumerate(sp["items"]):
            p = d.person()
            items += f'<a class="it{" on" if k == 0 else ""}" href="#"><b><span>{esc(p)}</span><span class="mono" style="font-weight:400;color:var(--muted);font-size:12px">{d.r.randint(1, 23)}h</span></b><span>{esc(subj)}</span></a>'
        first = sp["items"][0]
        pv = f'<h2 style="font-size:20px">{esc(first)}</h2><p style="color:var(--muted)">From {esc(d.person())}, today at 09:{d.r.randint(10, 59)}</p><p>{esc(sp.get("body", "Hi team, could you take a look at this when you have a moment? I have added the details below. Thanks for your help."))}</p><div class="field full" style="margin-top:20px"><label for="rp">Reply</label><textarea id="rp" rows="4" placeholder="Write a reply"></textarea></div><div class="row" style="margin-top:12px"><a class="btn pri" href="#">Send reply</a><a class="btn" href="#">Mark as done</a></div>'
        self._sp(sp, f'<div class="card split"><div class="ls">{items}</div><div class="pv">{pv}</div></div>', f'<a class="btn pri" href="#">{icon("plus")}New message</a>')

    def sp_ranking(self, sp):
        d = self.d
        vals = sorted([d.r.uniform(20, 100) for _ in sp["items"]], reverse=True)
        rows = "".join(f'<tr><td class="mono">{k + 1}</td><td class="t">{esc(n)}</td><td class="num">{v * sp.get("scale", 100):,.0f}</td><td style="width:40%"><div class="bar"><i style="width:{v:.0f}%"></i></div></td></tr>'
                       for k, (n, v) in enumerate(zip(sp["items"], vals)))
        c = f'<div class="g g21"><div class="card"><h2>Leaderboard</h2><div class="tw"><table><thead><tr><th>#</th><th>Name</th><th class="num">{esc(sp.get("metric", "Score"))}</th><th>Relative</th></tr></thead><tbody>{rows}</tbody></table></div></div>'
        c += f'<div class="card"><h2>Top 5</h2>{bar_chart([v for v in vals[:5]], [str(i + 1) for i in range(5)], w=360, h=220)}</div></div>'
        self._sp(sp, c)

    def sp_config(self, sp):
        d = self.d
        rows = "".join(f'<div class="sw"><div><b>{esc(n)}</b><span>{esc(sp.get("hint", "Turn this on to apply it to your whole workspace."))}</span></div><button class="tg" role="switch" aria-checked="{str(d.r.random() > .4).lower()}" aria-label="{esc(n)}"></button></div>' for n in sp["items"])
        self._sp(sp, f'<div class="card">{rows}</div>', '<a class="btn pri" href="#">Save changes</a>')

    def sp_gallery(self, sp):
        d = self.d
        tiles = "".join(f'<div class="tile"><div style="aspect-ratio:4/3;border-radius:calc(var(--r) - 4px);background:linear-gradient(135deg,var(--accent-soft),var(--surface-2));display:grid;place-items:center;color:var(--accent);font-weight:700;font-family:var(--f-head);font-size:22px">{initials(n)}</div><b>{esc(n)}</b><span style="color:var(--muted);font-size:12.5px">{d.r.randint(1, 48)} items, updated {d.day(20).strftime("%d %b")}</span></div>' for n in sp["items"])
        self._sp(sp, f'<div class="tiles">{tiles}</div>', f'<a class="btn pri" href="#">{icon("plus")}Upload</a>')

    # ---------------- common pages ----------------
    def p_team(self):
        d = self.d
        roles = self.s.get("roles", ["Admin", "Manager", "Analyst", "Support", "Editor", "Viewer"])
        cards = "".join(f'<div class="card"><span class="av">{initials(p)}</span><b style="color:var(--ink)">{esc(p)}</b><span style="color:var(--muted);font-size:13px">{esc(r)}</span><span class="pill p-{"good" if k % 4 else "warn"}">{"Active" if k % 4 else "Invited"}</span></div>'
                        for k, (p, r) in enumerate([(d.person(), roles[i % len(roles)]) for i in range(8)]))
        c = self.ph("Team", "People who can sign in to this workspace.", f'<a class="btn pri" href="#">{icon("plus")}Invite member</a>') + f'<div class="ppl">{cards}</div>'
        self.add("team.html", "Team", self.shell("team.html", "Team", c))

    def p_notifications(self):
        d = self.d
        items = "".join(f'<li><span class="av">{initials(p)}</span><div class="grow"><b>{esc(t)}</b><span>{esc(p)}, {d.r.randint(1, 23)} hours ago</span></div>{"<span class=\"pill p-info\">New</span>" if k < 3 else ""}</li>'
                        for k, (p, t) in enumerate([(d.person(), x) for x in self.s["activity"] * 2][:10]))
        c = self.ph("Notifications", "Everything that needs your attention.", '<a class="btn" href="#">Mark all as read</a>') + f'<div class="card"><ul class="list">{items}</ul></div>'
        self.add("notifications.html", "Notifications", self.shell("notifications.html", "Notifications", c))

    def p_activity(self):
        d = self.d
        items = "".join(f"<li><b>{esc(x)}</b><span>{esc(d.person())}, {d.day(14).strftime('%d %b')} at {d.r.randint(8, 19):02d}:{d.r.choice(['02', '17', '33', '48'])}</span></li>" for x in (self.s["activity"] * 3)[:14])
        c = self.ph("Activity log", "A record of changes made in this workspace.", f'<a class="btn" href="#">{icon("download")}Export log</a>') + f'<div class="card"><ul class="tl">{items}</ul></div>'
        self.add("activity.html", "Activity log", self.shell("activity.html", "Activity log", c))

    def p_settings(self):
        s = self.s
        tg = lambda n, h, on: f'<div class="sw"><div><b>{esc(n)}</b><span>{esc(h)}</span></div><button class="tg" role="switch" aria-checked="{on}" aria-label="{esc(n)}"></button></div>'
        gen = f'<div class="form"><div class="field"><label for="on">Organization name</label><input id="on" value="{esc(s["org"])}"></div><div class="field"><label for="em">Contact email</label><input id="em" type="email" value="hello@example.com"></div><div class="field"><label for="tz">Time zone</label><select id="tz"><option>UTC</option><option>Europe/London</option><option>America/New_York</option><option>Asia/Dhaka</option></select></div><div class="field"><label for="cu">Currency</label><select id="cu"><option>USD</option><option>EUR</option><option>GBP</option><option>BDT</option></select></div></div>'
        noti = tg("Email summaries", "A short email with the most important numbers every morning.", "true") + tg("Instant alerts", "Get notified straight away when something needs attention.", "true") + tg("Weekly report", "A full report every Monday.", "false")
        sec = tg("Two-step sign in", "Ask for a code from your phone when signing in.", "true") + tg("Sign out idle users", "Sign people out after 30 minutes without activity.", "false") + '<div class="row" style="margin-top:14px"><a class="btn" href="forgot-password.html">Change password</a></div>'
        c = self.ph("Settings", "Manage your workspace, notifications and security.")
        c += f'<form class="card" data-tabs data-demo><div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="true">General</button><button type="button" role="tab" aria-selected="false">Notifications</button><button type="button" role="tab" aria-selected="false">Security</button></div><div data-panel>{gen}</div><div data-panel hidden>{noti}</div><div data-panel hidden>{sec}</div><div class="row" style="margin-top:20px;justify-content:flex-end"><button class="btn pri" type="submit">Save changes</button></div></form>'
        self.add("settings.html", "Settings", self.shell("settings.html", "Settings", c))

    def p_profile(self):
        me = self.s.get("user", "Alex Morgan")
        c = self.ph("Your profile", "How others see you in this workspace.")
        c += f'<form class="card" data-demo><div class="row" style="margin-bottom:20px"><span class="av" style="width:64px;height:64px;font-size:22px">{initials(me)}</span><div><b style="color:var(--ink);font-size:16px">{esc(me)}</b><br><span style="color:var(--muted)">{esc(self.s.get("user_role", "Administrator"))}</span></div></div><div class="form"><div class="field"><label for="fn">Full name</label><input id="fn" value="{esc(me)}"></div><div class="field"><label for="pe">Email</label><input id="pe" type="email" value="alex@example.com"></div><div class="field"><label for="jt">Job title</label><input id="jt" value="{esc(self.s.get("user_role", "Administrator"))}"></div><div class="field"><label for="ph">Phone</label><input id="ph" value="+1 555 0142"></div></div><div class="row" style="margin-top:20px;justify-content:flex-end"><button class="btn pri" type="submit">Save profile</button></div></form>'
        self.add("profile.html", "Your profile", self.shell("profile.html", "Profile", c))

    def p_help(self):
        faqs = self.s.get("faq", []) + [("How do I invite my team?", "Open Team, click Invite member and enter their email. They get a link to set a password."),
                                         ("Can I export my data?", "Yes. Every list has an Export button that downloads a spreadsheet."),
                                         ("How do I switch to dark mode?", "Click the moon button at the top of any page. Your choice is remembered.")]
        items = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in faqs)
        c = self.ph("Help center", "Answers to common questions.") + f'<div class="g g21"><div class="card"><h2>Questions</h2>{items}</div><div class="card"><h2>Still stuck?</h2><p style="color:var(--muted)">Our support team usually replies within a few hours on working days.</p><a class="btn pri" href="#">Contact support</a></div></div>'
        self.add("help.html", "Help center", self.shell("help.html", "Help center", c))

    def p_components(self):
        pills = "".join(f'<span class="pill p-{t}">{n}</span>' for t, n in [("good", "Active"), ("warn", "Pending"), ("bad", "Failed"), ("info", "New"), ("mute", "Draft")])
        c = self.ph("UI components", "The building blocks used across this dashboard.")
        c += f'<div class="g g2"><div class="card"><h2>Buttons</h2><div class="row"><a class="btn pri" href="#">Primary</a><a class="btn" href="#">Secondary</a><a class="btn ghost" href="#">Ghost</a></div></div><div class="card"><h2>Status pills</h2><div class="row">{pills}</div></div>'
        c += f'<div class="card"><h2>Form fields</h2><div class="form"><div class="field"><label for="c1">Text input</label><input id="c1" placeholder="Type here"></div><div class="field"><label for="c2">Select</label><select id="c2"><option>Option one</option><option>Option two</option></select></div></div></div>'
        c += f'<div class="card"><h2>Colors</h2><div class="swatch"><span style="background:var(--accent)"></span><span style="background:var(--c2)"></span><span style="background:var(--c3)"></span><span style="background:var(--c4)"></span><span style="background:var(--surface-2)"></span></div></div>'
        c += f'<div class="card"><h2>Progress</h2><div class="bar"><i style="width:68%"></i></div></div><div class="card"><h2>Toggle</h2><div class="sw"><div><b>Example setting</b><span>Click to switch.</span></div><button class="tg" role="switch" aria-checked="true" aria-label="Example"></button></div></div></div>'
        self.add("ui-components.html", "UI components", self.shell("ui-components.html", "UI components", c))

    def p_auth(self):
        s = self.s
        art = f'<div class="art"><div class="brand" style="color:inherit;padding:0"><span class="mk" style="background:var(--on-accent);color:var(--accent)">{s["brand"][0]}</span>{esc(s["brand"])}</div><div><h2>{esc(s["auth_line"])}</h2><p>{esc(s["tagline"])}</p></div><small style="opacity:.8">Free {esc(s["category"].lower())} dashboard template</small></div>'

        def page(file, title, body):
            h = self.head(title) + f'<div class="auth">{art}<div class="fm"><form class="box" action="index.html">{body}</form></div></div><script src="assets/js/app.js"></script></body></html>'
            self.add(file, title, h)
        page("login.html", "Sign in", '<h1 style="font-size:26px">Welcome back</h1><p style="color:var(--muted);margin:0">Sign in to your account.</p><div class="field"><label for="le">Email</label><input id="le" type="email" placeholder="name@company.com"></div><div class="field"><label for="lp">Password</label><input id="lp" type="password" placeholder="Your password"></div><div class="row" style="justify-content:space-between"><label><input type="checkbox"> Remember me</label><a href="forgot-password.html" style="color:var(--accent)">Forgot password?</a></div><button class="btn pri" type="submit" style="justify-content:center">Sign in</button><p style="color:var(--muted);margin:0">New here? <a href="signup.html" style="color:var(--accent)">Create an account</a></p>')
        page("signup.html", "Create account", '<h1 style="font-size:26px">Create your account</h1><p style="color:var(--muted);margin:0">It takes less than a minute.</p><div class="field"><label for="sn">Full name</label><input id="sn" placeholder="Your name"></div><div class="field"><label for="se">Work email</label><input id="se" type="email" placeholder="name@company.com"></div><div class="field"><label for="sp">Password</label><input id="sp" type="password" placeholder="At least 8 characters"></div><button class="btn pri" type="submit" style="justify-content:center">Create account</button><p style="color:var(--muted);margin:0">Already have an account? <a href="login.html" style="color:var(--accent)">Sign in</a></p>')
        page("forgot-password.html", "Reset password", '<h1 style="font-size:26px">Reset your password</h1><p style="color:var(--muted);margin:0">Enter your email and we will send you a reset link.</p><div class="field"><label for="fe">Email</label><input id="fe" type="email" placeholder="name@company.com"></div><button class="btn pri" type="submit" style="justify-content:center">Send reset link</button><a href="login.html" style="color:var(--accent)">Back to sign in</a>')
        nf = self.head("Page not found") + f'<div class="nf"><div><b>404</b><h1 style="margin:10px 0">Page not found</h1><p style="color:var(--muted)">The page you are looking for does not exist or has moved.</p><a class="btn pri" href="index.html">Back to overview</a></div></div><script src="assets/js/app.js"></script></body></html>'
        self.add("404.html", "Page not found", nf)

    def readme(self, outdir):
        s = self.s
        plist = "\n".join(f"- `{f}`: {t}" for f, t in self.pages)
        txt = f"""# {s['brand']}: free {s['category'].lower()} admin dashboard

{s['tagline']}

Part of [100 Free Admin Dashboards]({REPO}). Free for personal and commercial use under the MIT license.

## What is inside

- {len(self.pages)} HTML pages, one stylesheet and one small script
- Light and dark themes (the moon button switches them, and the choice is remembered)
- Works on phones, tablets and desktops
- Charts are plain SVG, so there are no chart libraries to load
- No build step. Open `index.html` in a browser and it works

## Pages

{plist}

## Make it yours

All colors, fonts and the corner radius are CSS variables at the top of `assets/css/app.css`. Change `--accent` to your brand color and the whole dashboard follows. Replace the demo names and numbers in the HTML with your own data.

## Fonts

{', '.join(dict.fromkeys(s['theme']['fonts']))} from Google Fonts (SIL Open Font License).

All names, companies and numbers in the demo are invented.
"""
        open(os.path.join(outdir, "README.md"), "w").write(txt)
