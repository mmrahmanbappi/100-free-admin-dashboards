"""Shared site theme for MM Rahman Bappi's free projects.
Same look as https://mmrahmanbappi.github.io/ : warm grey background, Inter, one orange accent.
Copy this file into a repository's _build folder and use the helpers below."""
import html
import json

HOME = "https://mmrahmanbappi.github.io/"
e = lambda s: html.escape(str(s), quote=True)

CSS = """
:root{--bg:#eeeeea;--surface:#f6f6f2;--card:#fff;--ink:#171518;--text:#403b42;--muted:#5f5d61;--line:#d9d8d2;--acc:#b23a0a;--acc-ink:#fff;--acc-soft:#f6e3d9;
 --r:18px;--shadow:0 1px 2px rgba(23,21,24,.06),0 18px 40px -22px rgba(23,21,24,.28);color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#141316;--surface:#1b1a1e;--card:#222126;--ink:#f2f1ed;--text:#d7d5d9;--muted:#a3a1a6;--line:#302f35;--acc:#ff7b4f;--acc-ink:#141316;--acc-soft:#3a2219;
 --shadow:0 1px 2px rgba(0,0,0,.4),0 18px 40px -22px rgba(0,0,0,.7);color-scheme:dark}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:1.02rem/1.6 "Inter",system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--ink);text-underline-offset:3px}img{max-width:100%;height:auto;display:block}
:focus-visible{outline:3px solid var(--acc);outline-offset:3px;border-radius:6px}
.skip{position:absolute;left:-9999px}.skip:focus{left:1rem;top:1rem;background:var(--ink);color:var(--bg);padding:.5rem 1rem;z-index:9;border-radius:8px}
.wrap{max-width:78rem;margin:0 auto;padding-left:1.5rem;padding-right:1.5rem}.narrow{max-width:52rem}
h1,h2,h3{color:var(--ink);line-height:1.05;letter-spacing:-.035em;font-weight:600;margin:0}
h1{font-size:clamp(2.4rem,4.6vw,4rem);font-weight:560;margin:.8rem 0 1rem}h2{font-size:clamp(1.8rem,3.4vw,2.7rem);margin:0 0 1rem}h3{font-size:1.12rem;letter-spacing:-.02em;margin:0 0 .3rem}
p{margin:0 0 1.1rem}.lead{font-size:1.12rem;max-width:40rem}.small{font-size:.92rem;color:var(--muted)}
header.mt{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
header.mt .wrap{display:flex;justify-content:space-between;align-items:center;gap:1rem;min-height:4.4rem}
.brand{display:flex;align-items:center;gap:.6rem;font-weight:700;color:var(--ink);text-decoration:none;letter-spacing:-.01em}
.brand i{width:2.1rem;height:2.1rem;border-radius:50%;background:var(--ink);color:var(--bg);display:grid;place-items:center;font-style:normal;font-size:.72rem;font-weight:800;flex:none}
header.mt nav{display:flex;gap:1.6rem;align-items:center;font-size:.95rem}header.mt nav a{color:var(--text);text-decoration:none}header.mt nav a:hover{color:var(--ink)}
header.mt nav a.gh{border:1.5px solid var(--ink);border-radius:999px;padding:.4rem 1rem;color:var(--ink);font-weight:600}
.btn{display:inline-flex;align-items:center;gap:.6rem;padding:.7rem 1.2rem;border-radius:999px;text-decoration:none;border:1.5px solid var(--ink);color:var(--ink);background:none;cursor:pointer;font:inherit;font-size:.96rem;font-weight:600}
.btn.main{background:var(--ink);color:var(--bg)}.btn:hover{opacity:.9}
.btn .arr{width:2rem;height:2rem;border-radius:50%;background:var(--acc);color:var(--acc-ink);display:grid;place-items:center;margin:-.35rem -.8rem -.35rem 0}
.actions{display:flex;gap:.7rem;flex-wrap:wrap;align-items:center;margin:1.2rem 0 .6rem}
.badge{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:.25rem .7rem .25rem .3rem}
.badge b{background:var(--acc);color:var(--acc-ink);border-radius:999px;padding:.1rem .5rem}
.eyebrow{font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--acc);margin:0 0 .6rem}
.hero{padding:2.5rem 0 3rem}
.hgrid{display:grid;grid-template-columns:1.05fr 1.2fr .95fr;gap:1.5rem;align-items:center;min-height:30rem}
.stack{position:relative;height:28rem;-webkit-mask-image:linear-gradient(#000 70%,transparent);mask-image:linear-gradient(#000 70%,transparent)}
.stack figure{position:absolute;margin:0;width:62%;aspect-ratio:16/10;border-radius:14px;overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--line);background:var(--card);animation:mtfloat 7s ease-in-out infinite}
.stack figure img{width:100%;height:100%;object-fit:cover}
.stack figure:nth-child(1){left:2%;top:4%;transform:rotate(-7deg);animation-delay:-1s}.stack figure:nth-child(2){right:0;top:0;transform:rotate(5deg);animation-delay:-3s}
.stack figure:nth-child(3){left:18%;top:26%;transform:rotate(-1deg);z-index:3;width:70%;animation-delay:-2s}.stack figure:nth-child(4){left:0;top:52%;transform:rotate(4deg);animation-delay:-4s}
.stack figure:nth-child(5){right:2%;top:48%;transform:rotate(-5deg);animation-delay:-5s}.stack figure:nth-child(6){left:24%;top:70%;transform:rotate(2deg);animation-delay:-6s}
@keyframes mtfloat{50%{translate:0 -8px}}
.side{display:flex;flex-direction:column;gap:1.1rem}
.cycle,.stat{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:1rem 1.1rem}.cycle{box-shadow:var(--shadow)}
.cycle .hd{display:flex;align-items:center;gap:.7rem}.cycle .hd i{width:2.3rem;height:2.3rem;border-radius:10px;background:var(--ink);color:var(--bg);display:grid;place-items:center;font-style:normal;font-weight:800;font-size:.7rem;flex:none}
.cycle small{display:block;color:var(--muted);font-size:.78rem}.cycle strong{color:var(--ink);font-size:.95rem;display:block;min-height:1.5em;transition:opacity .35s}
.cycle ul{list-style:none;margin:.8rem 0 0;padding:0 0 0 3rem;font-size:.9rem;display:flex;flex-direction:column;gap:.45rem}
.cycle li:nth-child(1){opacity:.9}.cycle li:nth-child(2){opacity:.65}.cycle li:nth-child(3){opacity:.4}.cycle li:nth-child(4){opacity:.18}
.stat{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}.stat small{color:var(--muted);font-size:.85rem}
.stat b{display:block;font-size:2rem;color:var(--ink);letter-spacing:-.03em;line-height:1;text-align:right}.stat em{font-style:normal;font-size:.78rem;color:var(--acc);font-weight:600;display:block;text-align:right;margin-top:.35rem}
.big{font-size:clamp(2rem,3.4vw,2.8rem);line-height:1.02;color:var(--ink);font-weight:560;letter-spacing:-.035em;margin:0}
.facts{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.facts ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr)}
.facts li{padding:1.4rem 1rem;text-align:center;border-left:1px solid var(--line)}.facts li:first-child{border-left:0}
.facts b{display:block;font-size:1.6rem;color:var(--ink);letter-spacing:-.02em}.facts span{font-size:.9rem;color:var(--muted)}
section.band{padding:4.5rem 0}section.band.alt{background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.sh{display:flex;justify-content:space-between;align-items:flex-end;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.8rem}.sh p{margin:.4rem 0 0;max-width:36rem}
.chips{display:flex;flex-wrap:wrap;gap:.5rem}
.chips button,.chips a{font:inherit;font-size:.9rem;padding:.4rem 1rem;border-radius:999px;border:1.5px solid var(--line);background:var(--surface);color:var(--text);cursor:pointer;text-decoration:none}
.chips button[aria-pressed=true],.chips a[aria-current=page]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.mtcards{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(17.5rem,1fr));gap:1.3rem}
.mtcard{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s,box-shadow .2s}
.mtcard:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
.mtcard .im{display:block;aspect-ratio:16/10;overflow:hidden;border-bottom:1px solid var(--line);background:var(--surface)}
.mtcard .im img{width:100%;height:100%;object-fit:cover;transition:transform .4s}.mtcard:hover .im img{transform:scale(1.03)}
.mtcard .in{padding:1.05rem 1.2rem 1.2rem;display:flex;flex-direction:column;gap:.4rem;flex:1}
.mtcard .meta{display:flex;justify-content:space-between;gap:.5rem;font-size:.78rem;color:var(--muted)}
.mtcard .meta span:first-child{color:var(--acc);font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.mtcard h3 a{text-decoration:none;color:var(--ink)}.mtcard h3 a:hover{color:var(--acc)}
.mtcard p{margin:0;font-size:.94rem;flex:1}
.mtcard .links{display:flex;gap:1.1rem;margin-top:.4rem;font-size:.92rem;font-weight:600}
.mtcard .links a{text-decoration:none;color:var(--ink);border-bottom:1.5px solid var(--acc)}
.split{display:grid;grid-template-columns:1fr 1.2fr;gap:3rem;align-items:start}
ul.ticks{padding-left:1.2rem;margin:0}ul.ticks li{margin:.4rem 0}
.steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:1.3rem;counter-reset:s}
.steps li{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:1.5rem;counter-increment:s}
.steps li::before{content:"0" counter(s);display:block;font-size:.85rem;font-weight:700;color:var(--acc);margin-bottom:1rem}
.steps h3{font-size:1.25rem;margin-bottom:.4rem}.steps p{margin:0}
details.q{border-top:1px solid var(--line);padding:1.1rem 0}details.q:last-child{border-bottom:1px solid var(--line)}
details.q summary{cursor:pointer;font-weight:650;color:var(--ink);list-style:none;display:flex;justify-content:space-between;gap:1rem}
details.q summary::-webkit-details-marker{display:none}details.q summary::after{content:"+";font-size:1.4rem;line-height:1;color:var(--acc)}details.q[open] summary::after{content:"-"}
details.q p{margin:.7rem 0 0}
footer.mt{border-top:1px solid var(--line);padding:2rem 0;color:var(--muted);font-size:.92rem}footer.mt .wrap{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}footer.mt p{margin:0}footer.mt a{color:var(--ink)}
@media (max-width:1060px){.hgrid{grid-template-columns:1fr 1fr}.hgrid .side{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;align-items:start}.hgrid .big{grid-column:1/-1}}
@media (max-width:860px){.split,.steps{grid-template-columns:1fr}header.mt nav a:not(.gh){display:none}}
@media (max-width:760px){.hgrid{grid-template-columns:1fr;min-height:0}.stack{height:18rem;order:2}.hgrid .side{grid-template-columns:1fr;order:3}
 .facts ul{grid-template-columns:repeat(2,1fr)}.facts li:nth-child(3){border-left:0}.facts li:nth-child(n+3){border-top:1px solid var(--line)}section.band{padding:3.2rem 0}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}html{scroll-behavior:auto}}
"""

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">'
         '<meta name="theme-color" content="#eeeeea" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#141316" media="(prefers-color-scheme: dark)">')

