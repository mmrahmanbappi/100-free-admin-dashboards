/* =========================================
   PULSE - Dashboard JS v4 (final)
   - Sidebar: ALWAYS visible on desktop
   - No collapse logic whatsoever
   - Mobile: hamburger drawer only
   - Charts: rebuild on theme toggle
========================================= */
(function(){
'use strict';

var charts   = [];
var MOBILE   = 768; // px breakpoint

/* ── HELPERS ────────────────────────── */
function isDark(){ return document.documentElement.dataset.theme !== 'light'; }
function $(id){ return document.getElementById(id); }

/* ── PUBLIC API ─────────────────────── */
window.PULSE = {

  // theme toggle
  toggleTheme: function(){
    var next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try{ localStorage.setItem('pulse-theme', next); }catch(e){}
    this.rebuildCharts();
    // Sync dark mode toggle in settings page
    var tog = document.getElementById('darkModeToggle');
    if(tog) tog.classList.toggle('on', next === 'dark');
  },
  initTheme: function(){
    try{
      var t = localStorage.getItem('pulse-theme');
      if(t) document.documentElement.dataset.theme = t;
      // Always clear any stale sidebar collapse state
      localStorage.removeItem('pulse-sb');
    }catch(e){}
  },

  /* MOBILE DRAWER */
  toggleMobile: function(){
    var sb = $('sb'), bd = $('mob-bd');
    if(!sb) return;
    var open = sb.classList.toggle('mob-open');
    if(bd) bd.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
  },
  closeMobile: function(){
    var sb = $('sb'), bd = $('mob-bd');
    if(sb && sb.classList.contains('mob-open')){
      sb.classList.remove('mob-open');
      if(bd) bd.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  },

  // notification bell panel
  toggleNotif: function(){
    var panel = document.getElementById('notif-panel');
    var btn   = document.getElementById('notif-btn');
    if(!panel) return;
    var open = panel.classList.toggle('open');
    if(btn) btn.classList.toggle('open', open);
    if(open){
      // Mark dot as read
      var dot = document.querySelector('.notif-dot');
      if(dot) dot.style.display = 'none';
      // Close on outside click
      setTimeout(function(){
        document.addEventListener('click', function close(e){
          if(!panel.contains(e.target) && (!btn || !btn.contains(e.target))){
            panel.classList.remove('open');
            if(btn) btn.classList.remove('open');
            document.removeEventListener('click', close);
          }
        });
      }, 0);
    }
  },
  markAllRead: function(){
    document.querySelectorAll('.notif-row.unread').forEach(function(r){
      r.classList.remove('unread');
    });
    document.querySelectorAll('.notif-unread-dot').forEach(function(d){
      d.style.display = 'none';
    });
    var dot = document.querySelector('.notif-dot');
    if(dot) dot.style.display = 'none';
    this.showToast('All notifications marked as read','success');
  },

  // profile menu
  toggleProfile: function(){
    var panel = $('profile-panel');
    var btn   = $('profile-btn');
    if(!panel) return;
    var open = panel.classList.toggle('open');
    if(btn) btn.classList.toggle('open', open);
    if(open){
      setTimeout(function(){
        document.addEventListener('click', function close(e){
          if(!panel.contains(e.target) && (!btn || !btn.contains(e.target))){
            panel.classList.remove('open');
            if(btn) btn.classList.remove('open');
            document.removeEventListener('click', close);
          }
        });
      }, 0);
    }
  },

  /* COMMAND PALETTE */
  openPalette: function(){
    var o = $('pal');
    if(!o) return;
    o.classList.add('open');
    var inp = o.querySelector('input');
    if(inp){ inp.focus(); inp.select(); }
  },
  closePalette: function(){
    var o = $('pal');
    if(o) o.classList.remove('open');
  },

  // tab switching
  initTabs: function(){
    document.querySelectorAll('.tabs').forEach(function(bar){
      bar.querySelectorAll('.tab').forEach(function(tab){
        tab.addEventListener('click', function(){
          bar.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
          tab.classList.add('active');
          var target = tab.dataset.tab;
          if(!target) return;
          // Panels: look inside nearest card parent, fallback to document
          var scope = tab.closest('.card') || document;
          scope.querySelectorAll('[data-panel]').forEach(function(p){
            p.style.display = p.dataset.panel === target ? '' : 'none';
          });
        });
      });
    });
  },

  // chart setup
  registerChart: function(fn){ charts.push(fn); },
  rebuildCharts: function(){
    charts.forEach(function(fn){ try{ fn(); }catch(e){} });
  },

  // little toast messages
  showToast: function(msg, type){
    var c = document.querySelector('.toast-container');
    if(!c){ c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    var ico = {
      success:'<svg viewBox="0 0 24 24" style="color:var(--ok)"><polyline points="20 6 9 17 4 12"/></svg>',
      error:  '<svg viewBox="0 0 24 24" style="color:var(--err)"><circle cx="12" cy="12" r="10"/></svg>',
      info:   '<svg viewBox="0 0 24 24" style="color:var(--info)"><circle cx="12" cy="12" r="10"/></svg>'
    };
    var t = document.createElement('div');
    t.className = 'toast ' + (type||'info');
    t.innerHTML = (ico[type]||ico.info) + '<span>' + msg + '</span>';
    c.appendChild(t);
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 3000);
  },

  // copy to clipboard
  copyToClipboard: function(text, label){
    var self = this;
    var done = function(){ self.showToast((label||'Copied') + ' \u2713', 'success'); };
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).then(done).catch(function(){
        self._copy(text); done();
      });
    }else{
      this._copy(text); done();
    }
  },
  _copy: function(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta);
  },

  // modal open/close
  openModal:  function(id){ var m=$(id); if(m) m.style.display='flex'; },
  closeModal: function(id){ var m=$(id); if(m) m.style.display='none'; },

  // export modal
  openExport: function(context){
    var configs = {
      dashboard:   { title:'Dashboard Overview', rows:'4 stat cards + 3 charts', fields:['MRR / ARR','Subscriber counts','Churn rate','Revenue by plan','Chart data'] },
      subscribers: { title:'Subscriber List', rows:'1,847 subscribers', fields:['Name & Email','Plan & Status','MRR value','Billing cycle','Join date','LTV'] },
      revenue:     { title:'Revenue Report', rows:'12 months data', fields:['MRR by month','ARR projection','Revenue by plan','Forecast data','Growth %'] },
      mrr:         { title:'MRR Breakdown', rows:'Monthly movements', fields:['New MRR','Expansion MRR','Contraction MRR','Churned MRR','Net New MRR'] },
      churn:       { title:'Churn Analysis', rows:'6 months data', fields:['Churn rate %','Churned MRR','Churn reasons','At-risk accounts','Win-back list'] },
      invoices:    { title:'Invoice List', rows:'1,847 invoices', fields:['Invoice ID','Customer','Amount','Status','Date','Plan'] },
      billing:     { title:'Billing Report', rows:'6 months data', fields:['Collected MTD','Failed payments','Refunds','Payment methods','Monthly trend'] },
      activity:    { title:'Activity Log', rows:'All events', fields:['Actor','Action','Module','Timestamp','IP address'] },
      reports:     { title:'Custom Report', rows:'Selected range', fields:['MRR summary','Subscriber delta','Churn summary','Revenue split','Team activity'] }
    };
    var cfg = configs[context] || configs.dashboard;
    var el = document.getElementById('exportModal');
    if(!el){
      // Create modal dynamically
      el = document.createElement('div');
      el.id = 'exportModal';
      el.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:80;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
      el.innerHTML = '<div class="modal modal-md" id="exportModalInner"></div>';
      el.addEventListener('click', function(e){ if(e.target===el) PULSE.closeExport(); });
      document.body.appendChild(el);
    }
    // Build modal content
    var fieldsHtml = (cfg.fields||[]).map(function(f){
      return '<label class="field-check"><input type="checkbox" checked> '+f+'</label>';
    }).join('');
    var ext = 'csv';
    var today = new Date();
    var dateStr = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
    var fname = 'pulse-'+context+'-'+dateStr+'.'+ext;
    document.getElementById('exportModalInner').innerHTML =
      '<div class="modal-header">'+
        '<div class="modal-icon" style="background:var(--brand-lt);color:var(--brand)">'+
          '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;stroke-width:1.8;fill:none">'+
            '<polyline points="21 15 21 19 3 19 3 15"/><line x1="12" y1="3" x2="12" y2="15"/><polyline points="7 10 12 15 17 10"/>'+
          '</svg>'+
        '</div>'+
        '<div><div class="modal-title">Export '+cfg.title+'</div></div>'+
        '<button class="modal-close" onclick="PULSE.closeExport()">'+
          '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'+
        '</button>'+
      '</div>'+
      '<div class="modal-body">'+
        '<div class="form-group" style="margin-bottom:14px">'+
          '<label class="form-label">Format</label>'+
          '<div class="export-formats">'+
            '<div class="export-fmt selected" onclick="selectFmt(this,&apos;csv&apos;)"><div class="export-fmt-icon">📊</div><div class="export-fmt-label">CSV</div><div class="export-fmt-ext">.csv</div></div>'+
            '<div class="export-fmt" onclick="selectFmt(this,&apos;xlsx&apos;)"><div class="export-fmt-icon">📗</div><div class="export-fmt-label">Excel</div><div class="export-fmt-ext">.xlsx</div></div>'+
            '<div class="export-fmt" onclick="selectFmt(this,&apos;pdf&apos;)"><div class="export-fmt-icon">📄</div><div class="export-fmt-label">PDF</div><div class="export-fmt-ext">.pdf</div></div>'+
            '<div class="export-fmt" onclick="selectFmt(this,&apos;json&apos;)"><div class="export-fmt-icon">{ }</div><div class="export-fmt-label">JSON</div><div class="export-fmt-ext">.json</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="form-row" style="margin-bottom:14px">'+
          '<div class="form-group" style="margin-bottom:0">'+
            '<label class="form-label">Date Range</label>'+
            '<select class="form-select" id="exportRange" onchange="updateFname()">'+
              '<option value="30d">Last 30 days</option>'+
              '<option value="90d">Last 90 days</option>'+
              '<option value="ytd">This year (YTD)</option>'+
              '<option value="all" selected>All time</option>'+
              '<option value="custom">Custom range...</option>'+
            '</select>'+
          '</div>'+
          '<div class="form-group" style="margin-bottom:0">'+
            '<label class="form-label">Rows</label>'+
            '<div style="background:var(--surface-2);border:1px solid var(--surface-3);border-radius:var(--r-md);padding:9px 12px;font-size:13.5px;color:var(--t1);font-family:JetBrains Mono,monospace">'+cfg.rows+'</div>'+
          '</div>'+
        '</div>'+
        '<div class="form-group" style="margin-bottom:14px">'+
          '<label class="form-label">Include Fields</label>'+
          '<div class="field-checks">'+fieldsHtml+'</div>'+
        '</div>'+
        '<div class="form-group" style="margin-bottom:0">'+
          '<label class="form-label">File Preview</label>'+
          '<div class="export-preview">'+
            '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:var(--ok);stroke-width:1.8;fill:none;flex-shrink:0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'+
            '<span class="export-preview-name" id="exportFname">'+fname+'</span>'+
            '<span style="font-size:11.5px;color:var(--t3)">Ready</span>'+
          '</div>'+
          '<div class="export-progress" id="exportProgress"><div class="export-progress-bar" id="exportBar"></div></div>'+
        '</div>'+
      '</div>'+
      '<div class="modal-footer">'+
        '<button class="btn btn-ghost" onclick="PULSE.closeExport()">Cancel</button>'+
        '<button class="btn btn-primary" onclick="PULSE.doExport()">'+
          '<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;stroke-width:2;fill:none"><polyline points="21 15 21 19 3 19 3 15"/><line x1="12" y1="3" x2="12" y2="15"/><polyline points="7 10 12 15 17 10"/></svg>'+
          'Download Export'+
        '</button>'+
      '</div>';

    // Store context
    el._context = context;
    el._cfg = cfg;
    el.style.display = 'flex';

    // Helper: select format
    window.selectFmt = function(el, fmt){
      document.querySelectorAll('.export-fmt').forEach(function(f){ f.classList.remove('selected'); });
      el.classList.add('selected');
      window._exportFmt = fmt;
      updateFname();
    };
    window._exportFmt = 'csv';
    window.updateFname = function(){
      var fmt = window._exportFmt || 'csv';
      var range = (document.getElementById('exportRange')||{}).value || 'all';
      var rmap = {'30d':'30d','90d':'90d','ytd':'ytd','all':'all','custom':'custom'};
      var n = 'pulse-'+context+'-'+dateStr+'.'+fmt;
      var el2 = document.getElementById('exportFname');
      if(el2) el2.textContent = n;
    };
  },
  closeExport: function(){
    var el = document.getElementById('exportModal');
    if(el) el.style.display = 'none';
  },
  doExport: function(){
    var fmt = window._exportFmt || 'csv';
    var prog = document.getElementById('exportProgress');
    var bar  = document.getElementById('exportBar');
    var btn  = document.querySelector('#exportModal .btn-primary');
    if(prog) prog.style.display = 'block';
    if(btn){ btn.disabled = true; btn.textContent = 'Preparing...'; }
    var w = 0;
    var iv = setInterval(function(){
      w += Math.random()*18+8;
      if(w >= 100){ w = 100; clearInterval(iv);
        setTimeout(function(){
          PULSE.closeExport();
          PULSE.showToast('Export downloaded as .'+fmt,'success');
          if(bar) bar.style.width='0%';
          if(prog) prog.style.display='none';
          if(btn){ btn.disabled=false; btn.innerHTML='<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;stroke-width:2;fill:none"><polyline points="21 15 21 19 3 19 3 15"/><line x1="12" y1="3" x2="12" y2="15"/><polyline points="7 10 12 15 17 10"/></svg> Download Export'; }
        },400);
      }
      if(bar) bar.style.width = Math.min(w,100)+'%';
    },120);
  },

  // bulk row selection
  initBulk: function(){
    var sel = new Set();
    function sync(){
      var bar   = $('bulkBar');
      var cnt   = $('bulkCount');
      var sa    = $('sa');
      var cbs   = document.querySelectorAll('.row-cb');
      if(bar) bar.style.display = sel.size ? 'flex' : 'none';
      if(cnt) cnt.textContent   = sel.size + ' selected';
      if(sa){
        sa.indeterminate = sel.size > 0 && sel.size < cbs.length;
        sa.checked       = cbs.length > 0 && sel.size === cbs.length;
      }
      cbs.forEach(function(cb){
        var row = cb.closest('tr');
        if(row) row.classList.toggle('selected', sel.has(cb.dataset.id));
      });
    }
    window.toggleCheck = function(cb, id){ cb.checked ? sel.add(id) : sel.delete(id); sync(); };
    window.toggleAll   = function(cb){
      document.querySelectorAll('.row-cb').forEach(function(c){
        c.checked = cb.checked;
        cb.checked ? sel.add(c.dataset.id) : sel.delete(c.dataset.id);
      });
      sync();
    };
    window.clearBulk   = function(){
      sel.clear();
      document.querySelectorAll('.row-cb').forEach(function(c){ c.checked = false; });
      sync();
    };
  }
};

