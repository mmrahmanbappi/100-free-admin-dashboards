/* Signal - all behaviour. One namespace, no dependencies except Chart.js. */
(function (D) {
  "use strict";

  var S = window.SIGNAL = {
    state: { range: "Last 30 days", compare: "Previous period", granularity: "Day", segments: ["All visitors"] },
    charts: {},
    live: null
  };

  /* ---------- formatters ---------- */
  var nf = new Intl.NumberFormat("en-US");
  S.formatNumber = function (n) {
    if (n === null || n === undefined) return "-";
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (Math.abs(n) >= 1e4) return (n / 1e3).toFixed(1) + "k";
    return nf.format(Math.round(n * 100) / 100);
  };
  S.formatFull = function (n) { return nf.format(Math.round(n)); };
  S.formatAxis = function (v) {
    if (Math.abs(v) >= 1e6) return (Math.round(v / 1e5) / 10) + "M";
    if (Math.abs(v) >= 1000) return (Math.round(v / 100) / 10) + "k";
    return nf.format(v);
  };
  S.formatCurrency = function (v) { return D.settings.currency + S.formatNumber(v); };
  S.formatDuration = function (s) {
    var m = Math.floor(s / 60), r = Math.round(s % 60);
    return m + "m " + (r < 10 ? "0" : "") + r + "s";
  };
  S.formatMetric = function (m) {
    switch (m.unit) {
      case "money": return S.formatCurrency(m.value);
      case "duration": return S.formatDuration(m.value);
      case "rate": case "pp": return m.value.toFixed(2) + "%";
      case "decimal": return m.value.toFixed(2);
      default: return S.formatNumber(m.value);
    }
  };
  S.formatDelta = function (v, invert, pp) {
    var good = invert ? v < 0 : v > 0;
    var sign = v > 0 ? "+" : "";
    return {
      text: sign + v.toFixed(v % 1 === 0 ? 0 : 1) + (pp ? "pp" : "%"),
      cls: v === 0 ? "" : good ? "stat-delta--up" : "stat-delta--down",
      up: v > 0
    };
  };
  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  S.token = token;

  /* ---------- toasts ---------- */
  var ICONS = {
    ok: '<path d="M20 6 9 17l-5-5"/>',
    err: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4m0-4h.01"/>'
  };
  S.toast = function (msg, type) {
    type = type || "ok";
    var host = document.getElementById("toasts");
    if (!host) return;
    var el = document.createElement("div");
    el.className = "toast toast--" + type;
    el.setAttribute("role", "status");
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + ICONS[type] + "</svg><span></span>";
    el.querySelector("span").textContent = msg;
    host.appendChild(el);
    setTimeout(function () { el.remove(); }, 3200);
  };
  S.copy = function (text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    S.toast("Copied to clipboard");
  };

  /* ---------- theme ---------- */
  S.toggleTheme = function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("signal.theme", next); } catch (e) {}
    S.rebuildCharts();
    document.querySelectorAll("[data-spark]").forEach(drawSpark);
  };

  /* ---------- sidebar ---------- */
  S.toggleSidebar = function () {
    var on = document.body.classList.toggle("is-collapsed");
    try { localStorage.setItem("signal.rail", on ? "1" : "0"); } catch (e) {}
    setTimeout(S.resizeCharts, 220);
  };
  S.toggleMobileNav = function () {
    var on = document.body.classList.toggle("nav-open");
    document.getElementById("backdrop").classList.toggle("is-open", on);
  };

  /* ---------- overlays ---------- */
  var lastFocus = null;
  function trap(panel) {
    var f = panel.querySelectorAll('a[href],button:not(:disabled),input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    f[0].focus();
  }
  S.openModal = function (id) {
    var m = document.getElementById(id); if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add("is-open");
    document.getElementById("backdrop").classList.add("is-open");
    trap(m.querySelector(".modal-panel"));
  };
  S.closeModal = function (id) {
    var m = id ? document.getElementById(id) : document.querySelector(".modal.is-open");
    if (!m) return;
    m.classList.remove("is-open");
    if (!document.querySelector(".modal.is-open,.drawer.is-open") && !document.body.classList.contains("nav-open"))
      document.getElementById("backdrop").classList.remove("is-open");
    if (lastFocus) lastFocus.focus();
  };
  S.openDrawer = function (id) {
    var d = document.getElementById(id); if (!d) return;
    lastFocus = document.activeElement;
    d.classList.add("is-open");
    document.getElementById("backdrop").classList.add("is-open");
    trap(d);
  };
  S.closeDrawer = function (id) {
    var d = id ? document.getElementById(id) : document.querySelector(".drawer.is-open");
    if (!d) return;
    d.classList.remove("is-open");
    if (!document.querySelector(".modal.is-open")) document.getElementById("backdrop").classList.remove("is-open");
    if (lastFocus) lastFocus.focus();
  };
  function closePopovers(except) {
    document.querySelectorAll(".popover.is-open").forEach(function (p) {
      if (p !== except) {
        p.classList.remove("is-open");
        var t = document.querySelector('[aria-controls="' + p.id + '"]');
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  }
  S.togglePopover = function (btn) {
    var p = document.getElementById(btn.getAttribute("aria-controls"));
    if (!p) return;
    var open = !p.classList.contains("is-open");
    closePopovers(p);
    p.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) return;
    var r = btn.getBoundingClientRect(), w = p.offsetWidth, h = p.offsetHeight, m = 8;
    var left = btn.hasAttribute("data-pop-start") ? r.left : r.right - w;
    left = Math.max(m, Math.min(left, window.innerWidth - w - m));
    var top = r.bottom + 6;
    if (top + h > window.innerHeight - m) top = Math.max(m, r.top - h - 6);
    p.style.left = left + "px";
    p.style.top = top + "px";
  };
  window.addEventListener("scroll", function () { closePopovers(); }, true);

  /* ---------- command palette ---------- */
  var PAGES = [
    ["Dashboard", "index.html"], ["Real time", "realtime.html"], ["Audience", "audience.html"],
    ["Geography", "geography.html"], ["Devices and tech", "devices.html"],
    ["Channels", "acquisition.html"], ["Organic search", "organic-search.html"],
    ["AI assistants", "ai-referrals.html"], ["Referrers", "referrals.html"],
    ["Campaigns", "campaigns.html"], ["Pages", "pages.html"], ["Site search", "site-search.html"],
    ["Events", "events.html"], ["User flows", "flows.html"], ["Funnels", "funnels.html"],
    ["Cohorts", "cohorts.html"], ["Conversions", "conversions.html"], ["Attribution", "attribution.html"],
    ["Revenue", "revenue.html"], ["Web vitals", "performance.html"], ["SEO and indexing", "seo-health.html"],
    ["Data health", "data-health.html"], ["Alerts", "alerts.html"], ["Reports", "reports.html"],
    ["Tracking setup", "tracking-setup.html"], ["Team and access", "team.html"], ["Settings", "settings.html"]
  ];
  S.openPalette = function () {
    var p = document.getElementById("palette");
    p.classList.add("is-open");
    var i = p.querySelector(".pal-input"); i.value = ""; paintPalette(""); i.focus();
  };
  S.closePalette = function () { document.getElementById("palette").classList.remove("is-open"); };
  function paintPalette(q) {
    var list = document.querySelector("#palette .pal-list");
    var hits = PAGES.filter(function (p) { return p[0].toLowerCase().indexOf(q.toLowerCase()) > -1; });
    if (!hits.length) {
      list.innerHTML = '<div class="empty"><div class="empty-title">No match</div>' +
        '<div class="empty-body">Try a report name such as cohorts or revenue.</div></div>';
      return;
    }
    list.innerHTML = hits.map(function (p, i) {
      return '<button class="pal-item' + (i === 0 ? " is-on" : "") + '" data-go="' + p[1] + '">' +
        p[0] + '<span class="k mono">' + p[1] + "</span></button>";
    }).join("");
  }

  /* ---------- sparklines (inline SVG, theme aware) ---------- */
  function drawSpark(el) {
    var key = el.getAttribute("data-spark");
    var m = D.metrics[key]; if (!m || !m.series) return;
    var s = m.series, w = 72, h = 26, p = 2;
    var min = Math.min.apply(null, s), max = Math.max.apply(null, s), rng = max - min || 1;
    var pts = s.map(function (v, i) {
      return [(i / (s.length - 1)) * (w - p * 2) + p, h - p - ((v - min) / rng) * (h - p * 2)];
    });
    var line = pts.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" ");
    var area = line + " L" + (w - p) + " " + h + " L" + p + " " + h + " Z";
    var good = m.invert ? m.delta < 0 : m.delta >= 0;
    var c = good ? token("--pos") : token("--neg");
    el.innerHTML = '<svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" aria-hidden="true">' +
      '<path d="' + line + '" fill="none" stroke="' + c + '" stroke-width="1.3" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ---------- charts ---------- */
  S.registerChart = function (id, factory) {
    S.charts[id] = { factory: factory, instance: null };
    build(id);
  };
  function build(id) {
    var rec = S.charts[id], el = document.getElementById(id);
    if (!rec || !el) return;
    if (rec.instance) rec.instance.destroy();
    rec.instance = rec.factory(el.getContext("2d"));
  }
  S.rebuildCharts = function () { Object.keys(S.charts).forEach(build); };
  S.resizeCharts = function () {
    Object.keys(S.charts).forEach(function (k) { if (S.charts[k].instance) S.charts[k].instance.resize(); });
  };
  S.chartBase = function (opts) {
    var grid = token("--border"), tick = token("--text-3");
    var base = {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      animation: { duration: 300 },
      plugins: { legend: { display: false }, tooltip: { enabled: false, external: htmlTip } },
      scales: {
        x: { grid: { display: false, drawBorder: false }, border: { display: false },
             ticks: { color: tick, font: { size: 11, family: "IBM Plex Mono" }, maxRotation: 0, autoSkipPadding: 24,
                      callback: function (v) {
                        var l = this.getLabelForValue ? this.getLabelForValue(v) : v;
                        if (typeof l === "string" && !/^-?[\d.,]+$/.test(l.trim())) return l;
                        return S.formatAxis(v);
                      } } },
        y: { beginAtZero: true, grid: { color: grid, drawBorder: false, drawTicks: false },
             border: { display: false },
             ticks: { color: tick, font: { size: 11, family: "IBM Plex Mono" }, padding: 8,
                      callback: function (v) {
                        var l = this.getLabelForValue ? this.getLabelForValue(v) : v;
                        if (typeof l === "string" && !/^-?[\d.,]+$/.test(l.trim())) return l;
                        return S.formatAxis(v);
                      } } }
      }
    };
    return deepMerge(base, opts || {});
  };
  function deepMerge(a, b) {
    Object.keys(b).forEach(function (k) {
      if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k])) a[k] = deepMerge(a[k] || {}, b[k]);
      else a[k] = b[k];
    });
    return a;
  }
  function htmlTip(ctx) {
    var tip = document.getElementById("tip"), model = ctx.tooltip;
    if (!model || model.opacity === 0) { tip.style.opacity = 0; return; }
    var rows = model.dataPoints.map(function (p) {
      return '<div class="t-r"><span style="display:flex;align-items:center;gap:7px">' +
        '<i style="width:8px;height:8px;border-radius:2px;background:' +
        (p.dataset.borderColor || p.dataset.backgroundColor) + '"></i>' + p.dataset.label + "</span>" +
        '<span class="t-v">' + (p.dataset.fmt ? p.dataset.fmt(p.raw) : S.formatFull(p.raw)) + "</span></div>";
    }).join("");
    tip.innerHTML = '<div class="t-h">' + model.title[0] + "</div>" + rows;
    var r = ctx.chart.canvas.getBoundingClientRect();
    tip.style.opacity = 1;
    tip.style.left = r.left + model.caretX + "px";
    tip.style.top = r.top + model.caretY + "px";
  }

  /* ---------- declarative charts: data-chart="type:source[:opts]" ---------- */
  function seriesFor(spec) {
    var bits = spec.split(":");
    if (bits[0] === "metric") {
      var m = D.metrics[bits[1]];
      return { labels: D.labels30, values: m.series.slice(), unit: m.unit };
    }
    var coll = D[bits[1]] || [], lk = bits[2], vk = bits[3];
    var rows = coll.slice(0, +(bits[4] || 8));
    return { labels: rows.map(function (r) { return r[lk]; }),
             values: rows.map(function (r) { return r[vk]; }) };
  }
  S.initCharts = function () {
    document.querySelectorAll("canvas[data-chart]").forEach(function (cv, n) {
      if (!cv.id) cv.id = "chart-" + n;
      var spec = cv.getAttribute("data-chart").split("|");
      var kind = spec[0], src = spec[1], cmp = cv.hasAttribute("data-compare");
      S.registerChart(cv.id, function (ctx) {
        var d = seriesFor(src);
        var c1 = token("--series-1"), muted = token("--text-3");
        var cols = d.values.map(function (_, i) { return token("--series-" + (i % 8 + 1)); });
        if (kind === "donut") {
          return new Chart(ctx, { type: "doughnut",
            data: { labels: d.labels, datasets: [{ data: d.values, backgroundColor: cols,
                    borderColor: token("--canvas"), borderWidth: 2 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: "64%",
              plugins: { legend: { position: "bottom", labels: { color: token("--text-2"), boxWidth: 9,
                boxHeight: 9, usePointStyle: true, pointStyle: "rect", padding: 14,
                font: { size: 11, family: "IBM Plex Sans" } } } } } });
        }
        if (kind === "hbar") {
          return new Chart(ctx, { type: "bar",
            data: { labels: d.labels, datasets: [{ label: "Value", data: d.values,
                    backgroundColor: c1, borderRadius: 0, barPercentage: .62 }] },
            options: S.chartBase({ indexAxis: "y",
              scales: { y: { grid: { display: false } }, x: { beginAtZero: true } } }) });
        }
        if (kind === "bar") {
          return new Chart(ctx, { type: "bar",
            data: { labels: d.labels, datasets: [{ label: "Value", data: d.values,
                    backgroundColor: c1, borderRadius: 0, barPercentage: .74 }] },
            options: S.chartBase() });
        }
        var sets = [{ label: cv.getAttribute("data-label") || "Value", data: d.values, borderColor: c1,
                      fill: false, tension: .3, borderWidth: 1.6, pointRadius: 0, pointHoverRadius: 3.5 }];
        if (cmp) sets.push({ label: "Previous period", borderColor: muted, borderDash: [3, 4],
                             data: d.values.map(function (v) { return Math.round(v * 0.86); }),
                             fill: false, tension: .3, borderWidth: 1.2, pointRadius: 0 });
        return new Chart(ctx, { type: "line", data: { labels: d.labels, datasets: sets },
                                options: S.chartBase() });
      });
    });
  };

  /* ---------- renderers ---------- */
  var R = {};
  R.rail = function (el) {
    el.innerHTML = el.getAttribute("data-metrics").split(",").map(function (key) {
      var m = D.metrics[key.trim()];
      var d = S.formatDelta(m.delta, m.invert, m.unit === "pp");
      var def = D.definitions[key.trim()] || "";
      return '<div class="stat">' +
        '<div class="stat-label">' + m.label +
          (def ? '<button class="metric-info" type="button" data-def="' + def.replace(/"/g, "&quot;") +
            '" aria-label="What is ' + m.label + '">i</button>' : "") + "</div>" +
        '<div class="stat-value">' + S.formatMetric(m) + "</div>" +
        '<div class="stat-row"><span class="stat-delta ' + d.cls + '">' + arrow(d.up) + d.text + "</span>" +
        '<span class="stat-spark" data-spark="' + key.trim() + '"></span></div></div>';
    }).join("");
  };
  function arrow(up) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" ' +
      'stroke-linejoin="round"><path d="' + (up ? "M12 19V5m0 0-6 6m6-6 6 6" : "M12 5v14m0 0 6-6m-6 6-6-6") + '"/></svg>';
  }
  R.bars = function (el) {
    var src = el.getAttribute("data-bars").split(":");
    var rows = D[src[0]].slice(0, +(src[3] || 8));
    var max = Math.max.apply(null, rows.map(function (r) { return r[src[2]]; }));
    el.innerHTML = rows.map(function (r) {
      return '<div class="bar-row"><span class="lab">' + r[src[1]] + "</span>" +
        '<span class="val">' + S.formatFull(r[src[2]]) + "</span>" +
        '<span class="track"><span class="fill" style="width:' + (r[src[2]] / max * 100).toFixed(1) + '%"></span></span></div>';
    }).join("");
  };
  R.ticker = function (el) {
    el.innerHTML = D.liveFeed.slice(0, 6).map(function (f, i) { return tickerRow(f, i * 7 + 3); }).join("");
  };
  function tickerRow(f, age) {
    return '<div class="ticker-row"><span class="t">' + age + 's</span>' +
      '<span class="w path">' + f.path + "</span>" +
      '<span class="badge">' + f.country + "</span>" +
      '<span class="badge">' + f.device + "</span></div>";
  }
  S.tickerRow = tickerRow;

  R.funnel = function (el) {
    var max = D.funnel[0].value;
    el.innerHTML = D.funnel.map(function (s, i) {
      return '<div class="funnel-step"><span class="lab">' + s.label + "</span>" +
        '<span class="val">' + S.formatFull(s.value) + "</span>" +
        '<span class="funnel-bar" style="width:' + Math.max(4, s.value / max * 100) + "%;opacity:" +
        (1 - i * 0.13).toFixed(2) + '"></span>' +
        (i ? '<span class="drop">-' + s.drop + "% from previous step</span>" : "") + "</div>";
    }).join("");
  };

  /* table renderer: data-table="source" with data-cols JSON */
  R.table = function (el) {
    var rows = D[el.getAttribute("data-table")];
    var cols = JSON.parse(el.getAttribute("data-cols"));
    var pick = el.hasAttribute("data-pick");
    var head = (pick ? '<th style="width:36px"><input class="cbx" type="checkbox" data-all aria-label="Select all rows"></th>' : "") +
      cols.map(function (c) {
        return '<th data-sort="' + c.k + '"' + (c.n ? ' class="col-num"' : "") + ' aria-sort="none">' + c.t + "</th>";
      }).join("");
    var body = rows.map(function (r, i) { return tr(r, cols, pick, i); }).join("");
    el.innerHTML = "<thead><tr>" + head + "</tr></thead><tbody>" + body + "</tbody>";
  };
  function tr(r, cols, pick, i) {
    return "<tr" + (pick ? ' data-id="' + i + '"' : "") + ">" +
      (pick ? '<td><input class="cbx" type="checkbox" data-row aria-label="Select row"></td>' : "") +
      cols.map(function (c) { return "<td" + (c.n ? ' class="col-num"' : "") + ">" + cell(r, c) + "</td>"; }).join("") + "</tr>";
  }
  function cell(r, c) {
    var v = r[c.k];
    switch (c.f) {
      case "path": return '<a class="link path" href="page-detail.html">' + v + "</a>";
      case "num": return S.formatFull(v);
      case "compact": return S.formatNumber(v);
      case "pct": return v === null ? "-" : v.toFixed(2) + "%";
      case "pct1": return v === null ? "-" : v.toFixed(1) + "%";
      case "money": return S.formatCurrency(v);
      case "time": return S.formatDuration(v);
      case "delta":
        var d = S.formatDelta(v, c.invert);
        return '<span class="stat-delta ' + d.cls + '">' + d.text + "</span>";
      case "badge": return '<span class="badge">' + v + "</span>";
      case "strong": return '<span class="strong">' + v + "</span>";
      case "share":
        return '<span class="rowbar"><span class="rowbar-track"><span class="rowbar-fill" style="width:' +
          v + '%"></span></span><span class="rowbar-value">' + v.toFixed(1) + "%</span></span>";
      case "bool":
        return v ? '<span class="badge badge--pos"><i class="status-dot status-dot--pos"></i>Allowed</span>'
                 : '<span class="badge badge--neg"><i class="status-dot status-dot--neg"></i>Blocked</span>';
      case "score":
        var out = "";
        for (var i = 0; i < 4; i++) out += '<i class="status-dot' + (i < v ? " status-dot--pos" : "") +
          '" style="display:inline-block;margin-inline-end:3px"></i>';
        return out;
      default: return v;
    }
  }

  /* ---------- table sorting / bulk ---------- */
  S.initSort = function () {
    document.querySelectorAll("table[data-table]").forEach(function (tbl) {
      tbl.querySelectorAll("th[data-sort]").forEach(function (th, idx) {
        th.addEventListener("click", function () {
          var cur = th.getAttribute("aria-sort");
          var dir = cur === "descending" ? "ascending" : "descending";
          tbl.querySelectorAll("th").forEach(function (o) { o.setAttribute("aria-sort", "none"); });
          th.setAttribute("aria-sort", dir);
          var body = tbl.tBodies[0];
          var offset = tbl.hasAttribute("data-pick") ? 1 : 0;
          var col = Array.prototype.indexOf.call(th.parentNode.children, th);
          var rows = Array.prototype.slice.call(body.rows);
          rows.sort(function (a, b) {
            var x = parse(a.cells[col].textContent), y = parse(b.cells[col].textContent);
            if (x === y) return 0;
            return (dir === "ascending" ? 1 : -1) * (x > y ? 1 : -1);
          });
          rows.forEach(function (r) { body.appendChild(r); });
        });
      });
    });
    function parse(t) {
      var n = parseFloat(t.replace(/[^0-9.\-]/g, ""));
      if (/k$/i.test(t.trim())) n *= 1e3;
      if (/M$/.test(t.trim())) n *= 1e6;
      return isNaN(n) ? t.trim().toLowerCase() : n;
    }
  };
  S.initBulk = function () {
    var bar = document.getElementById("bulkbar");
    if (!bar) return;
    function sync() {
      var picked = document.querySelectorAll("[data-row]:checked");
      bar.classList.toggle("is-open", picked.length > 0);
      bar.querySelector("b").textContent = picked.length;
      document.querySelectorAll("[data-row]").forEach(function (c) {
        c.closest("tr").classList.toggle("is-picked", c.checked);
      });
      var all = document.querySelector("[data-all]");
      if (all) {
        var total = document.querySelectorAll("[data-row]").length;
        all.checked = picked.length === total && total > 0;
        all.indeterminate = picked.length > 0 && picked.length < total;
      }
    }
    document.addEventListener("change", function (e) {
      if (e.target.matches("[data-all]")) {
        document.querySelectorAll("[data-row]").forEach(function (c) { c.checked = e.target.checked; });
        sync();
      } else if (e.target.matches("[data-row]")) sync();
    });
    bar.querySelector("[data-clear]").addEventListener("click", function () {
      document.querySelectorAll("[data-row],[data-all]").forEach(function (c) { c.checked = false; });
      sync();
    });
  };

  /* ---------- control bar ---------- */
  S.setRange = function (label) {
    S.state.range = label;
    document.querySelectorAll("[data-range-label]").forEach(function (e) { e.textContent = label; });
    persist(); S.refresh();
  };
  S.setCompare = function (label) {
    S.state.compare = label;
    document.querySelectorAll("[data-compare-label]").forEach(function (e) { e.textContent = label; });
    persist(); S.refresh();
  };
  S.setGranularity = function (g, btn) {
    S.state.granularity = g;
    if (btn) btn.parentNode.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-pressed", b === btn ? "true" : "false");
    });
    persist(); S.refresh();
  };
  S.addSegment = function (name) {
    if (S.state.segments.indexOf(name) > -1) return;
    if (S.state.segments[0] === "All visitors" && S.state.segments.length === 1) S.state.segments = [];
    S.state.segments.push(name); paintSegments(); persist(); S.refresh();
  };
  S.removeSegment = function (name) {
    S.state.segments = S.state.segments.filter(function (s) { return s !== name; });
    if (!S.state.segments.length) S.state.segments = ["All visitors"];
    paintSegments(); persist(); S.refresh();
  };
  function paintSegments() {
    var host = document.querySelector("[data-segments]");
    if (!host) return;
    host.innerHTML = S.state.segments.map(function (s) {
      return '<span class="chip' + (s === "All visitors" ? "" : " chip--on") + '">' + s +
        (s === "All visitors" ? "" :
          '<button type="button" aria-label="Remove ' + s + ' segment" data-seg-off="' + s + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">' +
          '<path d="M18 6 6 18M6 6l12 12"/></svg></button>') + "</span>";
    }).join("");
  }
  function persist() {
    try { sessionStorage.setItem("signal.state", JSON.stringify(S.state)); } catch (e) {}
    var q = new URLSearchParams({ range: S.state.range, compare: S.state.compare, g: S.state.granularity });
    history.replaceState(null, "", "?" + q.toString());
  }
  S.refresh = function () {
    var cards = document.querySelectorAll(".card[data-live-refresh]");
    cards.forEach(function (c) { c.classList.add("is-busy"); });
    var stamp = document.querySelector("[data-stamp]");
    if (stamp) stamp.textContent = "Updating";
    setTimeout(function () {
      cards.forEach(function (c) { c.classList.remove("is-busy"); });
      if (stamp) stamp.textContent = "Updated just now";
      S.rebuildCharts();
    }, 380 + Math.random() * 220);
  };

  /* ---------- live mode ---------- */
  S.startLive = function () {
    if (S.live) return;
    var el = document.querySelector("[data-live-count]");
    S.live = setInterval(function () {
      if (el) {
        var cur = parseInt(el.textContent.replace(/\D/g, ""), 10);
        var next = Math.max(900, Math.min(1600, cur + Math.round((Math.random() - 0.48) * 34)));
        el.textContent = S.formatFull(next);
        document.querySelectorAll("[data-live-pill]").forEach(function (p) { p.textContent = S.formatFull(next); });
      }
      var feed = document.querySelector("[data-live-ticker]");
      if (feed) {
        var f = D.liveFeed[Math.floor(Math.random() * D.liveFeed.length)];
        feed.insertAdjacentHTML("afterbegin", tickerRow(f, 1));
        while (feed.children.length > 12) feed.removeChild(feed.lastChild);
      }
      var c = S.charts.liveChart;
      if (c && c.instance) {
        var ds = c.instance.data.datasets[0];
        ds.data.push(Math.round(28 + Math.random() * 22));
        ds.data.shift();
        c.instance.update("none");
      }
    }, 5000);
    document.querySelectorAll("[data-live-toggle]").forEach(function (b) { b.textContent = "Pause"; });
  };
  S.stopLive = function () {
    clearInterval(S.live); S.live = null;
    document.querySelectorAll("[data-live-toggle]").forEach(function (b) { b.textContent = "Resume"; });
  };
  S.toggleLive = function () { S.live ? S.stopLive() : S.startLive(); };

  /* ---------- tooltips for metric definitions ---------- */
  function initDefs() {
    var tip = document.getElementById("tip");
    document.addEventListener("mouseover", function (e) {
      var b = e.target.closest("[data-def]");
      if (!b) return;
      tip.innerHTML = '<div style="font-size:12px;color:var(--text-2);max-width:230px;line-height:1.5">' +
        b.getAttribute("data-def") + "</div>";
      var r = b.getBoundingClientRect();
      tip.style.opacity = 1;
      tip.style.left = r.left + r.width / 2 + "px";
      tip.style.top = r.top + "px";
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("[data-def]")) tip.style.opacity = 0;
    });
  }

  function paintNotifications() {
    var host = document.querySelector("[data-notifications]");
    if (!host) return;
    host.innerHTML = '<div class="pop-head">Notifications</div>' +
      D.notifications.map(function (n) {
        return '<button class="pop-note' + (n.unread ? " unread" : "") + '" data-act="toast" data-val="' +
          n.title + ' opened"><b>' + n.title + "</b><span>" + n.body + "</span><i>" + n.when + "</i></button>";
      }).join("") +
      '<div class="pop-foot"><button class="btn btn--quiet btn--sm" data-act="toast" data-val="All notifications marked read">Mark all read</button>' +
      '<a class="btn btn--quiet btn--sm" href="alerts.html">Alert rules</a></div>';
    var unread = D.notifications.filter(function (n) { return n.unread; }).length;
    document.querySelectorAll("[data-unread]").forEach(function (e) {
      e.style.display = unread ? "" : "none";
    });
  }

  /* ---------- boot ---------- */
  S.init = function () {
    try {
      var t = localStorage.getItem("signal.theme");
      if (t) document.documentElement.setAttribute("data-theme", t);
      if (localStorage.getItem("signal.rail") === "1") document.body.classList.add("is-collapsed");
      var st = sessionStorage.getItem("signal.state");
      if (st) S.state = JSON.parse(st);
    } catch (e) {}

    document.querySelectorAll("[data-metrics]").forEach(R.rail);
    document.querySelectorAll("[data-bars]").forEach(R.bars);
    document.querySelectorAll("[data-table]").forEach(R.table);
    document.querySelectorAll("[data-ticker]").forEach(R.ticker);
    document.querySelectorAll("[data-funnel]").forEach(R.funnel);
    document.querySelectorAll("[data-spark]").forEach(drawSpark);
    paintNotifications();
    if (window.Chart) S.initCharts();
    document.querySelectorAll("[data-range-label]").forEach(function (e) { e.textContent = S.state.range; });
    document.querySelectorAll("[data-compare-label]").forEach(function (e) { e.textContent = S.state.compare; });
    paintSegments();
    S.initSort(); S.initBulk(); initDefs();
    document.addEventListener("change", function (e) {
      if (e.target.matches(".switch[data-label]"))
        S.toast(e.target.getAttribute("data-label") + (e.target.checked ? " turned on" : " turned off"));
      if (e.target.matches(".select[data-label]"))
        S.toast(e.target.getAttribute("data-label") + ": " + e.target.value);
    });

    /* delegated clicks */
    document.addEventListener("click", function (e) {
      var t = e.target;
      var pop = t.closest("[aria-controls]");
      if (pop && pop.hasAttribute("aria-expanded")) { e.preventDefault(); S.togglePopover(pop); return; }
      if (!t.closest(".popover")) closePopovers();

      var act = t.closest("[data-act]");
      if (act) {
        var a = act.getAttribute("data-act"), v = act.getAttribute("data-val");
        if (a === "theme") S.toggleTheme();
        if (a === "collapse") S.toggleSidebar();
        if (a === "mobnav") S.toggleMobileNav();
        if (a === "palette") S.openPalette();
        if (a === "range") { S.setRange(v); closePopovers(); }
        if (a === "compare") { S.setCompare(v); closePopovers(); }
        if (a === "gran") S.setGranularity(v, act);
        if (a === "segment") { S.addSegment(v); closePopovers(); }
        if (a === "modal") S.openModal(v);
        if (a === "drawer") S.openDrawer(v);
        if (a === "close-modal") S.closeModal(v);
        if (a === "close-drawer") S.closeDrawer(v);
        if (a === "copy") S.copy(v || act.getAttribute("data-copy"));
        if (a === "toast") S.toast(v);
        if (a === "refresh") S.refresh();
        if (a === "live") S.toggleLive();
        if (a === "share") S.copy(location.href);
        if (a === "print") window.print();
        if (a === "nav-to") location.href = v;
        if (a === "export") { S.closeModal(); S.toast("Export queued, you will get an email when it is ready"); }
        if (a === "busy") {
          act.classList.add("is-loading");
          setTimeout(function () { act.classList.remove("is-loading"); S.toast(act.getAttribute("data-done") || "Done"); }, 900);
        }
      }
      var off = t.closest("[data-seg-off]");
      if (off) S.removeSegment(off.getAttribute("data-seg-off"));
      var go = t.closest("[data-go]");
      if (go) location.href = go.getAttribute("data-go");
      if (t.id === "backdrop") {
        S.closeModal(); S.closeDrawer();
        if (document.body.classList.contains("nav-open")) S.toggleMobileNav();
      }
      var leg = t.closest(".leg");
      if (leg) {
        var chart = S.charts[leg.getAttribute("data-chart")];
        if (chart && chart.instance) {
          var i = +leg.getAttribute("data-i");
          var meta = chart.instance.getDatasetMeta(i);
          meta.hidden = meta.hidden === null ? !chart.instance.data.datasets[i].hidden : null;
          leg.classList.toggle("is-off");
          chart.instance.update();
        }
      }
    });

    /* palette input */
    var pal = document.getElementById("palette");
    if (pal) {
      pal.querySelector(".pal-input").addEventListener("input", function (e) { paintPalette(e.target.value); });
      pal.addEventListener("keydown", function (e) {
        var items = Array.prototype.slice.call(pal.querySelectorAll(".pal-item"));
        var i = items.findIndex(function (x) { return x.classList.contains("is-on"); });
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!items.length) return;
          items[i] && items[i].classList.remove("is-on");
          i = (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
          items[i].classList.add("is-on");
          items[i].scrollIntoView({ block: "nearest" });
        }
        if (e.key === "Enter" && items[i]) location.href = items[i].getAttribute("data-go");
      });
      pal.addEventListener("click", function (e) { if (e.target === pal) S.closePalette(); });
    }

    document.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches('[role="button"][data-act]')) {
        e.preventDefault(); e.target.click(); return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); S.openPalette(); return; }
      if (e.key !== "Escape") return;
      if (document.getElementById("palette").classList.contains("is-open")) return S.closePalette();
      if (document.querySelector(".modal.is-open")) return S.closeModal();
      if (document.querySelector(".drawer.is-open")) return S.closeDrawer();
      if (document.querySelector(".popover.is-open")) return closePopovers();
      if (document.body.classList.contains("nav-open")) S.toggleMobileNav();
    });

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (window.innerWidth > 640 && document.body.classList.contains("nav-open")) S.toggleMobileNav();
        S.resizeCharts();
      }, 200);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && S.live) { clearInterval(S.live); S.live = null; }
      else if (!document.hidden && document.querySelector("[data-live-count]") && !S.live) S.startLive();
    });
  };

  document.addEventListener("DOMContentLoaded", S.init);
})(window.SIGNAL_DATA);
