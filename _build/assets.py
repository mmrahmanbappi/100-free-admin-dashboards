"""Shared CSS and JavaScript for the generated dashboards."""

ICONS = {
    "home": '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    "chart": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14.5c2 .7 3.4 2.6 4 5.5"/>',
    "user": '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.2-6 8-6s7 2 8 6"/>',
    "file": '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    "folder": '<path d="M3 6h7l2 2h9v11H3z"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "settings": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-2.9-1.2l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.7 1.7 0 003 15H3a2 2 0 010-4h.1A1.7 1.7 0 004.6 9l-.1-.1a2 2 0 112.8-2.8l.1.1A1.7 1.7 0 0010 5V5a2 2 0 014 0v.1a1.7 1.7 0 002.9 1.2l.1-.1a2 2 0 112.8 2.8l-.1.1A1.7 1.7 0 0021 11h.1a2 2 0 010 4H21a1.7 1.7 0 00-1.6 0z"/>',
    "bell": '<path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 004 0"/>',
    "card": '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    "box": '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    "truck": '<path d="M1 5h13v11H1zM14 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    "cart": '<path d="M3 4h2l2.5 11h11L21 7H6.2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
    "tag": '<path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    "briefcase": '<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M8 7V4h8v3M2 13h20"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "check": '<path d="M4 12l5 5L20 6"/>',
    "alert": '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/>',
    "list": '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    "grid": '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    "layers": '<path d="M12 3l10 5-10 5L2 8z"/><path d="M2 13l10 5 10-5"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
    "shield": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    "dollar": '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
    "book": '<path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6a3 3 0 00-3 3"/><path d="M20 4v14h-7"/>',
    "heart": '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
    "message": '<path d="M4 4h16v12H8l-4 4z"/>',
    "star": '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    "key": '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
    "activity": '<path d="M2 12h4l3 8 6-16 3 8h4"/>',
    "map": '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    "zap": '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    "tool": '<path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.4 2.4-2.6-.4-.4-2.6z"/>',
    "building": '<path d="M4 21V3h11v18M15 9h5v12M8 7h3M8 11h3M8 15h3M4 21h17"/>',
    "pie": '<path d="M12 3v9h9a9 9 0 11-9-9z"/><path d="M15 3.5A9 9 0 0120.5 9H15z"/>',
    "trend": '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    "help": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 2-2.5 2-2.5 4M12 17h.01"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    "moon": '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',
    "menu": '<path d="M3 6h18M3 12h18M3 18h18"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "download": '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    "filter": '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    "logout": '<path d="M15 4h4v16h-4M10 17l-5-5 5-5M5 12h11"/>',
    "components": '<rect x="3" y="3" width="8" height="8" rx="2"/><circle cx="17" cy="7" r="4"/><path d="M3 21l4-7 4 7zM14 14h7v7h-7z"/>',
    "inbox": '<path d="M3 13l3-9h12l3 9v7H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    "pin": '<path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    "monitor": '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    "kanban": '<rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="4" height="8" rx="1"/>',
    "receipt": '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
}


def icon(name, cls="i"):
    return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS.get(name, ICONS["grid"])}</svg>'


