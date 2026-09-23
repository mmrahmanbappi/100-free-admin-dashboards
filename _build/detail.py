"""Builds one SEO landing page per dashboard at /templates/{slug}/index.html.
The live 34-page demo at /{slug}/ stays noindex (it is an app, not an article);
this page is the one Google indexes, with unique content per dashboard.
Run after site.py: python3 _build/detail.py
"""
import glob
import html
import json
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
import mmtheme as T  # noqa: E402
from build import all_specs  # noqa: E402
import importlib.util
_spec = importlib.util.spec_from_file_location("sitegen", os.path.join(os.path.dirname(__file__), "site.py"))
sitegen = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(sitegen)
PREMIUM, REPO, SITE, group, items = sitegen.PREMIUM, sitegen.REPO, sitegen.SITE, sitegen.group, sitegen.items


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = date.today().isoformat()
esc = lambda s: html.escape(str(s), quote=True)

# Hand-curated content for the 5 premium dashboards (no spec dict exists for these).
PREMIUM_INFO = {
    "lex": dict(manage=["Cases", "Clients", "Calendar", "Time tracking", "Invoices and payments", "Documents and templates", "Attorneys and staff"],
                kpis=["Active cases", "Billable hours", "Revenue billed", "Overdue invoices"], org="Hartwell and Mercer LLP"),
    "pulse": dict(manage=["Revenue analytics", "MRR and churn", "Subscribers and trials", "Plans and coupons", "Billing and invoices", "API keys and webhooks"],
                  kpis=["Monthly recurring revenue", "Active subscribers", "Churn rate", "Revenue by plan"], org="NovaBuild Inc."),
    "scrub": dict(manage=["Patients and beds", "Admissions and discharges", "Appointments and telehealth", "Vitals and medications", "Lab results and imaging", "Staff rota", "Billing and claims"],
                  kpis=["Ward occupancy", "Patients today", "Medication round", "Staff on shift"], org="Meridian, Ward 4"),
    "shelf": dict(manage=["Orders and returns", "Products and inventory", "Customers and segments", "Discounts and gift cards", "Sales analytics", "Shipping and payouts"],
                  kpis=["Revenue today", "Orders today", "Best sellers", "Order status"], org="Northbay Supply Co."),
    "signal": dict(manage=["Real-time visitors", "Traffic channels", "Conversions and funnels", "SEO and indexing", "AI referral tracking", "Web vitals"],
                   kpis=["Live visitors", "Sessions", "Conversion funnel", "Top countries"], org="larkfield.io"),
}

FAQ = [
    ("Is this dashboard free to use?", "Yes. It uses the MIT license, so you can use it in personal, client and commercial projects at no cost."),
    ("Does it need a framework or build step?", "No. It is plain HTML, CSS and JavaScript. Open a page in a browser, or upload the folder to any host."),
    ("Can I connect it to my own data?", "The pages use realistic sample data so you can see every screen. Replace it with your own API or database when you build your app."),
    ("Can I change the colors and text?", "Yes. Colors are CSS variables at the top of each stylesheet, and all text is plain HTML you can edit directly."),
]


def build_row(items, kind):
    """items: list of (name, desc) for entities/specials, or list of plain names."""
    out = []
    for it in items:
        name, desc = it if isinstance(it, tuple) else (it, "")
        out.append(f'<li><b>{esc(name)}</b>{f"<span>{esc(desc)}</span>" if desc else ""}</li>')
    return "".join(out)


def page_breakdown(n, n_entities, n_specials, premium):
    rows = [("Overview", 1, "A live dashboard home with charts and key numbers.")]
    if premium:
        other = max(0, n - 1 - 7 - 4)
        rows.append((f"{n_entities} main sections", other, "Every area listed above, each with its own working pages."))
    else:
        if n_entities: rows.append((f"{n_entities} record types", n_entities * 3, "A list, a detail page and a form for each one."))
        if n_specials: rows.append(("Special tools", n_specials, "A calendar, kanban board, report or similar view for each."))
    rows.append(("Workspace", 7, "Team, notifications, activity log, settings, profile, help and a UI kit."))
    rows.append(("Sign in", 4, "Login, sign up, forgot password and a 404 page."))
    return rows


