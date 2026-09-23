/* Shelf - all behaviour. One namespace. Chart.js is the only dependency. */
(function (D) {
  "use strict";

  var S = window.SHELF = {
    state: { range: "Last 30 days", compare: "Previous period", channel: "All channels" },
    charts: {}, live: null
  };
  var nf = new Intl.NumberFormat("en-US");
  var CUR = D.settings.currency;

  /* ============================ formatters ============================ */
  S.int = function (n) { return nf.format(Math.round(n)); };
  var nf2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  S.money = function (v) {
    var neg = v < 0, r = Math.round(Math.abs(v) * 100) / 100;
    /* totals read cleaner without cents, line items need them */
    return (neg ? "-" : "") + CUR + (r >= 1000 ? nf.format(Math.round(r)) : nf2.format(r));
  };
  S.compact = function (n) {
    if (Math.abs(n) >= 1e6) return (Math.round(n / 1e5) / 10) + "M";
    if (Math.abs(n) >= 1e4) return (Math.round(n / 100) / 10) + "k";
    return nf.format(Math.round(n));
  };
  S.axis = function (v) {
    if (Math.abs(v) >= 1e6) return CUR + (Math.round(v / 1e5) / 10) + "M";
    if (Math.abs(v) >= 1000) return (Math.round(v / 100) / 10) + "k";
    return nf.format(v);
  };
  S.metricValue = function (m) {
    switch (m.unit) {
      case "money": return S.money(m.value);
      case "pp": case "rate": return m.value.toFixed(m.value % 1 ? 1 : 0) + "%";
      default: return S.int(m.value);
    }
  };
  S.delta = function (v, invert, pp) {
    var good = invert ? v < 0 : v > 0;
    return {
      text: (v > 0 ? "+" : "") + (Math.abs(v) % 1 ? v.toFixed(1) : v) + (pp ? "pp" : "%"),
      cls: v === 0 ? "" : good ? "delta--up" : "delta--down",
      down: v < 0
    };
  };
  function token(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  S.token = token;
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }

  /* ============================== toasts ============================== */
  var TI = {
    ok: '<path d="M20 6 9 17l-5-5"/>',
    err: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4m0-4h.01"/>'
  };
  S.toast = function (msg, type) {
    type = type || "ok";
    var host = document.getElementById("toasts"); if (!host) return;
    var el = document.createElement("div");
    el.className = "toast"; el.setAttribute("role", "status");
    el.innerHTML = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">' +
      TI[type] + "</svg><span></span>";
    el.querySelector("span").textContent = msg;
    host.appendChild(el);
    setTimeout(function () { el.remove(); }, 3200);
  };
  S.copy = function (t) { if (navigator.clipboard) navigator.clipboard.writeText(t); S.toast("Copied to clipboard"); };

  /* ============================== theme =============================== */
  S.toggleTheme = function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("shelf.theme", next); } catch (e) {}
    S.rebuildCharts();
    document.querySelectorAll("[data-spark]").forEach(spark);
    S.toast(next === "dark" ? "Dark theme on" : "Light theme on", "info");
  };
  S.toggleNav = function () {
    var on = document.body.classList.toggle("is-min");
    try { localStorage.setItem("shelf.min", on ? "1" : "0"); } catch (e) {}
    setTimeout(S.resizeCharts, 240);
  };
  S.toggleMobileNav = function () {
    var on = document.body.classList.toggle("nav-open");
    document.getElementById("backdrop").classList.toggle("is-open", on);
  };

  /* ============================= overlays ============================= */
  var lastFocus = null;
  function trap(panel) {
    var f = panel.querySelectorAll('a[href],button:not(:disabled),input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    f[0].focus();
  }
  function anyOpen() { return document.querySelector(".modal.is-open,.drawer.is-open"); }
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
    if (!anyOpen() && !document.body.classList.contains("nav-open"))
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
    if (!anyOpen() && !document.body.classList.contains("nav-open"))
      document.getElementById("backdrop").classList.remove("is-open");
    if (lastFocus) lastFocus.focus();
  };
  function closePops(except) {
    document.querySelectorAll(".pop.is-open").forEach(function (p) {
      if (p === except) return;
      p.classList.remove("is-open");
      var t = document.querySelector('[aria-controls="' + p.id + '"]');
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }
  S.togglePop = function (btn) {
    var p = document.getElementById(btn.getAttribute("aria-controls")); if (!p) return;
    var open = !p.classList.contains("is-open");
    closePops(p);
    p.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) return;
    var r = btn.getBoundingClientRect(), w = p.offsetWidth, h = p.offsetHeight, m = 8;
    var left = btn.hasAttribute("data-pop-start") ? r.left : r.right - w;
    left = Math.max(m, Math.min(left, window.innerWidth - w - m));
    var top = r.bottom + 7;
    if (top + h > window.innerHeight - m) top = Math.max(m, r.top - h - 7);
    p.style.left = left + "px"; p.style.top = top + "px";
  };
  window.addEventListener("scroll", function () { closePops(); }, true);

  /* ============================== charts ============================== */
  S.registerChart = function (id, factory) { S.charts[id] = { factory: factory, instance: null }; build(id); };
  function build(id) {
    var rec = S.charts[id], el = document.getElementById(id);
    if (!rec || !el || !window.Chart) return;
    if (rec.instance) rec.instance.destroy();
    rec.instance = rec.factory(el.getContext("2d"));
  }
  S.rebuildCharts = function () { Object.keys(S.charts).forEach(build); };
  S.resizeCharts = function () {
    Object.keys(S.charts).forEach(function (k) { if (S.charts[k].instance) S.charts[k].instance.resize(); });
  };
  function merge(a, b) {
    Object.keys(b).forEach(function (k) {
      if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k])) a[k] = merge(a[k] || {}, b[k]);
      else a[k] = b[k];
    });
    return a;
  }
  S.chartBase = function (opts) {
    var grid = token("--line"), tick = token("--ink-3");
    return merge({
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      animation: { duration: 320 },
      plugins: { legend: { display: false }, tooltip: { enabled: false, external: tip } },
      scales: {
        x: { grid: { display: false }, border: { display: false },
             ticks: { color: tick, font: { size: 11, family: "DM Mono" }, maxRotation: 0, autoSkipPadding: 26,
                      callback: label } },
        y: { beginAtZero: true, grid: { color: grid, drawTicks: false }, border: { display: false },
             ticks: { color: tick, font: { size: 11, family: "DM Mono" }, padding: 10, callback: label } }
      }
    }, opts || {});
  };
  function label(v) {
    var l = this.getLabelForValue ? this.getLabelForValue(v) : v;
    if (typeof l === "string" && !/^-?[\d.,]+$/.test(l.trim())) return l;
    return S.axis(v);
  }
  function tip(ctx) {
    var t = document.getElementById("tip"), m = ctx.tooltip;
    if (!m || m.opacity === 0) { t.style.opacity = 0; return; }
    t.innerHTML = '<div class="t-h">' + m.title[0] + "</div>" + m.dataPoints.map(function (p) {
      var c = p.dataset.borderColor || p.dataset.backgroundColor;
      return '<div class="t-r"><span style="display:flex;align-items:center;gap:8px">' +
        '<i style="width:9px;height:9px;border-radius:9px;background:' + c + '"></i>' +
        p.dataset.label + '</span><span class="t-v">' +
        (p.dataset.money ? S.money(p.raw) : S.int(p.raw)) + "</span></div>";
    }).join("");
    var r = ctx.chart.canvas.getBoundingClientRect();
    t.style.opacity = 1;
    t.style.left = r.left + m.caretX + "px";
    t.style.top = r.top + m.caretY + "px";
  }
  function source(spec) {
    var b = spec.split(":");
    if (b[0] === "metric") {
      var m = D.metrics[b[1]];
      return { labels: D.labels30, values: m.series.slice(), money: m.unit === "money" };
    }
    var rows = (D[b[1]] || []).slice(0, +(b[4] || 10));
    return { labels: rows.map(function (r) { return r[b[2]]; }),
             values: rows.map(function (r) { return r[b[3]]; }),
             money: /revenue|spend|value|net|total|gross/i.test(b[3]) };
  }
  S.initCharts = function () {
    document.querySelectorAll("canvas[data-chart]").forEach(function (cv, i) {
      if (!cv.id) cv.id = "chart-" + i;
      var bits = cv.getAttribute("data-chart").split("|");
      var kind = bits[0], spec = bits[1], cmp = cv.hasAttribute("data-compare");
      S.registerChart(cv.id, function (ctx) {
        var d = source(spec), a = token("--series-1"), muted = token("--ink-3");
        var cols = d.values.map(function (_, j) { return token("--series-" + (j % 8 + 1)); });
        if (kind === "donut") return new Chart(ctx, { type: "doughnut",
          data: { labels: d.labels, datasets: [{ data: d.values, backgroundColor: cols,
                  borderColor: token("--surface"), borderWidth: 3, hoverOffset: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: "66%",
            plugins: { legend: { position: "bottom", labels: { color: token("--ink-2"), boxWidth: 9,
              boxHeight: 9, usePointStyle: true, pointStyle: "circle", padding: 16,
              font: { size: 12, family: "Figtree" } } } } } });
        if (kind === "hbar") return new Chart(ctx, { type: "bar",
          data: { labels: d.labels, datasets: [{ label: "Value", data: d.values, money: d.money,
                  backgroundColor: a, borderRadius: 6, barPercentage: .66 }] },
          options: (function () {
            var o = S.chartBase({ indexAxis: "y", scales: { y: { grid: { display: false } }, x: { beginAtZero: true } } });
            if (d.money) o.scales.x.ticks.callback = function (v) { return CUR + S.axis(v); };
            return o;
          })() });
        if (kind === "bar") return new Chart(ctx, { type: "bar",
          data: { labels: d.labels, datasets: [{ label: "Value", data: d.values, money: d.money,
                  backgroundColor: a, borderRadius: 6, barPercentage: .7 }] },
          options: (function () {
            var o = S.chartBase();
            if (d.money) o.scales.y.ticks.callback = function (v) { return CUR + S.axis(v); };
            return o;
          })() });
        var g = ctx.createLinearGradient(0, 0, 0, 260);
        g.addColorStop(0, a + "2E"); g.addColorStop(1, a + "00");
        var base = S.chartBase();
        if (d.money) base.scales.y.ticks.callback = function (v) { return CUR + S.axis(v); };
        var sets = [{ label: cv.getAttribute("data-label") || "Value", data: d.values, money: d.money,
          borderColor: a, backgroundColor: g, fill: kind === "area", tension: .34, borderWidth: 2.6,
          pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: a }];
        if (cmp) sets.push({ label: "Previous period", borderColor: muted, borderDash: [4, 4], money: d.money,
          data: d.values.map(function (v) { return Math.round(v * 0.85); }), fill: false,
          tension: .34, borderWidth: 1.4, pointRadius: 0 });
        return new Chart(ctx, { type: "line", data: { labels: d.labels, datasets: sets }, options: base });
      });
    });
  };

  /* ============================ renderers ============================= */
  function arrow(down) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" ' +
      'stroke-linejoin="round"><path d="' +
      (down ? "M12 5v14m0 0 6-6m-6 6-6-6" : "M12 19V5m0 0-6 6m6-6 6 6") + '"/></svg>';
  }
  function spark(el) {
    var m = D.metrics[el.getAttribute("data-spark")];
    if (!m || !m.series) return;
    var s = m.series, w = 72, h = 26, p = 2;
    var min = Math.min.apply(null, s), max = Math.max.apply(null, s), r = max - min || 1;
    var pts = s.map(function (v, i) {
      return [(i / (s.length - 1)) * (w - p * 2) + p, h - p - ((v - min) / r) * (h - p * 2)];
    });
    var line = pts.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" ");
    var good = m.invert ? m.delta < 0 : m.delta >= 0;
    var c = good ? token("--pos") : token("--neg");
    el.innerHTML = '<svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" aria-hidden="true">' +
      '<path d="' + line + '" fill="none" stroke="' + c + '" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  var R = {};
  R.kpis = function (el) {
    el.innerHTML = el.getAttribute("data-kpis").split(",").map(function (k, i) {
      k = k.trim();
      var m = D.metrics[k], d = S.delta(m.delta, m.invert, m.unit === "pp");
      var def = D.definitions[k];
      return '<div class="kpi"><span class="kpi-lab">' + m.label +
        (def ? ' <button class="info" type="button" data-def="' + esc(def) +
          '" aria-label="What does ' + m.label + ' mean">?</button>' : "") + "</span>" +
        '<span class="kpi-val">' + S.metricValue(m) + "</span>" +
        '<span class="kpi-foot"><span class="delta ' + d.cls + '">' + arrow(d.down) + d.text + "</span>" +
        (m.series ? '<span class="spark" data-spark="' + k + '"></span>' : "") + "</span></div>";
    }).join("");
  };
  R.bars = function (el) {
    var b = el.getAttribute("data-bars").split(":");
    var rows = (D[b[0]] || []).slice(0, +(b[3] || 8));
    var money = /revenue|spend|value|net|total/i.test(b[2]);
    var max = Math.max.apply(null, rows.map(function (r) { return r[b[2]]; })) || 1;
    el.innerHTML = rows.map(function (r) {
      return '<div class="bar-row"><span class="lab">' + r[b[1]] + "</span>" +
        '<span class="val">' + (money ? S.money(r[b[2]]) : S.int(r[b[2]])) + "</span>" +
        '<span class="track"><span class="fill" style="width:' + (r[b[2]] / max * 100).toFixed(1) + '%"></span></span></div>';
    }).join("");
  };
  R.feed = function (el) {
    el.innerHTML = D.liveFeed.slice(0, 7).map(function (f, i) { return feedRow(f, (i * 9 + 4) + "s"); }).join("");
  };
  function initials(s) {
    var w = String(s).trim().split(/\s+/);
    return (w.length > 1 ? w[0][0] + w[1][0] : String(s).slice(0, 2)).toUpperCase();
  }
  S.initials = initials;
  function feedRow(f, age) {
    return '<div class="feed-row"><span class="tile tile--sm" style="background:var(--series-' +
      ((f.who.length + f.what.length) % 6 + 1) + ')">' + initials(f.who) + "</span>" +
      '<span class="txt"><b>' + f.what + "</b><span>" + f.who + " · " + age + " ago</span></span>" +
      '<span class="amt">' + f.amt + "</span></div>";
  }
  S.feedRow = feedRow;
  R.funnel = function (el) {
    var max = D.funnel[0].value;
    el.innerHTML = D.funnel.map(function (s, i) {
      return '<div class="step"><span class="lab">' + s.label + "</span>" +
        '<span class="val">' + S.int(s.value) + "</span>" +
        '<span class="fill" style="width:' + Math.max(5, s.value / max * 100) + "%;opacity:" +
        (1 - i * 0.14).toFixed(2) + '"></span>' +
        (i ? '<span class="drop">-' + s.drop + "% from previous step</span>" : "") + "</div>";
    }).join("");
  };
  R.cohort = function (el) {
    var C = D.cohorts;
    function heat(v) { return v === null ? "" : v >= 90 ? 5 : v >= 44 ? 4 : v >= 32 ? 3 : v >= 24 ? 2 : 1; }
    el.innerHTML = "<thead><tr><th class='lead'>Cohort</th><th class='lead'>Customers</th>" +
      C.columns.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      C.rows.map(function (r) {
        return "<tr><td class='lead cell is-void' style='color:var(--ink-2)'>" + r.label + "</td>" +
          "<td class='lead cell is-void'>" + S.int(r.size) + "</td>" +
          r.values.map(function (v) {
            return v === null ? "<td class='cell is-void'>-</td>"
              : "<td class='cell' data-heat='" + heat(v) + "'>" + v + "%</td>";
          }).join("") + "</tr>";
      }).join("") + "</tbody>";
  };
  R.table = function (el) {
    var rows = D[el.getAttribute("data-table")] || [];
    var cols = JSON.parse(el.getAttribute("data-cols"));
    var pick = el.hasAttribute("data-pick");
    var fkey = el.getAttribute("data-filter-key");
    el.innerHTML = "<thead><tr>" +
      (pick ? '<th style="width:40px"><input class="cbx" type="checkbox" data-all aria-label="Select all rows"></th>' : "") +
      cols.map(function (c) {
        return '<th data-sort="' + c.k + '"' + (c.n ? ' class="n"' : "") + ' aria-sort="none">' + c.t + "</th>";
      }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r, i) {
        return "<tr" + (pick ? ' data-id="' + i + '"' : "") +
          (fkey ? ' data-key="' + esc(r[fkey]) + '"' : "") + ">" +
          (pick ? '<td><input class="cbx" type="checkbox" data-row aria-label="Select row"></td>' : "") +
          cols.map(function (c) { return "<td" + (c.n ? ' class="n"' : "") + ">" + cell(r, c) + "</td>"; }).join("") +
          "</tr>";
      }).join("") + "</tbody>";
  };
  function tile(seed, text, sm) {
    var n = 0; for (var i = 0; i < seed.length; i++) n += seed.charCodeAt(i);
    return '<span class="tile' + (sm ? " tile--sm" : "") + '" style="background:var(--series-' +
      (n % 6 + 1) + ')">' + text + "</span>";
  }
  function cell(r, c) {
    var v = r[c.k];
    switch (c.f) {
      case "product":
        var pn = r.name || v || "";
        return '<a class="prod link" href="product-detail.html">' +
          tile(r.sku || pn, (r.sku ? r.sku.slice(0, 2) : pn.slice(0, 2)).toUpperCase()) +
          '<span class="prod-txt"><b>' + pn + '</b><span class="sku">' + (r.sku || r.cat || "") + "</span></span></a>";
      case "person":
        var nm = v || r.name || "";
        return '<a class="prod link" href="' + (c.href || "customer-detail.html") + '">' +
          tile(nm, r.initials || initials(nm), true) +
          '<span class="prod-txt"><b>' + nm + '</b><span class="sku">' +
          (r.email || r.country || r.role || "") + "</span></span></a>";
      case "link":
        return c.href ? '<a class="link strong" href="' + c.href + '">' + v + "</a>"
                      : '<span class="strong">' + v + "</span>";
      case "num": return S.int(v);
      case "money": return S.money(v);
      case "pct": return v === null ? "-" : v.toFixed(1) + "%";
      case "pct2": return v === null ? "-" : v.toFixed(2) + "%";
      case "pill":
        var tone = c.tone && r[c.tone] ? " pill--" + r[c.tone] : "";
        return '<span class="pill' + tone + '"><i></i>' + v + "</span>";
      case "strong": return '<span class="strong">' + v + "</span>";
      case "sku": return '<span class="sku">' + v + "</span>";
      case "meter":
        var max = c.max || 100;
        return '<span class="meter"><span class="meter-track"><span class="meter-fill" style="width:' +
          Math.min(100, v / max * 100).toFixed(0) + '%"></span></span><span class="meter-val">' +
          (c.money ? S.money(v) : S.int(v)) + "</span></span>";
      case "stars":
        var out = "";
        for (var i = 0; i < 5; i++) out += '<span style="color:var(--' + (i < v ? "warn" : "ink-4") + ')">&#9733;</span>';
        return '<span style="letter-spacing:1px">' + out + "</span>";
      case "yesno": return v ? '<span class="pill pill--ok"><i></i>Yes</span>' : '<span class="pill">No</span>';
      case "score":
        var s = "";
        for (var j = 0; j < 1; j++) s += v ? '<span style="color:var(--pos);font-weight:700">Yes</span>'
                                           : '<span style="color:var(--ink-4)">No</span>';
        return s;
      case "delta":
        var d = S.delta(v, c.invert);
        return '<span class="delta ' + d.cls + '">' + d.text + "</span>";
      default: return v === null || v === undefined ? "-" : v;
    }
  }

  /* ====================== sort, filter, search, bulk ================== */
  S.initSort = function () {
    document.querySelectorAll("table[data-table]").forEach(function (t) {
      t.querySelectorAll("th[data-sort]").forEach(function (th) {
        th.addEventListener("click", function () {
          var dir = th.getAttribute("aria-sort") === "descending" ? "ascending" : "descending";
          t.querySelectorAll("th").forEach(function (o) { o.setAttribute("aria-sort", "none"); });
          th.setAttribute("aria-sort", dir);
          var col = Array.prototype.indexOf.call(th.parentNode.children, th);
          var body = t.tBodies[0], rows = Array.prototype.slice.call(body.rows);
          rows.sort(function (a, b) {
            var x = val(a.cells[col].textContent), y = val(b.cells[col].textContent);
            return x === y ? 0 : (dir === "ascending" ? 1 : -1) * (x > y ? 1 : -1);
          });
          rows.forEach(function (r) { body.appendChild(r); });
        });
      });
    });
    function val(t) {
      var n = parseFloat(String(t).replace(/[^0-9.\-]/g, ""));
      if (/k\b/i.test(t)) n *= 1e3;
      if (/M\b/.test(t)) n *= 1e6;
      return isNaN(n) ? String(t).trim().toLowerCase() : n;
    }
  };
  function tableOf(el) {
    var card = el.closest(".card") || document;
    return card.querySelector("table[data-table]");
  }
  function applyFilters(card) {
    var t = card.querySelector("table[data-table]"); if (!t) return;
    var chip = card.querySelector('[data-filter][aria-pressed="true"]');
    var want = chip ? chip.getAttribute("data-filter") : "all";
    var box = card.querySelector("[data-search]");
    var q = box ? box.value.trim().toLowerCase() : "";
    var shown = 0, total = t.tBodies[0].rows.length;
    Array.prototype.forEach.call(t.tBodies[0].rows, function (r) {
      if (r.classList.contains("empty-row")) return;
      var okF = want === "all" || r.getAttribute("data-key") === want;
      var okQ = !q || r.textContent.toLowerCase().indexOf(q) > -1;
      r.hidden = !(okF && okQ);
      if (!r.hidden) shown++;
    });
    var old = t.querySelector(".empty-row");
    if (old) old.remove();
    if (!shown) {
      var cols = t.tHead.rows[0].cells.length;
      var tr = document.createElement("tr");
      tr.className = "empty-row";
      tr.innerHTML = '<td colspan="' + cols + '">Nothing matches this filter. Clear the search or pick another status.</td>';
      t.tBodies[0].appendChild(tr);
    }
    var count = card.querySelector("[data-count]");
    if (count) count.textContent = shown === total
      ? S.int(total) + " of " + S.int(total)
      : S.int(shown) + " of " + S.int(total);
  }
  S.initFilters = function () {
    document.querySelectorAll("[data-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var card = chip.closest(".card");
        card.querySelectorAll("[data-filter]").forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        applyFilters(card);
      });
    });
    document.querySelectorAll("[data-search]").forEach(function (box) {
      box.addEventListener("input", function () { applyFilters(box.closest(".card")); });
    });
    document.querySelectorAll(".card").forEach(function (c) {
      if (c.querySelector("[data-filter],[data-search],[data-count]")) applyFilters(c);
    });
  };
  S.initBulk = function () {
    var bar = document.getElementById("bulkbar"); if (!bar) return;
    function sync() {
      var picked = document.querySelectorAll("[data-row]:checked");
      bar.classList.toggle("is-open", picked.length > 0);
      bar.querySelector("b").textContent = picked.length;
      document.querySelectorAll("[data-row]").forEach(function (c) {
        c.closest("tr").classList.toggle("is-picked", c.checked);
      });
      var all = document.querySelector("[data-all]");
      if (all) {
        var rows = Array.prototype.filter.call(document.querySelectorAll("[data-row]"),
          function (c) { return !c.closest("tr").hidden; });
        all.checked = picked.length === rows.length && rows.length > 0;
        all.indeterminate = picked.length > 0 && picked.length < rows.length;
      }
    }
    S.syncBulk = sync;
    bar.querySelector("[data-clear]").addEventListener("click", function () {
      document.querySelectorAll("[data-row],[data-all]").forEach(function (c) {
        c.checked = false; c.indeterminate = false;
      });
      sync();
    });
  };
  S.initTabs = function () {
    document.querySelectorAll("[data-tabs]").forEach(function (host) {
      host.querySelectorAll(".tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
          var id = tab.getAttribute("data-tab");
          host.querySelectorAll(".tab").forEach(function (t) {
            t.classList.toggle("is-on", t === tab);
            t.setAttribute("aria-selected", t === tab ? "true" : "false");
          });
          host.parentNode.querySelectorAll(".tab-panel").forEach(function (p) {
            p.classList.toggle("is-on", p.id === id);
          });
          S.resizeCharts();
        });
      });
    });
  };

  /* ============================ control bar =========================== */
  S.setRange = function (v) {
    S.state.range = v;
    document.querySelectorAll("[data-range-label]").forEach(function (e) { e.textContent = v; });
    persist(); S.refresh();
  };
  S.setCompare = function (v) {
    S.state.compare = v;
    document.querySelectorAll("[data-compare-label]").forEach(function (e) { e.textContent = v; });
    persist(); S.refresh();
  };
  S.setChannel = function (v) {
    S.state.channel = v;
    document.querySelectorAll("[data-channel-label]").forEach(function (e) { e.textContent = v; });
    persist(); S.refresh();
  };
  function persist() {
    try { sessionStorage.setItem("shelf.state", JSON.stringify(S.state)); } catch (e) {}
    history.replaceState(null, "", "?" + new URLSearchParams(S.state).toString());
  }
  S.refresh = function () {
    var cards = document.querySelectorAll(".card[data-refresh]");
    cards.forEach(function (c) { c.classList.add("is-busy-card"); });
    var stamp = document.querySelector("[data-stamp]");
    if (stamp) stamp.textContent = "Updating";
    setTimeout(function () {
      cards.forEach(function (c) { c.classList.remove("is-busy-card"); });
      if (stamp) stamp.textContent = "Updated just now";
      S.rebuildCharts();
    }, 360 + Math.random() * 220);
  };

  /* ============================== live ================================ */
  S.startLive = function () {
    if (S.live) return;
    S.live = setInterval(function () {
      var feed = document.querySelector("[data-live-feed]");
      if (feed) {
        var f = D.liveFeed[Math.floor(Math.random() * D.liveFeed.length)];
        feed.insertAdjacentHTML("afterbegin", feedRow(f, "1s"));
        while (feed.children.length > 12) feed.removeChild(feed.lastChild);
      }
      var el = document.querySelector("[data-live-count]");
      if (el) {
        var cur = parseInt(el.textContent.replace(/\D/g, ""), 10);
        el.textContent = S.int(Math.max(40, Math.min(180, cur + Math.round((Math.random() - 0.45) * 6))));
      }
    }, 5000);
    document.querySelectorAll("[data-live-toggle]").forEach(function (b) { b.textContent = "Pause"; });
  };
  S.stopLive = function () {
    clearInterval(S.live); S.live = null;
    document.querySelectorAll("[data-live-toggle]").forEach(function (b) { b.textContent = "Resume"; });
  };
  S.toggleLive = function () { S.live ? S.stopLive() : S.startLive(); };

  /* ============================== palette ============================= */
  var PAGES = [
    ["Dashboard","index.html"],["Orders","orders.html"],["Order detail","order-detail.html"],
    ["Draft orders","draft-orders.html"],["Abandoned checkouts","abandoned.html"],["Returns","returns.html"],
    ["Fulfilment","fulfilment.html"],["Products","products.html"],["Product detail","product-detail.html"],
    ["Collections","collections.html"],["Inventory","inventory.html"],["Purchase orders","purchase-orders.html"],
    ["Customers","customers.html"],["Customer detail","customer-detail.html"],["Segments","segments.html"],
    ["Reviews","reviews.html"],["Discounts","discounts.html"],["Discount editor","discount-edit.html"],
    ["Gift cards","gift-cards.html"],["Campaigns","campaigns.html"],["Sales analytics","analytics.html"],
    ["Live view","live.html"],["Product performance","product-report.html"],["Sales channels","channels.html"],
    ["Customer cohorts","cohorts.html"],["Payouts","payouts.html"],["Transactions","transactions.html"],
    ["Shipping","shipping.html"],["Apps","apps.html"],["Staff","staff.html"],["Settings","settings.html"],
    ["Components","ui-components.html"]
  ];
  S.openPalette = function () {
    var p = document.getElementById("palette");
    p.classList.add("is-open");
    var i = p.querySelector(".pal-input"); i.value = ""; paint(""); i.focus();
  };
  S.closePalette = function () { document.getElementById("palette").classList.remove("is-open"); };
  function paint(q) {
    var list = document.querySelector("#palette .pal-list");
    var hits = PAGES.filter(function (p) { return p[0].toLowerCase().indexOf(q.toLowerCase()) > -1; });
    list.innerHTML = hits.length
      ? hits.map(function (p, i) {
          return '<button class="pal-item' + (i === 0 ? " is-on" : "") + '" data-go="' + p[1] + '">' +
            p[0] + '<span class="k">' + p[1] + "</span></button>";
        }).join("")
      : '<div class="empty"><div class="empty-title">No match</div>' +
        '<div class="empty-body">Try a page name such as orders, inventory or payouts.</div></div>';
  }

  /* ========================= definitions tooltip ====================== */
  function initDefs() {
    var t = document.getElementById("tip");
    document.addEventListener("mouseover", function (e) {
      var b = e.target.closest("[data-def]"); if (!b) return;
      t.innerHTML = '<div style="font-size:12.5px;color:var(--ink-2);max-width:240px;line-height:1.5">' +
        b.getAttribute("data-def") + "</div>";
      var r = b.getBoundingClientRect();
      t.style.opacity = 1; t.style.left = r.left + r.width / 2 + "px"; t.style.top = r.top + "px";
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("[data-def]")) t.style.opacity = 0;
    });
  }
  function notifications() {
    var host = document.querySelector("[data-notifications]"); if (!host) return;
    host.innerHTML = '<div class="pop-head">Notifications</div>' +
      D.notifications.map(function (n) {
        return '<button class="pop-note' + (n.unread ? " unread" : "") + '" data-act="toast" data-val="' +
          esc(n.title) + ' opened"><b>' + n.title + "</b><span>" + n.body + "</span><i>" + n.when + "</i></button>";
      }).join("") +
      '<div class="pop-foot"><button class="btn btn--quiet btn--sm" data-act="toast" ' +
      'data-val="All notifications marked read">Mark all read</button>' +
      '<a class="btn btn--quiet btn--sm" href="orders.html">View orders</a></div>';
  }

  /* =============================== boot =============================== */
  S.init = function () {
    try {
      var t = localStorage.getItem("shelf.theme");
      if (t) document.documentElement.setAttribute("data-theme", t);
      if (localStorage.getItem("shelf.min") === "1") document.body.classList.add("is-min");
      var st = sessionStorage.getItem("shelf.state");
      if (st) S.state = JSON.parse(st);
    } catch (e) {}

    document.querySelectorAll("[data-kpis]").forEach(R.kpis);
    document.querySelectorAll("[data-table]").forEach(R.table);
    document.querySelectorAll("[data-bars]").forEach(R.bars);
    document.querySelectorAll("[data-feed]").forEach(R.feed);
    document.querySelectorAll("[data-funnel]").forEach(R.funnel);
    document.querySelectorAll("[data-cohort]").forEach(R.cohort);
    document.querySelectorAll("[data-spark]").forEach(spark);
    notifications();
    if (window.Chart) S.initCharts();
    document.querySelectorAll("[data-range-label]").forEach(function (e) { e.textContent = S.state.range; });
    document.querySelectorAll("[data-compare-label]").forEach(function (e) { e.textContent = S.state.compare; });
    document.querySelectorAll("[data-channel-label]").forEach(function (e) { e.textContent = S.state.channel; });
    S.initSort(); S.initBulk(); S.initFilters(); S.initTabs(); initDefs();

    document.addEventListener("click", function (e) {
      var t = e.target;
      var pop = t.closest("[aria-controls]");
      if (pop && pop.hasAttribute("aria-expanded")) { e.preventDefault(); S.togglePop(pop); return; }
      if (!t.closest(".pop")) closePops();

      var act = t.closest("[data-act]");
      if (act) {
        var a = act.getAttribute("data-act"), v = act.getAttribute("data-val");
        if (a === "theme") S.toggleTheme();
        if (a === "min") S.toggleNav();
        if (a === "mobnav") S.toggleMobileNav();
        if (a === "palette") S.openPalette();
        if (a === "range") { S.setRange(v); closePops(); }
        if (a === "compare") { S.setCompare(v); closePops(); }
        if (a === "channel") { S.setChannel(v); closePops(); }
        if (a === "modal") S.openModal(v);
        if (a === "drawer") S.openDrawer(v);
        if (a === "close-modal") S.closeModal(v);
        if (a === "close-drawer") S.closeDrawer(v);
        if (a === "copy") S.copy(v);
        if (a === "toast") S.toast(v);
        if (a === "refresh") S.refresh();
        if (a === "live") S.toggleLive();
        if (a === "print") window.print();
        if (a === "share") S.copy(location.href);
        if (a === "export") { S.closeModal(); S.toast("Export queued, you will get an email when it is ready"); }
        if (a === "busy") {
          act.classList.add("is-busy");
          setTimeout(function () {
            act.classList.remove("is-busy");
            S.toast(act.getAttribute("data-done") || "Done");
            if (act.hasAttribute("data-then-close")) { S.closeModal(); S.closeDrawer(); }
          }, 850);
        }
      }
      var go = t.closest("[data-go]");
      if (go) location.href = go.getAttribute("data-go");
      if (t.id === "backdrop") {
        S.closeModal(); S.closeDrawer();
        if (document.body.classList.contains("nav-open")) S.toggleMobileNav();
      }
      var leg = t.closest(".leg");
      if (leg && leg.hasAttribute("data-chart")) {
        var rec = S.charts[leg.getAttribute("data-chart")];
        if (rec && rec.instance) {
          var i = +leg.getAttribute("data-i");
          var meta = rec.instance.getDatasetMeta(i);
          meta.hidden = meta.hidden === null ? true : null;
          leg.classList.toggle("is-off");
          rec.instance.update();
        }
      }
    });

    document.addEventListener("change", function (e) {
      if (e.target.matches("[data-all]")) {
        document.querySelectorAll("[data-row]").forEach(function (c) {
          if (!c.closest("tr").hidden) c.checked = e.target.checked;
        });
        if (S.syncBulk) S.syncBulk();
      } else if (e.target.matches("[data-row]")) { if (S.syncBulk) S.syncBulk(); }
      else if (e.target.matches(".switch[data-label]"))
        S.toast(e.target.getAttribute("data-label") + (e.target.checked ? " turned on" : " turned off"));
      else if (e.target.matches(".select[data-label]"))
        S.toast(e.target.getAttribute("data-label") + ": " + e.target.value);
    });

    var pal = document.getElementById("palette");
    if (pal) {
      pal.querySelector(".pal-input").addEventListener("input", function (e) { paint(e.target.value); });
      pal.addEventListener("keydown", function (e) {
        var items = Array.prototype.slice.call(pal.querySelectorAll(".pal-item"));
        var i = items.findIndex(function (x) { return x.classList.contains("is-on"); });
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault(); if (!items.length) return;
          if (items[i]) items[i].classList.remove("is-on");
          i = (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
          items[i].classList.add("is-on"); items[i].scrollIntoView({ block: "nearest" });
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
      if (document.querySelector(".pop.is-open")) return closePops();
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
      else if (!document.hidden && document.querySelector("[data-live-feed]") && !S.live) S.startLive();
    });
  };

  document.addEventListener("DOMContentLoaded", S.init);
})(window.SHELF_DATA);