CSS = r"""
:root{--r:var(--radius,10px);--sbw:256px;--good:#15803d;--good-bg:#dcfce7;--warn:#a16207;--warn-bg:#fef3c7;--bad:#b91c1c;--bad-bg:#fee2e2;--info:#1d4ed8;--info-bg:#dbeafe;--mute:#4b5563;--mute-bg:#eef0f3}
[data-theme=dark]{--bg:var(--d-bg);--surface:var(--d-surface);--surface-2:var(--d-surface-2);--ink:var(--d-ink);--text:var(--d-text);--muted:var(--d-muted);--line:var(--d-line);--good:#4ade80;--good-bg:rgba(74,222,128,.14);--warn:#facc15;--warn-bg:rgba(250,204,21,.14);--bad:#f87171;--bad-bg:rgba(248,113,113,.14);--info:#60a5fa;--info-bg:rgba(96,165,250,.14);--mute:#cbd5e1;--mute-bg:rgba(203,213,225,.12)}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font:14.5px/1.55 var(--f-body);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}button,input,select,textarea{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.i{width:18px;height:18px;flex:none}
h1,h2,h3{font-family:var(--f-head);color:var(--ink);margin:0;letter-spacing:-.01em}
.mono{font-family:var(--f-mono);font-size:.93em}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
/* layout */
.app{display:grid;grid-template-columns:var(--sbw) 1fr;min-height:100vh}
.sb{position:sticky;top:0;height:100vh;overflow-y:auto;background:var(--sb-bg);color:var(--sb-text);padding:18px 14px;display:flex;flex-direction:column;gap:18px;border-right:1px solid var(--sb-line)}
.brand{display:flex;align-items:center;gap:10px;padding:4px 8px;font-family:var(--f-head);font-weight:700;font-size:18px;color:var(--sb-ink)}
.brand .mk{width:32px;height:32px;border-radius:calc(var(--r) - 2px);background:var(--accent);color:var(--on-accent);display:grid;place-items:center;font-size:15px}
.brand small{display:block;font-family:var(--f-body);font-weight:400;font-size:12px;color:var(--sb-text);opacity:.75}
.nav{display:flex;flex-direction:column;gap:2px}
.nav .lbl{font-size:11px;letter-spacing:.06em;text-transform:uppercase;opacity:.6;padding:10px 10px 4px}
.nav a{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:calc(var(--r) - 3px);font-size:14px;opacity:.88}
.nav a:hover{background:var(--sb-hover);opacity:1}
.nav a[aria-current=page]{background:var(--sb-active);color:var(--sb-active-text);opacity:1;font-weight:600}
.sb .foot{margin-top:auto;font-size:12.5px;opacity:.7;padding:0 10px}
.main{min-width:0;display:flex;flex-direction:column}
.tb{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:12px;padding:12px 26px;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.tb .search{flex:1;max-width:420px;display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--r) - 2px);padding:7px 11px;color:var(--muted)}
.tb .search input{border:0;background:none;outline:none;width:100%;color:var(--text)}
.tb .sp{flex:1}
.ib{width:38px;height:38px;display:grid;place-items:center;border-radius:calc(var(--r) - 2px);border:1px solid var(--line);background:var(--surface);cursor:pointer;color:var(--text);position:relative}
.ib .dot{position:absolute;top:8px;right:9px;width:7px;height:7px;border-radius:50%;background:var(--accent)}
.av{width:36px;height:36px;border-radius:50%;background:var(--accent-soft);color:var(--accent-ink);display:grid;place-items:center;font-weight:700;font-size:13px;flex:none}
.burger{display:none}
.ct{padding:26px;display:flex;flex-direction:column;gap:22px;max-width:1440px;width:100%}
/* page head */
.ph{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}
.ph p{margin:4px 0 0;color:var(--muted)}
.ph h1{font-size:26px}
.crumb{font-size:13px;color:var(--muted);margin-bottom:6px}.crumb a:hover{color:var(--accent)}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.btn{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:calc(var(--r) - 2px);border:1px solid var(--line);background:var(--surface);font-weight:600;font-size:13.5px;cursor:pointer;color:var(--ink);white-space:nowrap}
.btn.pri{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}
.btn.pri:hover{filter:brightness(1.07)}.btn:hover{border-color:var(--accent)}
.btn.ghost{background:none;border-color:transparent}
/* cards */
.card{background:var(--surface);border:1px solid var(--card-line);border-radius:var(--r);box-shadow:var(--card-shadow);padding:18px 20px;min-width:0}
.card h2{font-size:15.5px;display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}
.card h2 small{font-family:var(--f-body);font-weight:400;color:var(--muted);font-size:13px}
.g{display:grid;gap:18px}.g2{grid-template-columns:repeat(2,minmax(0,1fr))}.g3{grid-template-columns:repeat(3,minmax(0,1fr))}.g4{grid-template-columns:repeat(4,minmax(0,1fr))}
.g21{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}.g12{grid-template-columns:minmax(0,1fr) minmax(0,2fr)}
.kpi{display:flex;flex-direction:column;gap:6px}
.kpi .l{color:var(--muted);font-size:13px;display:flex;align-items:center;gap:7px}
.kpi .v{font-family:var(--f-num);font-size:26px;font-weight:700;color:var(--ink);letter-spacing:-.02em}
.kpi .d{font-size:12.5px;font-weight:600}.up{color:var(--good)}.down{color:var(--bad)}
.kpi svg.spark{width:100%;height:36px}
/* table */
.tw{overflow-x:auto;margin:0 -20px -18px}
table{width:100%;border-collapse:collapse;font-size:13.5px}
th{text-align:left;font-weight:600;color:var(--muted);font-size:12px;letter-spacing:.03em;text-transform:uppercase;padding:10px 20px;border-bottom:1px solid var(--line);white-space:nowrap;background:var(--surface-2)}
th[data-sort]{cursor:pointer}th[data-sort]:hover{color:var(--ink)}
td{padding:11px 20px;border-bottom:1px solid var(--line);white-space:nowrap;vertical-align:middle}
tr:last-child td{border-bottom:0}tbody tr:hover{background:var(--surface-2)}
td.t{font-weight:600;color:var(--ink)}td a.t{font-weight:600;color:var(--ink)}td a.t:hover{color:var(--accent)}
td.num,th.num{text-align:right;font-family:var(--f-mono);font-size:13px}
.who{display:flex;align-items:center;gap:9px}.who .av{width:28px;height:28px;font-size:11px}
.pill{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}
.pill::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.p-good{color:var(--good);background:var(--good-bg)}.p-warn{color:var(--warn);background:var(--warn-bg)}.p-bad{color:var(--bad);background:var(--bad-bg)}.p-info{color:var(--info);background:var(--info-bg)}.p-mute{color:var(--mute);background:var(--mute-bg)}
.toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
.inp{display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--r) - 3px);padding:7px 10px;color:var(--muted)}
.inp input{border:0;background:none;outline:none;color:var(--text);min-width:180px}
select,.field input,.field textarea,.field select{background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--r) - 3px);padding:8px 10px;color:var(--text)}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:13px;cursor:pointer}
.chip b{margin-left:4px;color:var(--muted);font-weight:600}.chip[aria-pressed=true]{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
.pager{display:flex;justify-content:space-between;align-items:center;padding:14px 0 0;color:var(--muted);font-size:13px;flex-wrap:wrap;gap:10px}
.pager .pg{display:flex;gap:4px}.pager .pg a{min-width:32px;height:32px;display:grid;place-items:center;border-radius:8px;border:1px solid var(--line)}.pager .pg a[aria-current]{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
/* detail */
dl.facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px 24px;margin:0}
dl.facts dt{font-size:12.5px;color:var(--muted)}dl.facts dd{margin:2px 0 0;font-weight:600;color:var(--ink)}
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin:-4px 0 16px}
.tabs button{border:0;background:none;padding:9px 12px;cursor:pointer;color:var(--muted);font-weight:600;border-bottom:2px solid transparent;margin-bottom:-1px}
.tabs button[aria-selected=true]{color:var(--accent);border-color:var(--accent)}
.tl{list-style:none;margin:0;padding:0}.tl li{position:relative;padding:0 0 16px 22px;border-left:2px solid var(--line);margin-left:6px}
.tl li::before{content:"";position:absolute;left:-7px;top:3px;width:12px;height:12px;border-radius:50%;background:var(--surface);border:2px solid var(--accent)}
.tl li:last-child{border-color:transparent}.tl b{color:var(--ink)}.tl span{display:block;color:var(--muted);font-size:12.5px}
.list{list-style:none;margin:0;padding:0}.list li{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line)}.list li:last-child{border:0}
.list .grow{flex:1;min-width:0}.list .grow b{display:block;color:var(--ink);font-weight:600}.list .grow span{color:var(--muted);font-size:12.5px}
.bar{height:8px;background:var(--surface-2);border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;background:var(--accent);border-radius:99px}
/* forms */
.form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 20px}
.field{display:flex;flex-direction:column;gap:6px}.field.full{grid-column:1/-1}.field label{font-weight:600;font-size:13px;color:var(--ink)}
.field .hint{color:var(--muted);font-size:12px}
.sw{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid var(--line)}.sw:last-child{border:0}
.sw b{display:block;color:var(--ink)}.sw span{color:var(--muted);font-size:12.5px}
.tg{width:40px;height:22px;border-radius:99px;background:var(--line);border:0;position:relative;cursor:pointer;flex:none}
.tg::after{content:"";position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s}
.tg[aria-checked=true]{background:var(--accent)}.tg[aria-checked=true]::after{left:21px}
/* charts */
svg.ch{width:100%;height:auto;display:block;overflow:visible}
svg.ch text{font-family:var(--f-body);font-size:11px;fill:var(--muted)}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:10px}
.legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
/* kanban */
.kb{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:16px;overflow-x:auto;padding-bottom:6px}
.col{background:var(--surface-2);border-radius:var(--r);padding:12px;display:flex;flex-direction:column;gap:10px}
.col h3{font-size:13.5px;display:flex;justify-content:space-between}
.kc{background:var(--surface);border:1px solid var(--card-line);border-radius:calc(var(--r) - 2px);padding:12px;display:flex;flex-direction:column;gap:6px;font-size:13px}
.kc b{color:var(--ink)}.kc .meta{display:flex;justify-content:space-between;color:var(--muted);font-size:12px}
/* calendar */
.cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-top:1px solid var(--line);border-left:1px solid var(--line)}
.cal div{min-height:104px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:6px;font-size:12px}
.cal .hd{min-height:auto;background:var(--surface-2);font-weight:600;color:var(--muted);text-align:center}
.cal .n{color:var(--muted);font-weight:600}.cal .off{background:var(--surface-2);opacity:.6}
.ev{display:block;margin-top:4px;padding:3px 6px;border-radius:5px;background:var(--accent-soft);color:var(--accent-ink);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ev.b{background:var(--info-bg);color:var(--info)}.ev.c{background:var(--warn-bg);color:var(--warn)}
/* monitor */
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
.tile{background:var(--surface);border:1px solid var(--card-line);border-radius:var(--r);padding:14px;display:flex;flex-direction:column;gap:6px}
.tile b{color:var(--ink)}.tile .v{font-family:var(--f-num);font-size:22px;font-weight:700;color:var(--ink)}
.led{width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:6px}
/* document */
.doc{max-width:820px;background:var(--surface);border:1px solid var(--card-line);border-radius:var(--r);padding:40px;box-shadow:var(--card-shadow)}
.doc .top{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:28px}
.doc table td,.doc table th{padding:10px 8px}.doc .tot{margin-left:auto;width:280px;margin-top:14px}.doc .tot div{display:flex;justify-content:space-between;padding:6px 0}.doc .tot .big{border-top:2px solid var(--ink);font-weight:700;color:var(--ink);font-size:16px}
/* split */
.split{display:grid;grid-template-columns:340px 1fr;min-height:560px;padding:0;overflow:hidden}
.split .ls{border-right:1px solid var(--line);overflow-y:auto}.split .it{padding:14px 18px;border-bottom:1px solid var(--line);display:block}
.split .it.on{background:var(--accent-soft)}.split .it b{display:flex;justify-content:space-between;color:var(--ink)}.split .it span{color:var(--muted);font-size:12.5px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.split .pv{padding:24px 28px}
/* people */
.ppl{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.ppl .card{text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px}.ppl .av{width:56px;height:56px;font-size:18px}
/* auth */
.auth{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}
.auth .art{background:var(--accent);color:var(--on-accent);padding:48px;display:flex;flex-direction:column;justify-content:space-between}
.auth .art h2{color:inherit;font-size:34px;line-height:1.15;max-width:18ch}.auth .art p{opacity:.85;max-width:36ch}
.auth .fm{display:flex;align-items:center;justify-content:center;padding:40px}
.auth .box{width:100%;max-width:380px;display:flex;flex-direction:column;gap:16px}
.auth .box .field input{width:100%}
.nf{min-height:100vh;display:grid;place-items:center;text-align:center;padding:30px}.nf b{font-family:var(--f-head);font-size:96px;color:var(--accent);line-height:1}
/* faq */
details{border-bottom:1px solid var(--line);padding:12px 0}summary{cursor:pointer;font-weight:600;color:var(--ink)}details p{color:var(--muted);margin:8px 0 0}
.swatch{display:flex;gap:10px;flex-wrap:wrap}.swatch span{width:64px;height:48px;border-radius:8px;border:1px solid var(--line)}
@media (max-width:1100px){.g4{grid-template-columns:repeat(2,minmax(0,1fr))}.g3{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:860px){.app{grid-template-columns:1fr}.sb{position:fixed;inset:0 auto 0 0;width:270px;z-index:20;transform:translateX(-100%);transition:transform .2s}
body.nav-open .sb{transform:none;box-shadow:0 0 0 100vmax rgba(0,0,0,.35)}.burger{display:grid}.g2,.g21,.g12,.form{grid-template-columns:1fr}.split{grid-template-columns:1fr}.split .pv{display:none}.auth{grid-template-columns:1fr}.auth .art{display:none}.ct{padding:18px}.tb{padding:10px 16px}.tb .search{display:none}}
@media (max-width:560px){.g4,.g3{grid-template-columns:1fr}}
@media print{.sb,.tb{display:none}.app{display:block}.card,.doc{box-shadow:none}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
"""

