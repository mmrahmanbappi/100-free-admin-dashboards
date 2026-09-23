/* Signal - demo dataset.
   Every figure rendered anywhere in the template comes from this object.
   Replace the contents to point the dashboard at real data. */
window.SIGNAL_DATA = (function () {

  var settings = {
    workspace: "Larkfield Group",
    property: "larkfield.io",
    currency: "$",
    timezone: "UTC+00:00",
    user: { name: "Amara Reyes", email: "amara@larkfield.io", initials: "AR", role: "Owner" }
  };

  /* ---- series helpers: deterministic, so every reload matches ---- */
  function wave(n, base, amp, seed) {
    var out = [], s = seed || 7;
    for (var i = 0; i < n; i++) {
      s = (s * 9301 + 49297) % 233280;
      var noise = (s / 233280 - 0.5) * amp * 0.5;
      var weekly = Math.sin(i / 7 * Math.PI * 2) * amp * 0.28;
      var trend = (i / n) * amp * 0.45;
      out.push(Math.max(0, Math.round(base + weekly + trend + noise)));
    }
    return out;
  }
  function days(n) {
    var out = [], d = new Date(2026, 8, 19);
    for (var i = n - 1; i >= 0; i--) {
      var x = new Date(d.getTime() - i * 864e5);
      out.push(x.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }));
    }
    return out;
  }

  var labels30 = days(30);

  var metrics = {
    visitors:    { label: "Visitors",       value: 284610,  delta: 12.4,  unit: "count",    series: wave(30, 8200, 3400, 11) },
    sessions:    { label: "Sessions",       value: 412780,  delta: 14.1,  unit: "count",    series: wave(30, 12100, 4800, 23) },
    pageviews:   { label: "Page views",     value: 1284300, delta: 18.6,  unit: "count",    series: wave(30, 37600, 12000, 31) },
    pps:         { label: "Pages / session",value: 3.11,    delta: 3.9,   unit: "decimal",  series: wave(30, 305, 40, 5).map(function (v) { return v / 100; }) },
    duration:    { label: "Avg duration",   value: 168,     delta: 6.2,   unit: "duration", series: wave(30, 164, 38, 17) },
    bounce:      { label: "Bounce rate",    value: 42.6,    delta: -2.8,  unit: "rate", invert: true, series: wave(30, 43, 6, 41).map(function (v) { return v; }) },
    conversions: { label: "Conversions",    value: 8940,    delta: 21.3,  unit: "count",    series: wave(30, 262, 110, 13) },
    cvr:         { label: "Conversion rate",value: 2.17,    delta: 0.14,  unit: "pp",       series: wave(30, 210, 60, 29).map(function (v) { return v / 100; }) },
    revenue:     { label: "Revenue",        value: 412880,  delta: 19.8,  unit: "money",    series: wave(30, 12100, 5200, 37) },
    aov:         { label: "Avg order value",value: 46.18,   delta: -1.2,  unit: "money",    series: wave(30, 4600, 400, 19).map(function (v) { return v / 100; }) },
    activeNow:   { label: "Active now",     value: 1247,    delta: 0,     unit: "count" },
    newReturning:{ label: "New vs returning", value: 64.8,  delta: 1.6,   unit: "rate" }
  };

  var channels = [
    { name: "Organic search", share: 38.0, sessions: 156856, cvr: 2.41, revenue: 158420, delta: 9.2 },
    { name: "Direct",         share: 22.0, sessions: 90812,  cvr: 1.96, revenue: 81240,  delta: 4.1 },
    { name: "Social",         share: 14.0, sessions: 57789,  cvr: 1.12, revenue: 29870,  delta: 31.8 },
    { name: "Paid search",    share: 11.0, sessions: 45406,  cvr: 2.88, revenue: 62310,  delta: -3.4 },
    { name: "Referral",       share: 9.0,  sessions: 37150,  cvr: 2.34, revenue: 41960,  delta: 6.7 },
    { name: "Email",          share: 4.0,  sessions: 16511,  cvr: 4.62, revenue: 26940,  delta: 12.9 },
    { name: "AI assistants",  share: 2.0,  sessions: 8256,   cvr: 3.94, revenue: 12140,  delta: 84.5 }
  ];

  var assistants = [
    { name: "ChatGPT",    sessions: 3712, cvr: 4.21, delta: 92.4, pages: 148 },
    { name: "Perplexity", sessions: 1998, cvr: 4.08, delta: 71.2, pages: 96  },
    { name: "Gemini",     sessions: 1486, cvr: 3.44, delta: 58.9, pages: 74  },
    { name: "Claude",     sessions: 682,  cvr: 3.97, delta: 44.1, pages: 41  },
    { name: "Copilot",    sessions: 378,  cvr: 2.86, delta: 18.6, pages: 22  }
  ];

  var citations = [
    { page: "/compare/alternatives",             assistant: "ChatGPT",    cites: 412, first: "14 Aug", sessions: 1184, ready: 4 },
    { page: "/docs/getting-started",             assistant: "Perplexity", cites: 318, first: "02 Aug", sessions: 864,  ready: 4 },
    { page: "/blog/analytics-without-cookies",   assistant: "ChatGPT",    cites: 276, first: "21 Jul", sessions: 742,  ready: 3 },
    { page: "/pricing",                          assistant: "Gemini",     cites: 198, first: "29 Aug", sessions: 516,  ready: 2 },
    { page: "/blog/utm-best-practices",          assistant: "Claude",     cites: 141, first: "06 Sep", sessions: 288,  ready: 3 },
    { page: "/features",                         assistant: "Perplexity", cites: 124, first: "11 Aug", sessions: 261,  ready: 2 },
    { page: "/docs/api",                         assistant: "Copilot",    cites: 88,  first: "18 Aug", sessions: 174,  ready: 4 }
  ];

  var crawlers = [
    { agent: "GPTBot",           hits: 48210, last: "3 min ago",  allowed: true },
    { agent: "PerplexityBot",    hits: 31480, last: "11 min ago", allowed: true },
    { agent: "Google-Extended",  hits: 22640, last: "26 min ago", allowed: true },
    { agent: "ClaudeBot",        hits: 14920, last: "42 min ago", allowed: true },
    { agent: "Bytespider",       hits: 9840,  last: "2 h ago",    allowed: false },
    { agent: "CCBot",            hits: 6210,  last: "5 h ago",    allowed: false }
  ];

  var countries = [
    { name: "United States",  sessions: 84120, cvr: 2.44, delta: 11.2 },
    { name: "Germany",        sessions: 38940, cvr: 2.61, delta: 18.4 },
    { name: "United Kingdom", sessions: 34260, cvr: 2.38, delta: 7.9 },
    { name: "India",          sessions: 29880, cvr: 0.94, delta: 42.1 },
    { name: "Brazil",         sessions: 24510, cvr: 1.18, delta: 28.6 },
    { name: "Canada",         sessions: 21340, cvr: 2.52, delta: 5.4 },
    { name: "France",         sessions: 19770, cvr: 2.06, delta: 9.1 },
    { name: "Australia",      sessions: 16420, cvr: 2.71, delta: 3.2 },
    { name: "Japan",          sessions: 14880, cvr: 1.88, delta: 14.7 },
    { name: "Netherlands",    sessions: 12640, cvr: 3.04, delta: 6.8 },
    { name: "Spain",          sessions: 11290, cvr: 1.74, delta: 12.2 },
    { name: "Mexico",         sessions: 9860,  cvr: 1.31, delta: 21.5 }
  ];

  var devices = [
    { name: "Mobile",  share: 61.4, sessions: 253446, cvr: 1.62 },
    { name: "Desktop", share: 33.8, sessions: 139520, cvr: 3.28 },
    { name: "Tablet",  share: 4.8,  sessions: 19814,  cvr: 2.04 }
  ];

  var pages = [
    { path: "/",                                type: "Landing",  views: 184200, uniq: 142880, time: 82,  exit: 34.1, conv: 1918, cvr: 1.04 },
    { path: "/pricing",                         type: "Product",  views: 96420,  uniq: 78210,  time: 171, exit: 28.4, conv: 5959, cvr: 6.18 },
    { path: "/features",                        type: "Product",  views: 71880,  uniq: 58440,  time: 134, exit: 31.7, conv: 1754, cvr: 2.44 },
    { path: "/blog/analytics-without-cookies",  type: "Article",  views: 58340,  uniq: 51220,  time: 246, exit: 62.3, conv: 414,  cvr: 0.71 },
    { path: "/docs/getting-started",            type: "Docs",     views: 46110,  uniq: 36940,  time: 318, exit: 22.9, conv: 1392, cvr: 3.02 },
    { path: "/compare/alternatives",            type: "Product",  views: 38950,  uniq: 33110,  time: 224, exit: 26.8, conv: 1897, cvr: 4.87 },
    { path: "/blog/utm-best-practices",         type: "Article",  views: 31470,  uniq: 28640,  time: 238, exit: 64.1, conv: 208,  cvr: 0.66 },
    { path: "/signup",                          type: "Funnel",   views: 31180,  uniq: 29440,  time: 108, exit: 18.2, conv: 14248,cvr: 45.7 },
    { path: "/docs/api",                        type: "Docs",     views: 24860,  uniq: 19120,  time: 402, exit: 24.4, conv: 611,  cvr: 2.46 },
    { path: "/integrations",                    type: "Product",  views: 21440,  uniq: 18260,  time: 156, exit: 33.8, conv: 486,  cvr: 2.27 },
    { path: "/blog/server-side-tracking",       type: "Article",  views: 18920,  uniq: 17040,  time: 264, exit: 61.8, conv: 132,  cvr: 0.70 },
    { path: "/customers",                       type: "Product",  views: 14380,  uniq: 12610,  time: 142, exit: 39.2, conv: 298,  cvr: 2.07 },
    { path: "/docs/webhooks",                   type: "Docs",     views: 12640,  uniq: 9880,   time: 366, exit: 27.1, conv: 264,  cvr: 2.09 },
    { path: "/changelog",                       type: "Article",  views: 10920,  uniq: 8740,   time: 118, exit: 48.6, conv: 84,   cvr: 0.77 },
    { path: "/security",                        type: "Product",  views: 8460,   uniq: 7320,   time: 188, exit: 36.4, conv: 172,  cvr: 2.03 }
  ];

  var events = [
    { name: "page_view",      cat: "Automatic", count: 1284300, uniq: 284610, last: "just now" },
    { name: "scroll_75",      cat: "Automatic", count: 402880,  uniq: 168240, last: "just now" },
    { name: "cta_click",      cat: "Interaction", count: 148220, uniq: 96410, last: "12 s ago" },
    { name: "pricing_toggle", cat: "Interaction", count: 64910,  uniq: 41880, last: "38 s ago" },
    { name: "doc_search",     cat: "Interaction", count: 52340,  uniq: 28760, last: "1 min ago" },
    { name: "video_play",     cat: "Media",       count: 41760,  uniq: 26140, last: "2 min ago" },
    { name: "signup_start",   cat: "Conversion",  count: 31180,  uniq: 29440, last: "3 min ago" },
    { name: "checkout_start", cat: "Conversion",  count: 18640,  uniq: 16920, last: "4 min ago" },
    { name: "purchase",       cat: "Conversion",  count: 8940,   uniq: 8210,  last: "6 min ago" },
    { name: "export_click",   cat: "Interaction", count: 4210,   uniq: 2860,  last: "14 min ago" }
  ];

  var funnel = [
    { label: "Session started",  value: 412780, pct: 100,  drop: 0 },
    { label: "Viewed pricing",   value: 96420,  pct: 23.4, drop: 76.6 },
    { label: "Started signup",   value: 31180,  pct: 7.6,  drop: 67.7 },
    { label: "Completed signup", value: 14260,  pct: 3.5,  drop: 54.3 },
    { label: "Converted",        value: 8940,   pct: 2.17, drop: 37.3 }
  ];

  var cohorts = {
    columns: ["Week 0", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    rows: [
      { label: "11 Aug", size: 18420, values: [100, 42, 31, 26, 22, 19] },
      { label: "18 Aug", size: 19880, values: [100, 44, 33, 27, 24, null] },
      { label: "25 Aug", size: 21360, values: [100, 47, 36, 30, null, null] },
      { label: "01 Sep", size: 22940, values: [100, 49, 38, null, null, null] },
      { label: "08 Sep", size: 24610, values: [100, 52, null, null, null, null] },
      { label: "15 Sep", size: 26180, values: [100, null, null, null, null, null] }
    ]
  };

  var searchQueries = [
    { q: "pricing",     n: 4820, results: 12, ctr: 71.2, cvr: 8.4 },
    { q: "api",         n: 3640, results: 34, ctr: 66.8, cvr: 3.1 },
    { q: "export",      n: 2910, results: 9,  ctr: 58.4, cvr: 2.2 },
    { q: "integrations",n: 2480, results: 21, ctr: 64.1, cvr: 2.8 },
    { q: "sso",         n: 1970, results: 3,  ctr: 41.6, cvr: 4.9 },
    { q: "webhooks",    n: 1740, results: 7,  ctr: 62.9, cvr: 2.4 },
    { q: "billing",     n: 1510, results: 11, ctr: 55.2, cvr: 1.8 },
    { q: "rate limits", n: 1280, results: 4,  ctr: 48.7, cvr: 1.2 }
  ];
  var zeroResults = [
    { q: "sso saml",      n: 312 }, { q: "data residency", n: 264 },
    { q: "on premise",    n: 198 }, { q: "audit log",      n: 176 },
    { q: "hipaa",         n: 121 }
  ];

  var goals = [
    { name: "Purchase",            done: 8940,  value: 412880, cvr: 2.17 },
    { name: "Trial started",       done: 14260, value: null,   cvr: 3.45 },
    { name: "Demo requested",      done: 2180,  value: null,   cvr: 0.53 },
    { name: "Newsletter signup",   done: 6470,  value: null,   cvr: 1.57 },
    { name: "Doc search performed",done: 52340, value: null,   cvr: null }
  ];

  var vitals = [
    { name: "LCP",  value: "2.1 s",   state: "pass", dist: [78, 17, 5],  note: "Largest contentful paint" },
    { name: "INP",  value: "164 ms",  state: "pass", dist: [84, 12, 4],  note: "Interaction to next paint" },
    { name: "CLS",  value: "0.06",    state: "pass", dist: [91, 7, 2],   note: "Cumulative layout shift" }
  ];

  var liveFeed = [
    { path: "/pricing",                       country: "Germany",       device: "Desktop" },
    { path: "/docs/getting-started",          country: "United States", device: "Desktop" },
    { path: "/blog/analytics-without-cookies",country: "India",         device: "Mobile" },
    { path: "/compare/alternatives",          country: "Netherlands",   device: "Desktop" },
    { path: "/signup",                        country: "Brazil",        device: "Mobile" },
    { path: "/features",                      country: "Japan",         device: "Mobile" },
    { path: "/docs/api",                      country: "Canada",        device: "Desktop" },
    { path: "/integrations",                  country: "France",        device: "Tablet" },
    { path: "/",                              country: "Australia",     device: "Mobile" },
    { path: "/blog/utm-best-practices",       country: "Spain",         device: "Mobile" }
  ];
  var liveEvents = ["page_view", "scroll_75", "cta_click", "pricing_toggle", "doc_search", "signup_start", "video_play"];

  var segments = ["All visitors", "Mobile only", "New visitors", "Returning visitors",
                  "Paid traffic", "AI referrals", "Converters", "North America"];

  var team = [
    { initials: "AR", name: "Amara Reyes",     role: "Owner",         last: "now" },
    { initials: "JL", name: "Jonas Lindqvist", role: "Analytics lead",last: "14 min ago" },
    { initials: "PM", name: "Priya Menon",     role: "Growth",        last: "2 h ago" },
    { initials: "DK", name: "Daniel Kovac",    role: "Engineering",   last: "yesterday" },
    { initials: "SO", name: "Sofia Oliveira",  role: "Marketing",     last: "3 days ago" }
  ];

  var definitions = {
    visitors: "A unique browser seen in the period, identified by a rotating daily hash. No persistent cookie.",
    sessions: "A visit that ends after 30 minutes of inactivity, or at midnight in property time zone.",
    pageviews: "One rendered page. Client-side route changes count once.",
    pps: "Page views divided by sessions for the same period and segment.",
    duration: "Mean engaged time per session. Engaged time counts only a focused tab with recent scroll or input.",
    bounce: "Share of sessions with one page view and under 10 seconds of engaged time. Lower is better.",
    conversions: "A completed goal, deduplicated per visitor per goal within 24 hours.",
    cvr: "Conversions divided by sessions for the same period and segment.",
    revenue: "Value attributed to completed goals that carry a monetary value.",
    aov: "Revenue divided by conversions that carry a value.",
    exit: "Share of sessions that ended on this page. Lower is better.",
    ai: "A session whose referrer or user agent matches a known AI assistant surface."
  };

  return {
    settings: settings, labels30: labels30, metrics: metrics, channels: channels,
    assistants: assistants, citations: citations, crawlers: crawlers, countries: countries,
    devices: devices, pages: pages, events: events, funnel: funnel, cohorts: cohorts,
    searchQueries: searchQueries, zeroResults: zeroResults, goals: goals, vitals: vitals,
    liveFeed: liveFeed, liveEvents: liveEvents, segments: segments, team: team,
    definitions: definitions
  };
})();