def build_one(info):
    slug, brand, category, tagline = info["slug"], info["brand"], info["category"], info["tagline"]
    n = info["pages"]
    url = f"{SITE}/templates/{slug}/"
    demo = f"{SITE}/{slug}/"
    shot = f"{SITE}/{slug}/screenshot.png"
    thumb = f"{SITE}/{slug}/thumb.webp"

    manage_html = kpi_labels = specials_items = org = None
    if slug in PREMIUM_INFO:
        p = PREMIUM_INFO[slug]
        manage_html = build_row(p["manage"], "manage")
        kpi_labels = p["kpis"]
        n_entities = len(p["manage"])
        n_specials = 0
        org = p["org"]
    else:
        spec = next(s for s in all_specs() if s["slug"] == slug)
        manage_html = build_row([(e["plural"], e["desc"]) for e in spec["entities"]], "manage")
        specials_items = build_row([(sp["title"], sp["desc"]) for sp in spec["specials"]], "tools")
        kpi_labels = [k[0] for k in spec["kpis"]]
        n_entities = len(spec["entities"])
        n_specials = len(spec["specials"])
        org = spec["org"]

    breakdown = page_breakdown(n, n_entities, n_specials, slug in PREMIUM_INFO)
    breakdown_html = "".join(f'<li><b>{esc(nm)}</b><span>{cnt} page{"s" if cnt != 1 else ""}</span><p>{esc(d)}</p></li>' for nm, cnt, d in breakdown)

    title = f"{brand}: Free {category} Dashboard Template"
    if len(title) > 60:
        title = f"Free {category} Dashboard Template ({brand})"
    if len(title) > 60:
        title = f"Free {category} Dashboard Template"
    desc = f"{tagline} Free HTML dashboard template with {n} pages, light and dark themes, no framework."
    if len(desc) > 160:
        desc = f"{tagline} Free HTML template, {n} pages, light and dark themes."
    if len(desc) > 160:
        desc = desc[:157].rsplit(" ", 1)[0] + "..."

    same_group = [x for x in ITEMS if group(x) == group(info) and x["slug"] != slug][:4]
    related_html = "".join(T.card(f"{SITE}/templates/{x['slug']}/", f"{SITE}/{x['slug']}/thumb.webp",
                                   f"{x['brand']} {x['category'].lower()} dashboard preview", x["category"], f'{x["pages"]} pages',
                                   x["brand"], x["tagline"], [("View template", f"{SITE}/templates/{x['slug']}/")]) for x in same_group)

    schema = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "100 Free Admin Dashboards", "inLanguage": "en"},
        {"@type": "Person", "@id": SITE + "/#author", "name": "MM Rahman Bappi", "url": "https://mmrahmanbappi.github.io/", "sameAs": ["https://github.com/mmrahmanbappi"]},
        {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": title, "description": desc, "isPartOf": {"@id": SITE + "/#website"},
         "primaryImageOfPage": shot, "inLanguage": "en", "dateModified": TODAY, "breadcrumb": {"@id": url + "#breadcrumb"}},
        {"@type": "SoftwareSourceCode", "@id": url + "#code", "name": f"{brand} {category} dashboard template", "description": desc, "url": url,
         "codeRepository": f"{REPO}/tree/main/{slug}", "programmingLanguage": ["HTML", "CSS", "JavaScript"],
         "license": "https://opensource.org/licenses/MIT", "isAccessibleForFree": True, "image": shot, "author": {"@id": SITE + "/#author"}, "dateModified": TODAY},
        {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "All dashboards", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": category, "item": SITE + "/#dashboards"},
            {"@type": "ListItem", "position": 3, "name": brand, "item": url}]},
        T.faq_schema(url, FAQ)]}

    body = f"""<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb" style="font-size:.9rem;color:var(--muted);padding-top:1.4rem"><a href="{SITE}/" style="color:var(--muted)">All dashboards</a> / <a href="{SITE}/#dashboards" style="color:var(--muted)">{esc(category)}</a> / <span aria-current="page">{esc(brand)}</span></nav></div>
<section class="hero"><div class="wrap hgrid" style="min-height:auto">
<div><span class="badge"><b>Free</b>{esc(category)} dashboard</span>
<h1>{esc(brand)}: {esc(category)} dashboard template</h1>
<p class="lead">{esc(tagline)}</p>
<div class="actions"><a class="btn main" href="{demo}">Open live demo{T.ARROW}</a><a class="btn" href="{REPO}/tree/main/{slug}">Download the code</a></div>
<p class="small">{n} pages. Light and dark themes. MIT license, free for business use.</p></div>
<div class="stack" aria-hidden="true"><figure style="width:100%;position:static;animation:none;transform:none"><img src="{shot}" alt="{esc(brand)} {esc(category.lower())} dashboard overview page" width="1440" height="900" loading="eager"></figure></div>
</div></section>
<div class="facts"><div class="wrap"><ul><li><b>{n}</b><span>pages included</span></li><li><b>{n_entities or len(manage_html.split('<li>')) - 1}</b><span>things you can manage</span></li><li><b>2</b><span>themes, light and dark</span></li><li><b>MIT</b><span>license</span></li></ul></div></div>
<section class="band alt"><div class="wrap two">
<div><h2>What you can manage</h2><ul class="ticks" style="list-style:none;padding:0">{manage_html.replace('<li>','<li style="margin:0 0 10px"><b style="color:var(--ink)">').replace('</b>','</b>').replace('<span>',' &ndash; <span style="color:var(--muted);font-weight:400">').replace('</span></li>','</span></li>')}</ul></div>
<div><h2>At a glance on the overview page</h2><ul class="ticks">{"".join(f"<li>{esc(k)}</li>" for k in kpi_labels)}</ul>
{f'<h2 style="margin-top:1.6rem">Extra tools</h2><ul class="ticks" style="list-style:none;padding:0">{specials_items.replace("<li>", chr(60)+"li style=" + chr(34) + "margin:0 0 10px" + chr(34) + chr(62) + "<b style=" + chr(34) + "color:var(--ink)" + chr(34) + chr(62)).replace("<span>", " &ndash; <span style=" + chr(34) + "color:var(--muted);font-weight:400" + chr(34) + chr(62))}</ul>' if specials_items else ""}
</div></div></section>
<section class="band"><div class="wrap"><h2>What is inside the {n} pages</h2>
<ul class="ticks" style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:1rem">{breakdown_html.replace('<li>', '<li style="border:1px solid var(--line);border-radius:12px;padding:1rem 1.1rem;background:var(--card)"><div style="display:flex;justify-content:space-between;gap:.5rem"><b style="color:var(--ink)">').replace('<span>', '</b><span style="color:var(--muted);font-size:.85rem">').replace('</span><p>', '</span></div><p style="margin:.5rem 0 0;font-size:.9rem;color:var(--muted)">')}</ul>
<p class="small" style="margin-top:1.2rem">Example organization used in the demo: {esc(org)}.</p>
</div></section>
{f'<section class="band alt"><div class="wrap"><h2>More {esc(group(info).lower())} dashboards</h2><ul class="mtcards">{related_html}</ul></div></section>' if related_html else ""}
{T.faq(FAQ, title="Questions about this template")}
"""
    schema_str = json.dumps(schema, ensure_ascii=False)
    page_html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(desc)}"><link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:site_name" content="100 Free Admin Dashboards">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/templates/{slug}/og.jpg"><meta property="og:image:alt" content="{esc(title)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><link rel="image_src" href="{shot}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(desc)}"><meta name="twitter:image" content="{SITE}/templates/{slug}/og.jpg">
{T.FONTS}{T.favicon("AD")}{T.GA}<style>{T.CSS}</style><script type="application/ld+json">{schema_str}</script></head>
<body>{T.header(SITE, "AD", "100 Free Admin Dashboards", [("Dashboards", f"{SITE}/#dashboards"), ("How to use", f"{SITE}/#how"), ("FAQ", f"{SITE}/#faq")], REPO)}
<main id="main">
{body}
</main>
{T.footer(REPO)}
</body></html>
"""
    outdir = os.path.join(ROOT, "templates", slug)
    os.makedirs(outdir, exist_ok=True)
    open(os.path.join(outdir, "index.html"), "w").write(page_html)


if __name__ == "__main__":
    ITEMS = items()
    globals()["ITEMS"] = ITEMS
    for i in ITEMS:
        build_one(i)
    print(f"built {len(ITEMS)} landing pages in /templates/")
