"""Builds the gallery index.html, README.md and sitemap for the repository."""
import glob
import html
import json
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
from build import all_specs  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://mmrahmanbappi.github.io/100-free-admin-dashboards"
REPO = "https://github.com/mmrahmanbappi/100-free-admin-dashboards"

def group(i):
    k = i["num"]
    return ("Featured" if k <= 5 else "Finance" if k <= 15 else "Marketing and sales" if k <= 25 else "Operations" if k <= 35 else
            "Tech" if k <= 45 else "Education" if k <= 55 else "Health and hospitality" if k <= 65 else "Travel and media" if k <= 75 else
            "Public and nonprofit" if k <= 85 else "More business")
TODAY = date.today().isoformat()
esc = lambda s: html.escape(str(s), quote=True)

PREMIUM = [
    dict(num=1, slug="lex", brand="Lex", category="Law Firm", tagline="Cases, clients, billing and documents for a law firm, with light and dark themes."),
    dict(num=2, slug="pulse", brand="Pulse", category="SaaS Subscriptions", tagline="Subscribers, plans, revenue and churn for a subscription business."),
    dict(num=3, slug="scrub", brand="Scrub", category="Hospital", tagline="Patients, beds, medications and staff rota for a hospital ward."),
    dict(num=4, slug="shelf", brand="Shelf", category="E-commerce", tagline="Orders, products, inventory and customers for an online store."),
    dict(num=5, slug="signal", brand="Signal", category="Web Analytics", tagline="Traffic, conversions, SEO health and AI referrals for a website."),
]

COMING = ["CRM", "Sales pipeline", "Email marketing", "Social media management", "SEO rank tracker", "Ad campaigns", "Affiliate program",
          "Influencer marketing", "Customer support helpdesk", "Live chat", "Surveys and NPS", "Events and ticketing", "HR and employees",
          "Recruitment", "Project management", "Kanban tasks", "Time tracking", "Inventory and warehouse", "Logistics and fleet",
          "Supply chain", "Manufacturing", "Construction", "Facility management", "Field service", "Server monitoring", "Cloud cost",
          "API analytics", "Cyber security", "IT helpdesk", "CI/CD pipelines", "Database admin", "AI chatbot analytics", "AI usage and cost",
          "Mobile app analytics", "Web hosting panel", "Domains and DNS", "School management", "Online courses", "University admissions",
          "Student portal", "Tutor marketplace", "Library", "Exams and quizzes", "Dental clinic", "Pharmacy", "Gym and fitness",
          "Personal health", "Veterinary clinic", "Therapy practice", "Diagnostic lab", "Nutrition coach", "Hotel", "Restaurant POS",
          "Food delivery", "Travel agency", "Airline operations", "Car rental", "Salon booking", "Coworking space", "Blog CMS",
          "Podcast analytics", "Video creator studio", "Music artist", "Photography studio", "Newsletter", "Digital agency",
          "Nonprofit donations", "Church and community", "City services", "Election results", "Air quality", "Solar and energy",
          "Smart home", "Farm and agriculture", "Sports team", "Esports", "Car dealership", "Parking and EV charging", "Weather station",
          "Habit tracker", "Real estate agency", "Property management", "Loan lending", "Procurement"]


# Categories from COMING that already have a dashboard
DONE = {"CRM", "Sales pipeline", "Email marketing", "Social media management", "SEO rank tracker", "Ad campaigns", "Affiliate program",
        "Influencer marketing", "Customer support helpdesk", "Live chat",
        "HR and employees", "Recruitment", "Project management", "Kanban tasks", "Time tracking", "Inventory and warehouse",
        "Logistics and fleet", "Supply chain", "Manufacturing", "Construction",
        "Server monitoring", "Cloud cost", "API analytics", "Cyber security", "IT helpdesk", "CI/CD pipelines", "Database admin",
        "AI chatbot analytics", "AI usage and cost", "Mobile app analytics",
        "Web hosting panel", "Domains and DNS", "School management", "Online courses", "University admissions", "Student portal",
        "Tutor marketplace", "Library", "Exams and quizzes", "Dental clinic",
        "Pharmacy", "Gym and fitness", "Personal health", "Veterinary clinic", "Therapy practice", "Diagnostic lab",
        "Nutrition coach", "Hotel", "Restaurant POS", "Food delivery",
        "Travel agency", "Airline operations", "Car rental", "Salon booking", "Coworking space", "Blog CMS", "Podcast analytics",
        "Video creator studio", "Music artist", "Photography studio",
        "Newsletter", "Digital agency", "Nonprofit donations", "Church and community", "City services", "Election results",
        "Air quality", "Solar and energy", "Smart home", "Farm and agriculture",
        "Sports team", "Esports", "Car dealership", "Parking and EV charging", "Weather station", "Habit tracker",
        "Real estate agency", "Property management", "Loan lending", "Procurement",
        "Surveys and NPS", "Events and ticketing", "Facility management", "Field service"}