/* ---- report datasets, second block ---- */
Object.assign(window.SIGNAL_DATA, {
  referrers: [
    { domain:"news.ycombinator.com", sessions:8420, cvr:1.84, quality:72, cat:"Community" },
    { domain:"reddit.com",           sessions:6910, cvr:0.92, quality:48, cat:"Community" },
    { domain:"producthunt.com",      sessions:4480, cvr:3.12, quality:81, cat:"Directory" },
    { domain:"stackoverflow.com",    sessions:3960, cvr:2.44, quality:76, cat:"Community" },
    { domain:"dev.to",               sessions:3240, cvr:1.58, quality:61, cat:"Publisher" },
    { domain:"github.com",           sessions:2870, cvr:4.06, quality:88, cat:"Code" },
    { domain:"linkedin.com",         sessions:2410, cvr:1.22, quality:54, cat:"Social" },
    { domain:"indiehackers.com",     sessions:1860, cvr:2.91, quality:74, cat:"Community" }
  ],
  campaigns: [
    { name:"q3-launch",        source:"google",   medium:"cpc",     sessions:18420, spend:14280, conv:512, cpa:27.89, roas:3.4 },
    { name:"retarget-pricing", source:"meta",     medium:"cpc",     sessions:12640, spend:8940,  conv:388, cpa:23.04, roas:4.1 },
    { name:"newsletter-sep",   source:"customer", medium:"email",   sessions:9180,  spend:0,     conv:424, cpa:0,     roas:null },
    { name:"docs-sponsor",     source:"devto",    medium:"sponsor", sessions:6420,  spend:3200,  conv:142, cpa:22.54, roas:2.9 },
    { name:"compare-page",     source:"bing",     medium:"cpc",     sessions:4180,  spend:2460,  conv:96,  cpa:25.63, roas:2.4 }
  ],
  landing: [
    { path:"/", sessions:96400, bounce:48.2, pps:2.84, cvr:1.04 },
    { path:"/pricing", sessions:62180, bounce:31.4, pps:4.12, cvr:6.18 },
    { path:"/compare/alternatives", sessions:34120, bounce:29.8, pps:4.46, cvr:4.87 },
    { path:"/blog/analytics-without-cookies", sessions:48640, bounce:71.2, pps:1.38, cvr:0.71 },
    { path:"/docs/getting-started", sessions:28940, bounce:24.1, pps:5.22, cvr:3.02 },
    { path:"/features", sessions:21880, bounce:38.6, pps:3.04, cvr:2.44 }
  ],
  exits: [
    { path:"/blog/utm-best-practices", exits:20180, rate:64.1 },
    { path:"/blog/analytics-without-cookies", exits:36340, rate:62.3 },
    { path:"/changelog", exits:5300, rate:48.6 },
    { path:"/customers", exits:5640, rate:39.2 },
    { path:"/security", exits:3080, rate:36.4 },
    { path:"/", exits:62800, rate:34.1 }
  ],
  flows: [
    { path:"/ > /pricing > /signup", sessions:18420, cvr:8.42 },
    { path:"/ > /features > /pricing", sessions:14260, cvr:4.18 },
    { path:"/blog/* > / > /pricing", sessions:9840, cvr:2.64 },
    { path:"/docs/getting-started > /docs/api", sessions:8120, cvr:3.06 },
    { path:"/compare/alternatives > /pricing > /signup", sessions:6480, cvr:11.24 },
    { path:"/ > exit", sessions:62800, cvr:0 }
  ],
  segmentDefs: [
    { name:"Mobile only", rule:"device is Mobile", visitors:174600, share:61.4, used:"2 h ago" },
    { name:"AI referrals", rule:"channel is AI assistants", visitors:5840, share:2.0, used:"yesterday" },
    { name:"Converters", rule:"completed any goal", visitors:8210, share:2.9, used:"4 days ago" },
    { name:"North America", rule:"country in United States, Canada, Mexico", visitors:81420, share:28.6, used:"today" },
    { name:"Returning visitors", rule:"sessions greater than 1", visitors:100180, share:35.2, used:"1 week ago" },
    { name:"Paid traffic", rule:"medium is cpc", visitors:31280, share:11.0, used:"3 days ago" }
  ],
  conversions: [
    { id:"CV-48210", when:"19 Sep 09:41", goal:"Purchase", value:79, source:"Organic search", country:"Germany", status:"Complete" },
    { id:"CV-48209", when:"19 Sep 09:12", goal:"Trial started", value:0, source:"AI assistants", country:"United States", status:"Complete" },
    { id:"CV-48208", when:"19 Sep 08:54", goal:"Purchase", value:29, source:"Email", country:"United Kingdom", status:"Complete" },
    { id:"CV-48207", when:"19 Sep 08:31", goal:"Demo requested", value:0, source:"Paid search", country:"Canada", status:"Pending" },
    { id:"CV-48206", when:"19 Sep 08:02", goal:"Purchase", value:199, source:"Referral", country:"Netherlands", status:"Complete" },
    { id:"CV-48205", when:"19 Sep 07:48", goal:"Purchase", value:79, source:"Direct", country:"Australia", status:"Refunded" },
    { id:"CV-48204", when:"19 Sep 07:21", goal:"Trial started", value:0, source:"Organic search", country:"India", status:"Complete" },
    { id:"CV-48203", when:"19 Sep 06:58", goal:"Newsletter signup", value:0, source:"Social", country:"Brazil", status:"Complete" }
  ],
  attribution: [
    { channel:"Organic search", last:3402, first:2884, linear:3106, decay:3248, position:3178 },
    { channel:"Direct",         last:1788, first:1102, linear:1486, decay:1602, position:1404 },
    { channel:"Paid search",    last:1306, first:1642, linear:1448, decay:1382, position:1518 },
    { channel:"Social",         last:642,  first:1224, linear:906,  decay:784,  position:1012 },
    { channel:"Referral",       last:868,  first:1006, linear:942,  decay:912,  position:978 },
    { channel:"Email",          last:762,  first:508,  linear:668,  decay:718,  position:604 },
    { channel:"AI assistants",  last:172,  first:574,  linear:384,  decay:294,  position:246 }
  ],
  revenueBy: [
    { name:"Organic search", value:158420 }, { name:"Direct", value:81240 },
    { name:"Paid search", value:62310 }, { name:"Referral", value:41960 },
    { name:"Social", value:29870 }, { name:"Email", value:26940 }, { name:"AI assistants", value:12140 }
  ],
  browsers: [
    { name:"Chrome", share:64.0, sessions:264180, cvr:2.24 },
    { name:"Safari", share:18.0, sessions:74300,  cvr:1.86 },
    { name:"Edge",   share:8.0,  sessions:33022,  cvr:2.61 },
    { name:"Firefox",share:6.0,  sessions:24766,  cvr:2.42 },
    { name:"Other",  share:4.0,  sessions:16512,  cvr:1.44 }
  ],
  systems: [
    { name:"Android", share:38.0, sessions:156856 }, { name:"iOS", share:24.0, sessions:99067 },
    { name:"Windows", share:22.0, sessions:90812 }, { name:"macOS", share:12.0, sessions:49534 },
    { name:"Linux", share:4.0, sessions:16511 }
  ],
  languages: [
    { name:"en-US", share:41.0, sessions:169240, cvr:2.31 }, { name:"en-GB", share:12.0, sessions:49534, cvr:2.44 },
    { name:"de-DE", share:11.0, sessions:45406, cvr:2.62 }, { name:"pt-BR", share:9.0, sessions:37150, cvr:1.14 },
    { name:"hi-IN", share:8.0, sessions:33022, cvr:0.92 }, { name:"fr-FR", share:7.0, sessions:28895, cvr:2.08 },
    { name:"es-ES", share:6.0, sessions:24767, cvr:1.72 }, { name:"ja-JP", share:6.0, sessions:24766, cvr:1.88 }
  ],
  coverage: [
    { state:"Indexed", pages:1796, note:"Serving in search" },
    { state:"Discovered, not indexed", pages:31, note:"Crawl budget" },
    { state:"Excluded by canonical", pages:15, note:"Duplicate of another page" },
    { state:"Blocked by robots.txt", pages:9, note:"Intentional" },
    { state:"Server error", pages:2, note:"Needs a fix" }
  ],
  issues: [
    { what:"Tracking gap on /pricing", sev:"High",   when:"8 Sep 14:02", detail:"42 minutes with no events after a deploy" },
    { what:"Schema mismatch on checkout_start", sev:"Medium", when:"12 Sep", detail:"value sent as string on 2.4% of events" },
    { what:"Bot traffic above threshold", sev:"Low", when:"16 Sep", detail:"3.8% filtered, up from 2.1%" }
  ],
  alerts: [
    { metric:"Conversion rate", rule:"drops below 1.80% over 24 h", fired:"18 Sep 11:20", value:"1.74%", sev:"High", state:"Open" },
    { metric:"Sessions", rule:"anomaly, 3 sigma", fired:"14 Sep 08:05", value:"+38%", sev:"Low", state:"Acknowledged" },
    { metric:"LCP mobile", rule:"above 2.5 s over 7 days", fired:"11 Sep 19:44", value:"2.8 s", sev:"Medium", state:"Open" },
    { metric:"Bot share", rule:"above 3.0%", fired:"16 Sep 06:12", value:"3.8%", sev:"Low", state:"Resolved" }
  ],
  reports: [
    { name:"Weekly traffic summary", freq:"Every Monday 08:00", to:"team@larkfield.io", fmt:"PDF", next:"22 Sep", on:true },
    { name:"Acquisition report", freq:"Monthly, first day", to:"amara@larkfield.io", fmt:"XLSX", next:"01 Oct", on:true },
    { name:"Conversion report", freq:"Every Friday 17:00", to:"growth@larkfield.io", fmt:"CSV", next:"19 Sep", on:true },
    { name:"AI visibility", freq:"Every Monday 08:00", to:"amara@larkfield.io", fmt:"PDF", next:"22 Sep", on:false },
    { name:"Technical health", freq:"Daily 07:00", to:"eng@larkfield.io", fmt:"CSV", next:"20 Sep", on:true }
  ],
  keys: [
    { name:"Production read", key:"sk_live_••••••••4f21", scopes:"read:reports", used:"11 min ago", made:"04 Mar" },
    { name:"Warehouse sync",  key:"sk_live_••••••••9ac7", scopes:"read:events read:reports", used:"2 h ago", made:"18 Jun" },
    { name:"Staging",         key:"sk_test_••••••••1d90", scopes:"read:reports write:events", used:"yesterday", made:"02 Aug" }
  ],
  hooks: [
    { url:"https://hooks.larkfield.io/signal", events:"conversion, alert", ok:99.8, last:"4 min ago" },
    { url:"https://api.larkfield.io/v1/analytics", events:"report.ready", ok:100, last:"today 08:00" }
  ],
  integrations: [
    { name:"Search Console", state:"Connected", detail:"Query data since 04 Mar" },
    { name:"Warehouse export", state:"Connected", detail:"Daily at 02:00" },
    { name:"CRM", state:"Connected", detail:"Conversions pushed on submit" },
    { name:"Ad platform", state:"Not connected", detail:"Needed for spend and ROAS" },
    { name:"Slack", state:"Connected", detail:"Alerts to #analytics" },
    { name:"Spreadsheet sync", state:"Not connected", detail:"Scheduled export to a sheet" }
  ],
  roles: [
    { cap:"View reports",        Owner:1, Admin:1, Analyst:1, Viewer:1 },
    { cap:"Create segments",     Owner:1, Admin:1, Analyst:1, Viewer:0 },
    { cap:"Schedule reports",    Owner:1, Admin:1, Analyst:1, Viewer:0 },
    { cap:"Edit tracking",       Owner:1, Admin:1, Analyst:0, Viewer:0 },
    { cap:"Manage API keys",     Owner:1, Admin:1, Analyst:0, Viewer:0 },
    { cap:"Invite members",      Owner:1, Admin:1, Analyst:0, Viewer:0 },
    { cap:"Delete property",     Owner:1, Admin:0, Analyst:0, Viewer:0 }
  ],
  sessionsOf: [
    { when:"19 Sep 09:41", pages:6, dur:412, entry:"/compare/alternatives", goal:"Purchase" },
    { when:"17 Sep 20:14", pages:4, dur:236, entry:"/pricing", goal:null },
    { when:"14 Sep 11:02", pages:9, dur:688, entry:"/docs/getting-started", goal:"Trial started" },
    { when:"09 Sep 08:47", pages:2, dur:74,  entry:"/blog/analytics-without-cookies", goal:null },
    { when:"02 Sep 19:30", pages:3, dur:158, entry:"/", goal:null }
  ],
  notifications: [
    { title:"Conversion rate alert", body:"Dropped to 1.74% over the last 24 hours", when:"2 h ago", unread:true },
    { title:"Weekly traffic summary", body:"Ready to download", when:"Mon 08:00", unread:true },
    { title:"Jonas shared a segment", body:"AI referrals, now available to the workspace", when:"Tue", unread:false },
    { title:"Tracking verified", body:"Snippet responding on all 1,842 pages", when:"8 Sep", unread:false }
  ],
  scroll: [ {d:"25%", v:92.4}, {d:"50%", v:71.8}, {d:"75%", v:48.2}, {d:"100%", v:27.6} ],
  clicks: [
    { el:"Start free trial, hero", n:18420 }, { el:"Pricing, nav", n:14260 },
    { el:"Compare plans", n:9840 }, { el:"Read the docs", n:6480 }, { el:"Book a demo", n:3120 }
  ]
});