ARROW = ('<span class="arr" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" '
         'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>')


GA = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-D8QGLFQD12"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-D8QGLFQD12');
</script>"""


def favicon(mark):
    return ("<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23171518'/%3E"
            f"%3Ctext x='32' y='41' font-family='Arial' font-weight='800' font-size='{24 if len(mark) <= 2 else 18}' fill='%23eeeeea' text-anchor='middle'%3E{mark}%3C/text%3E%3C/svg%3E\">")


def header(site, mark, name, nav, repo):
    links = "".join(f'<a href="{h}">{e(t)}</a>' for t, h in nav)
    return (f'<a class="skip" href="#main">Skip to content</a><header class="mt"><div class="wrap"><a class="brand" href="{site}/"><i aria-hidden="true">{e(mark)}</i>{e(name)}</a>'
            f'<nav aria-label="Main">{links}<a href="{HOME}">All projects</a><a class="gh" href="{repo}">GitHub</a></nav></div></header>')


def footer(repo, license_text="Free under the MIT license."):
    return (f'<footer class="mt"><div class="wrap"><p>Made by <a href="{HOME}">MM Rahman Bappi</a>. {e(license_text)}</p>'
            f'<p><a href="{repo}">Source on GitHub</a> &nbsp; <a href="{HOME}">More free projects</a></p></div></footer>')


def hero(badge, h1, lead, cta, repo, images, mark, cycle_label, cycle, stat_label, stat_value, stat_note, big, small=""):
    figs = "".join(f'<figure><img src="{src}" alt="" width="640" height="400"></figure>' for src in images[:6])
    return f"""<section class="hero"><div class="wrap hgrid">