def coming():
    return [c for c in COMING if c not in DONE]


def items():
    out = []
    for p in PREMIUM:
        out.append(dict(p, pages=len(glob.glob(os.path.join(ROOT, p["slug"], "*.html")))))
    for s in all_specs():
        out.append(dict(num=s["num"], slug=s["slug"], brand=s["brand"], category=s["category"], tagline=s["tagline"],
                        pages=len(glob.glob(os.path.join(ROOT, s["slug"], "*.html")))))
    return sorted(out, key=lambda x: x["num"])


CSS = """:root{--bg:#f7f7f8;--card:#fff;--ink:#14151a;--text:#2d2f36;--muted:#646875;--line:#e4e5e9;--acc:#4f46e5}
@media (prefers-color-scheme:dark){:root{--bg:#121318;--card:#1b1d24;--ink:#f3f3f6;--text:#d9dae0;--muted:#9a9dab;--line:#2b2e38;--acc:#8b85ff}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,sans-serif}
a{color:var(--acc)}img{max-width:100%;height:auto;display:block}.wrap{max-width:78rem;margin:0 auto;padding:0 1.25rem}
header{border-bottom:1px solid var(--line)}header .wrap{display:flex;justify-content:space-between;align-items:center;min-height:4rem;gap:1rem;flex-wrap:wrap}
.brand{font-weight:800;color:var(--ink);text-decoration:none}nav{display:flex;gap:1.2rem}nav a{color:var(--text);text-decoration:none}
h1,h2,h3{color:var(--ink);line-height:1.2}h1{font-size:clamp(2.1rem,5vw,3.4rem);margin:2.5rem 0 1rem}h2{font-size:1.7rem;margin:0 0 1rem}
.lead{font-size:1.2rem;max-width:44rem}.small{color:var(--muted);font-size:.95rem}
.grid{list-style:none;padding:0;margin:2rem 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(20rem,1fr));gap:1.4rem}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;height:100%}
.card img{aspect-ratio:16/10;object-fit:cover;border-bottom:1px solid var(--line)}.card .in{padding:1rem 1.1rem;display:flex;flex-direction:column;gap:.3rem;flex:1}
.card .cat{font-size:.85rem;font-weight:600;color:var(--acc)}.card h3{margin:0;font-size:1.15rem}.card p{margin:0 0 .6rem;color:var(--muted);font-size:.96rem;flex:1}
.card .row{display:flex;gap:.5rem}.card .row a{flex:1;text-align:center;padding:.55rem;border-radius:8px;font-weight:700;font-size:.93rem;text-decoration:none;border:1.5px solid var(--line);color:var(--ink)}
.card .row a.p{background:var(--ink);color:var(--bg);border-color:var(--ink)}
section{padding:2.5rem 0;border-top:1px solid var(--line)}ul.soon{columns:3 14rem;color:var(--muted)}
footer{border-top:1px solid var(--line);padding:2rem 0;color:var(--muted);font-size:.95rem}"""


