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
        "AI chatbot analytics", "AI usage and cost", "Mobile app analytics"}


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
    title = f"Free Admin Dashboard Templates: {n} HTML Dashboards"
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
    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(desc)}"><link rel="canonical" href="{SITE}/">
<meta name="robots" content="index, follow, max-image-preview:large"><meta name="theme-color" content="#4f46e5">
<meta property="og:type" content="website"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{SITE}/"><meta property="og:image" content="{SITE}/signal/screenshot.png"><meta name="twitter:card" content="summary_large_image">
<style>{CSS}</style><script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script></head>
<body><header><div class="wrap"><a class="brand" href="{SITE}/">100 Free Admin Dashboards</a><nav><a href="#dashboards">Dashboards</a><a href="#soon">Coming next</a><a href="{REPO}">GitHub</a></nav></div></header>
<main class="wrap"><h1>Free admin dashboard templates</h1>
<p class="lead">Complete admin dashboards you can use for free. Each one has 30 or more pages, light and dark themes, charts, tables, forms and login pages. Open the live demo, then download the folder you like.</p>
<p class="small">{n} of 100 are ready. New ones are added in batches. MIT license, free for business use.</p>
<ul class="grid" id="dashboards">{cards}</ul>
<section id="soon"><h2>Coming next</h2><p>Dashboards planned for the next batches:</p><ul class="soon">{"".join(f"<li>{esc(c)}</li>" for c in coming()[:100 - n])}</ul></section></main>
<footer><div class="wrap">Made by <a href="https://mmseo.app/">MM Rahman Bappi</a>. Free under the MIT license. <a href="{REPO}">Source on GitHub</a></div></footer></body></html>
"""
    open(os.path.join(ROOT, "index.html"), "w").write(page)

    rows = "\n".join(f"| [![{i['brand']}]({i['slug']}/thumb.webp)]({SITE}/{i['slug']}/) | **{i['num']}. {i['brand']}**<br>{i['category']}<br><br>{i['tagline']}<br><br>{i['pages']} pages / [Live demo]({SITE}/{i['slug']}/) / [Code]({i['slug']}/) |" for i in its)
    readme = f"""# 100 Free Admin Dashboards

Free, complete admin dashboard templates in HTML, CSS and JavaScript. Each dashboard has 30 or more pages: an overview with charts, lists, detail pages, forms, a calendar or board, reports, settings, team, login and sign up pages.

**[See all live demos]({SITE}/)**

{n} of 100 are ready. New dashboards are added in batches of ten.

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

## Coming next

{", ".join(coming()[:100 - n])}.

## License

[MIT](LICENSE). Some dashboards include third-party fonts and libraries with their own open licenses, listed in their folders.

Made by [MM Rahman Bappi](https://mmseo.app/).
"""
    open(os.path.join(ROOT, "README.md"), "w").write(readme)
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>{SITE}/</loc><lastmod>{TODAY}</lastmod></url>\n</urlset>\n')
    open(os.path.join(ROOT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
    open(os.path.join(ROOT, ".nojekyll"), "w").write("")
    print("gallery built with", n, "dashboards")


if __name__ == "__main__":
    build()