JS = r"""
(function(){
  var root=document.documentElement,key='theme-'+(document.body.dataset.app||'app');
  try{var s=localStorage.getItem(key);if(s)root.dataset.theme=s;}catch(e){}
  document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.addEventListener('click',function(){
    var t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem(key,t)}catch(e){}});});
  document.querySelectorAll('[data-burger]').forEach(function(b){b.addEventListener('click',function(){document.body.classList.toggle('nav-open')});});
  document.addEventListener('click',function(e){if(document.body.classList.contains('nav-open')&&!e.target.closest('.sb,[data-burger]'))document.body.classList.remove('nav-open')});
  // table search and status filter
  document.querySelectorAll('[data-table]').forEach(function(t){
    var id=t.dataset.table,q=document.querySelector('[data-search="'+id+'"]'),chips=document.querySelectorAll('[data-chip="'+id+'"]'),st='all';
    function run(){var v=(q&&q.value||'').toLowerCase();t.querySelectorAll('tbody tr').forEach(function(r){
      var ok=(!v||r.textContent.toLowerCase().indexOf(v)>-1)&&(st==='all'||r.dataset.status===st);r.hidden=!ok;});}
    if(q)q.addEventListener('input',run);
    chips.forEach(function(c){c.addEventListener('click',function(){chips.forEach(function(x){x.setAttribute('aria-pressed','false')});c.setAttribute('aria-pressed','true');st=c.dataset.value;run();});});
    t.querySelectorAll('th[data-sort]').forEach(function(th,i){th.addEventListener('click',function(){
      var idx=[].indexOf.call(th.parentNode.children,th),tb=t.querySelector('tbody'),rows=[].slice.call(tb.rows),dir=th.dataset.dir==='asc'?-1:1;th.dataset.dir=dir===1?'asc':'desc';
      rows.sort(function(a,b){var x=a.cells[idx].dataset.v||a.cells[idx].textContent,y=b.cells[idx].dataset.v||b.cells[idx].textContent,nx=parseFloat(x),ny=parseFloat(y);
        return (isNaN(nx)||isNaN(ny)?x.localeCompare(y):nx-ny)*dir;});rows.forEach(function(r){tb.appendChild(r)});});});
  });
  // select all
  document.querySelectorAll('[data-all]').forEach(function(a){a.addEventListener('change',function(){a.closest('table').querySelectorAll('tbody input[type=checkbox]').forEach(function(c){c.checked=a.checked})});});
  // tabs
  document.querySelectorAll('[data-tabs]').forEach(function(w){var bs=w.querySelectorAll('.tabs button'),ps=w.querySelectorAll('[data-panel]');
    bs.forEach(function(b,i){b.addEventListener('click',function(){bs.forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');ps.forEach(function(p,j){p.hidden=j!==i});});});});
  // toggles
  document.querySelectorAll('.tg').forEach(function(t){t.addEventListener('click',function(){t.setAttribute('aria-checked',t.getAttribute('aria-checked')==='true'?'false':'true')});});
  // demo forms
  document.querySelectorAll('form[data-demo]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('[type=submit]');if(b){var o=b.textContent;b.textContent='Saved';setTimeout(function(){b.textContent=o},1400);}});});
})();
"""