def build():
    its = items()
    n = len(its)
    title = f"{n} Free Admin Dashboard Templates in HTML" if n >= 100 else f"Free Admin Dashboard Templates: {n} HTML Dashboards"
    desc = f"{n} free multi-page admin dashboard templates in HTML, CSS and JavaScript. Light and dark themes, live demos, no build step, MIT license."
    cards = "".join(
        f'<li class="card"><a href="{SITE}/{i["slug"]}/"><img src="{SITE}/{i["slug"]}/thumb.webp" alt="{esc(i["brand"])} {esc(i["category"].lower())} dashboard template preview" width="720" height="450" loading="lazy"></a>'
        f'<div class="in"><span class="cat">{esc(i["category"])}</span><h3>{esc(i["brand"])}</h3><p>{esc(i["tagline"])} {i["pages"]} pages.</p>'
        f'<div class="row"><a class="p" href="{SITE}/{i["slug"]}/">Live demo</a><a href="{REPO}/tree/main/{i["slug"]}">Get the code</a></div></div></li>'
        for i in its)
    schema = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "100 Free Admin Dashboards", "inLanguage": "en"},
        {"@type": "Person", "@id": SITE + "/#author", "name": "MM Rahman Bappi", "url": "https://mmseo.app/", "sameAs": ["https://github.com/mmrahmanbappi"]},
        {"@type": "CollectionPage", "@id": SITE + "/#webpage", "url": SITE + "/", "name": title, "description": desc, "isPartOf": {"@id": SITE + "/#website"},
         "author": {"@id": SITE + "/#author"}, "dateModified": TODAY, "mainEntity": {"@id": SITE + "/#list"}},
        {"@type": "ItemList", "@id": SITE + "/#list", "numberOfItems": n, "itemListElement": [
            {"@type": "ListItem", "position": k + 1, "item": {"@type": "CreativeWork", "name": f"{i['brand']} {i['category']} dashboard template",
             "url": f"{SITE}/{i['slug']}/", "image": f"{SITE}/{i['slug']}/screenshot.png", "description": i["tagline"],
             "license": "https://opensource.org/licenses/MIT", "isAccessibleForFree": True, "author": {"@id": SITE + "/#author"}}}
            for k, i in enumerate(its)]}]}
    soon = coming()[:100 - n] if n < 100 else []
    soon_html = (f'<section id="soon"><h2>Coming next</h2><p>Dashboards planned for the next batches:</p><ul class="soon">'
                 + "".join(f"<li>{esc(c)}</li>" for c in soon) + "</ul></section>") if soon else ""
    soon_nav = '<a href="#soon">Coming next</a>' if soon else ""
    import mmtheme as T
    groups = []
    for i in its:
        if group(i) not in groups: groups.append(group(i))
    FAQ = [("Are these dashboards free for business use?", "Yes. Every dashboard uses the MIT license, so you can use it in personal, client and commercial projects."),
           ("Do they need a framework or a build step?", "No. Each dashboard is plain HTML, CSS and JavaScript. Open a page in a browser and it works."),
           ("How many pages does each dashboard have?", "Most have 34 pages: an overview, lists, details, forms, a calendar, reports, settings, login and more."),
           ("Do they connect to real data?", "No. They use sample data so you can see every page. Replace the sample data with your own API when you build your app.")]
    schema["@graph"].append(T.faq_schema(SITE, FAQ))
    picks = [x for x in its if x["slug"] in ("signal", "matchday", "stratus", "respawn", "lendly", "sunfield")][:6]
    picks += [x for x in its if x not in picks][:6 - len(picks)]
    cycle = [f'{i["brand"]}: {i["category"]}' for i in its[5:40:5]]
    pages = sum(i["pages"] for i in its)
    cards = "".join(T.card(f'{SITE}/templates/{i["slug"]}/', f'{SITE}/{i["slug"]}/thumb.webp', f'{i["brand"]} {i["category"].lower()} dashboard template preview',
                           i["category"], f'{i["pages"]} pages', i["brand"], i["tagline"],
                           [("Live demo", f'{SITE}/{i["slug"]}/'), ("Get the code", f'{REPO}/tree/main/{i["slug"]}')], group(i)) for i in its)
    nav = [("Dashboards", "#dashboards"), ("How to use", "#how"), ("FAQ", "#faq")]
    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(desc)}"><link rel="canonical" href="{SITE}/">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{SITE}/"><meta property="og:site_name" content="100 Free Admin Dashboards"><meta property="og:image" content="{SITE}/og.jpg"><meta property="og:image:alt" content="{esc(title)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><link rel="image_src" href="{SITE}/signal/screenshot.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(desc)}"><meta name="twitter:image" content="{SITE}/og.jpg">
{T.FONTS}{T.favicon("AD")}{T.GA}<style>{T.CSS}</style><script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script></head>
<body>{T.header(SITE, "AD", "100 Free Admin Dashboards", nav, REPO)}
<main id="main">
{T.hero("Admin dashboard templates", "Admin dashboards ready to use", "Complete dashboards for real businesses, each with 30 or more pages: charts, tables, forms, calendars, settings and login. Light and dark themes included.",
        ("Browse dashboards", "#dashboards"), REPO, [f'{SITE}/{x["slug"]}/thumb.webp' for x in picks], "AD", "Dashboards in the set", cycle,
        "Free dashboards<br>with live demos", str(n), f"{pages:,} pages in total", "Pick. Download. Launch.",
        ("All 100 dashboards are ready." if n >= 100 else f"{n} of 100 are ready.") + " MIT license, free for business use.")}
{T.facts([(str(n), "dashboards"), (f"{pages:,}", "pages"), ("2", "themes each, light and dark"), ("MIT", "license")])}
<section class="band alt" id="dashboards"><div class="wrap"><div class="sh"><div><p class="eyebrow">Dashboards</p><h2>Find a dashboard for your business</h2>
<p>Open the live demo to click through every page, then download the folder you like.</p></div></div>
<div style="margin-bottom:1.6rem">{T.chips(groups, "Filter by industry")}</div>
<ul class="mtcards">{cards}</ul>{soon_html}</div></section>
<section class="band" id="how"><div class="wrap"><div class="sh"><div><p class="eyebrow">How to use</p><h2>Three steps, no setup</h2></div></div>
<ol class="steps"><li><h3>Pick</h3><p>Open a live demo and click through the pages to find the one that fits your product.</p></li>
<li><h3>Download</h3><p>Download the dashboard folder from GitHub. Every page, style and script is inside.</p></li>
<li><h3>Launch</h3><p>Change the name, colors and sample data, then connect your API and publish.</p></li></ol></div></section>
{T.faq(FAQ)}
</main>
{T.footer(REPO)}
{T.script(cycle)}
</body></html>
"""
    open(os.path.join(ROOT, "index.html"), "w").write(page)

    rows = "\n".join(f"| [![{i['brand']}]({i['slug']}/thumb.webp)]({SITE}/{i['slug']}/) | **{i['num']}. {i['brand']}**<br>{i['category']}<br><br>{i['tagline']}<br><br>{i['pages']} pages / [Live demo]({SITE}/{i['slug']}/) / [Code]({i['slug']}/) |" for i in its)
    readme = f"""# 100 Free Admin Dashboards