<div><span class="badge"><b>Free</b>{e(badge)}</span><h1>{e(h1)}</h1><p class="lead">{e(lead)}</p>
<div class="actions"><a class="btn main" href="{cta[1]}">{e(cta[0])}{ARROW}</a><a class="btn" href="{repo}">GitHub</a></div>{f'<p class="small">{e(small)}</p>' if small else ''}</div>
<div class="stack" aria-hidden="true">{figs}</div>
<div class="side"><div class="cycle"><div class="hd"><i aria-hidden="true">{e(mark)}</i><div><small>{e(cycle_label)}</small><strong id="mtcur">{e(cycle[0])}</strong></div></div>
<ul id="mtnx" aria-hidden="true">{"".join(f"<li>{e(c)}</li>" for c in cycle[1:5])}</ul></div>
<div class="stat"><small>{stat_label}</small><div><b>{e(stat_value)}</b><em>{e(stat_note)}</em></div></div>
<p class="big">{e(big)}</p></div>
</div></section>"""


def facts(items):
    return '<div class="facts"><div class="wrap"><ul>' + "".join(f"<li><b>{e(a)}</b><span>{e(b)}</span></li>" for a, b in items) + "</ul></div></div>"


def card(href, img, alt, cat, info, name, text, links, data_cat=""):
    ls = "".join(f'<a href="{h}">{e(t)}</a>' for t, h in links)
    return (f'<li class="mtcard"{f" data-cat={json.dumps(data_cat)}" if data_cat else ""}><a class="im" href="{href}" tabindex="-1" aria-hidden="true">'
            f'<img src="{img}" alt="{e(alt)}" width="640" height="400" loading="lazy"></a><div class="in"><div class="meta"><span>{e(cat)}</span><span>{e(info)}</span></div>'
            f'<h3><a href="{href}">{e(name)}</a></h3><p>{e(text)}</p><div class="links">{ls}</div></div></li>')


def faq(items, title="Questions people ask"):
    return (f'<section class="band" id="faq"><div class="wrap split"><div><p class="eyebrow">FAQ</p><h2>{e(title)}</h2></div><div>'
            + "".join(f'<details class="q"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in items) + '</div></div></section>')


def faq_schema(site, items):
    return {"@type": "FAQPage", "@id": site + "/#faq", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}


def script(cycle):
    return ("<script>(function(){var items=" + json.dumps(cycle) + ",cur=document.getElementById('mtcur'),nx=document.getElementById('mtnx'),i=0;"
            "if(cur&&!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(function(){i=(i+1)%items.length;cur.style.opacity=0;setTimeout(function(){cur.textContent=items[i];cur.style.opacity=1;"
            "nx.innerHTML='';for(var k=1;k<5;k++){var li=document.createElement('li');li.textContent=items[(i+k)%items.length];nx.appendChild(li);}},350);},2600);"
            "var b=[].slice.call(document.querySelectorAll('.chips button[data-f]')),c=[].slice.call(document.querySelectorAll('.mtcard[data-cat]'));"
            "b.forEach(function(x){x.addEventListener('click',function(){b.forEach(function(y){y.setAttribute('aria-pressed',y===x);});var f=x.dataset.f;"
            "c.forEach(function(k){k.hidden=f!=='all'&&k.dataset.cat!==f;});});});})();</script>")


def chips(cats, label="Filter"):
    return (f'<div class="chips" role="group" aria-label="{e(label)}"><button type="button" aria-pressed="true" data-f="all">All</button>'
            + "".join(f'<button type="button" aria-pressed="false" data-f="{e(c)}">{e(c)}</button>' for c in cats) + "</div>")