Object.assign(window.SIGNAL_DATA, {
  organic: [
    { q:"web analytics without cookies", clicks:8420, impr:142800, ctr:5.9, pos:3.2, delta:18.4 },
    { q:"google analytics alternative",  clicks:6180, impr:198400, ctr:3.1, pos:6.8, delta:24.1 },
    { q:"privacy friendly analytics",    clicks:4960, impr:88600,  ctr:5.6, pos:4.1, delta:9.6 },
    { q:"server side tracking guide",    clicks:3240, impr:61200,  ctr:5.3, pos:5.4, delta:-4.2 },
    { q:"utm parameters best practice",  clicks:2880, impr:74100,  ctr:3.9, pos:8.2, delta:12.8 },
    { q:"cohort retention analysis",     clicks:2140, impr:39800,  ctr:5.4, pos:4.8, delta:31.2 },
    { q:"core web vitals monitoring",    clicks:1620, impr:52400,  ctr:3.1, pos:9.6, delta:-11.4 },
    { q:"event tracking schema",         clicks:1180, impr:28900,  ctr:4.1, pos:7.1, delta:6.2 }
  ],
  positions: [
    { name:"1 to 3", clicks:14820 }, { name:"4 to 10", clicks:11260 },
    { name:"11 to 20", clicks:3840 }, { name:"21 to 50", clicks:1420 }, { name:"51 plus", clicks:249 }
  ],
  slowest: [
    { path:"/blog/analytics-without-cookies", lcp:"3.4 s", inp:"212 ms", cls:"0.14", n:4820 },
    { path:"/customers",                      lcp:"3.1 s", inp:"188 ms", cls:"0.09", n:1640 },
    { path:"/features",                       lcp:"2.8 s", inp:"164 ms", cls:"0.06", n:6180 },
    { path:"/pricing",                        lcp:"2.2 s", inp:"142 ms", cls:"0.04", n:9420 },
    { path:"/docs/getting-started",           lcp:"1.9 s", inp:"128 ms", cls:"0.02", n:5240 }
  ]
});