Free, complete admin dashboard templates in HTML, CSS and JavaScript. Each dashboard has 30 or more pages: an overview with charts, lists, detail pages, forms, a calendar or board, reports, settings, team, login and sign up pages.

**[See all live demos]({SITE}/)**

{"All 100 dashboards are ready." if n >= 100 else f"{n} of 100 are ready. New dashboards are added in batches of ten."}

## Why use these dashboards

- **Complete.** Every dashboard is a full set of pages, not a single screen.
- **Light and dark themes.** A button at the top switches them, and the choice is remembered.
- **No build step.** Open `index.html` in a browser. There is nothing to install.
- **Works on phones.** The sidebar turns into a menu on small screens.
- **Easy to rebrand.** Change one color in the CSS and the whole dashboard follows.
- **Free for business use.** MIT license.

## How to use one

1. Open the [live demos]({SITE}/) and pick a dashboard.
2. Download the repository, or copy just the folder you want.
3. Open `index.html` in your browser, then replace the demo data with your own.

## Dashboards

| Preview | Dashboard |
|---|---|
{rows}

{("## Coming next" + chr(10) + chr(10) + ", ".join(coming()[:100 - n]) + "." + chr(10) + chr(10)) if n < 100 else ""}## License

[MIT](LICENSE). Some dashboards include third-party fonts and libraries with their own open licenses, listed in their folders.

Made by [MM Rahman Bappi](https://mmseo.app/).
"""
    open(os.path.join(ROOT, "README.md"), "w").write(readme)
    sm_urls = [(SITE + "/", "og.jpg")] + [(f"{SITE}/templates/{i['slug']}/", f"{SITE}/{i['slug']}/screenshot.png") for i in its]
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
        + "".join(f"  <url>\n    <loc>{u}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <image:image><image:loc>{img if img.startswith('http') else SITE + '/' + img}</image:loc></image:image>\n  </url>\n" for u, img in sm_urls)
        + "</urlset>\n")
    open(os.path.join(ROOT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
    open(os.path.join(ROOT, ".nojekyll"), "w").write("")
    print("gallery built with", n, "dashboards")


if __name__ == "__main__":
    build()