/* ── INIT ─────────────────────────── */
document.addEventListener('DOMContentLoaded', function(){

  PULSE.initTheme();
  PULSE.initTabs();
  PULSE.initBulk();

  /* Active bottom nav */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.mob-nav-item').forEach(function(a){
    if(a.getAttribute('href') === page) a.classList.add('active');
  });

  /* Keyboard shortcuts */
  document.addEventListener('keydown', function(e){
    if((e.metaKey||e.ctrlKey) && e.key === 'k'){ e.preventDefault(); PULSE.openPalette(); return; }
    if(e.key === 'Escape'){
      PULSE.closePalette();
      PULSE.closeMobile();
      document.querySelectorAll('[style*="display:flex"][id]').forEach(function(m){
        if(m.classList.contains('modal-backdrop')||m.id.toLowerCase().includes('modal')||
           ['addSubModal','refundModal','inviteModal','addWH','nudgeModal','createKeyModal'].indexOf(m.id)>-1)
          m.style.display = 'none';
      });
    }
  });

  /* Palette backdrop */
  var pal = $('pal');
  if(pal) pal.addEventListener('click', function(e){ if(e.target===pal) PULSE.closePalette(); });

  /* Nav items: close mobile drawer on tap */
  document.querySelectorAll('.nav-item').forEach(function(a){
    a.addEventListener('click', function(){
      if(window.innerWidth <= MOBILE) PULSE.closeMobile();
    });
  });

  /* Resize */
  var rt;
  window.addEventListener('resize', function(){
    clearTimeout(rt);
    rt = setTimeout(function(){
      if(window.innerWidth > MOBILE) PULSE.closeMobile();
      PULSE.rebuildCharts();
    }, 150);
  });

  /* Swipe to open/close drawer */
  var tx=0, ty=0;
  document.addEventListener('touchstart', function(e){ tx=e.changedTouches[0].screenX; ty=e.changedTouches[0].screenY; }, {passive:true});
  document.addEventListener('touchend', function(e){
    if(window.innerWidth > MOBILE) return;
    var dx = e.changedTouches[0].screenX - tx;
    var dy = Math.abs(e.changedTouches[0].screenY - ty);
    var sb = $('sb');
    if(dx> 55 && dy<50 && tx<40 && sb && !sb.classList.contains('mob-open')) PULSE.toggleMobile();
    if(dx<-55 && dy<50 && sb && sb.classList.contains('mob-open')) PULSE.toggleMobile();
  }, {passive:true});

  /* Toggle switches */
  document.querySelectorAll('.toggle').forEach(function(el){
    el.addEventListener('click', function(){ this.classList.toggle('on'); });
  });

});

})();
