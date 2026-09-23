/* ===================================
   LEX | Shared JavaScript
   Premium Law Firm Dashboard
=================================== */

/* ── THEME ── */
const LEX = {
  getTheme(){ return localStorage.getItem('lex-theme') || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light') },
  applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('lex-theme', t);
    const i = document.getElementById('themeIcon');
    if(i) i.innerHTML = t === 'dark'
      ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
      : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    if(window.LEX && LEX.rebuildCharts) LEX.rebuildCharts();
  },
  toggleTheme(){ LEX.applyTheme(LEX.getTheme() === 'dark' ? 'light' : 'dark') },

  /* ── SIDEBAR ── */
  sidebarCollapsed: false,
  initSidebar(){
    LEX.sidebarCollapsed = localStorage.getItem('lex-sb') === '1';
    LEX._applySidebar();
  },
  _applySidebar(){
    const s = document.getElementById('sb'), m = document.getElementById('mw');
    if(!s) return;
    s.classList.toggle('collapsed', LEX.sidebarCollapsed);
    if(m) m.classList.toggle('sidebar-collapsed', LEX.sidebarCollapsed);
  },
  toggleSidebar(){
    LEX.sidebarCollapsed = !LEX.sidebarCollapsed;
    localStorage.setItem('lex-sb', LEX.sidebarCollapsed ? '1' : '0');
    LEX._applySidebar();
  },
  toggleMobile(){
    const s = document.getElementById('sb');
    const bd = document.getElementById('mob-bd');
    const open = s.classList.toggle('mob-open');
    if(bd){ open ? bd.classList.add('open') : bd.classList.remove('open'); }
    // Lock body scroll when sidebar open on mobile
    if(window.innerWidth <= 640){
      document.body.classList.toggle('sidebar-open', open);
    }
  },

  /* ── COMMAND PALETTE ── */
  openPalette(){
    document.getElementById('pal').style.display = 'flex';
    setTimeout(() => { const i = document.getElementById('cmd-inp'); if(i) i.focus(); }, 50);
  },
  closePalette(){ document.getElementById('pal').style.display = 'none'; },

  /* ── NOTIFICATIONS ── */
  toggleNotif(){
    const p = document.getElementById('notif-panel');
    if(p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
  },
  clearNotif(){
    document.querySelectorAll('.notif-item.unread').forEach(e => e.classList.remove('unread'));
    const d = document.querySelector('.notif-dot');
    if(d) d.style.display = 'none';
  },


  /* ── PROFILE DROPDOWN ── */
  toggleProfile(){
    const p = document.getElementById('profile-panel');
    const b = document.getElementById('profile-btn');
    if(!p) return;
    const open = !p.classList.contains('open');
    p.classList.toggle('open', open);
    if(b) b.classList.toggle('open', open);
  },
  closeProfile(){
    const p = document.getElementById('profile-panel');
    const b = document.getElementById('profile-btn');
    if(p) p.classList.remove('open');
    if(b) b.classList.remove('open');
  },
  /* ── TABS ── */
  initTabs(containerSelector){
    const containers = document.querySelectorAll(containerSelector || '[data-tabs]');
    containers.forEach(container => {
      const tabs = container.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const panels = document.querySelectorAll(`[data-panel]`);
          panels.forEach(p => {
            p.classList.toggle('active', p.dataset.panel === target);
          });
        });
      });
    });
  },

  /* ── CHART DEFAULTS ── */
  chartOpts(){
    const dark = LEX.getTheme() === 'dark';
    return {
      grid: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
      tick: dark ? '#4E6180' : '#94A3B8',
      ttBg: dark ? '#162040' : '#0F172A',
    };
  },

  /* ── REBUILDABLE CHARTS ── */
  chartRegistry: [],
  registerChart(fn){ LEX.chartRegistry.push(fn); },
  rebuildCharts(){ LEX.chartRegistry.forEach(fn => fn()); },

  /* ── INIT ── */
  init(){
    LEX.applyTheme(LEX.getTheme());
    LEX.initSidebar();
    LEX.initTabs();

    document.addEventListener('keydown', e => {
      if((e.metaKey || e.ctrlKey) && e.key === 'k'){ e.preventDefault(); LEX.openPalette(); }
      if(e.key === 'Escape'){ LEX.closePalette(); }
    });

    document.addEventListener('click', e => {
      const pp = document.getElementById('profile-panel');
      const pb = document.getElementById('profile-btn');
      if(pp && pb && !pb.contains(e.target) && !pp.contains(e.target)) LEX.closeProfile();
      const p = document.getElementById('notif-panel');
      const b = document.getElementById('notif-btn');
      if(p && b && !b.contains(e.target) && !p.contains(e.target)) p.style.display = 'none';
    });

    const mm = document.getElementById('mob-menu');
    if(mm) mm.style.display = window.innerWidth <= 640 ? 'flex' : 'none';
    window.addEventListener('resize', () => {
      const m = document.getElementById('mob-menu');
      if(m) m.style.display = window.innerWidth <= 640 ? 'flex' : 'none';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => LEX.init());

// ── Responsive: close sidebar on resize ──
(function(){
  let resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      // Auto-close mobile drawer on resize to desktop
      if(window.innerWidth > 640){
        const s = document.getElementById('sb');
        const bd = document.getElementById('mob-bd');
        if(s) s.classList.remove('mob-open');
        if(bd) bd.classList.remove('open');
        document.body.classList.remove('sidebar-open');
      }
      // Rebuild charts on resize (handles container width change)
      if(LEX && LEX.rebuildCharts){ LEX.rebuildCharts(); }
    }, 200);
  });

  // ── Touch swipe: right-swipe to open sidebar on mobile ──
  var touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', function(e){
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, {passive:true});
  document.addEventListener('touchend', function(e){
    if(window.innerWidth > 640) return;
    var dx = e.changedTouches[0].screenX - touchStartX;
    var dy = Math.abs(e.changedTouches[0].screenY - touchStartY);
    var s = document.getElementById('sb');
    // Right swipe from left edge (open)
    if(dx > 60 && dy < 40 && touchStartX < 30 && s && !s.classList.contains('mob-open')){
      LEX.toggleMobile();
    }
    // Left swipe (close)
    if(dx < -60 && dy < 40 && s && s.classList.contains('mob-open')){
      LEX.toggleMobile();
    }
  }, {passive:true});

  // ── Update mobile nav active state ──
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.mob-nav-item').forEach(function(item){
    if(item.getAttribute('href') === currentPage){
      item.classList.add('active');
    }
  });

  // ── Escape key closes sidebar on mobile ──
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && window.innerWidth <= 640){
      var s = document.getElementById('sb');
      if(s && s.classList.contains('mob-open')){ LEX.toggleMobile(); }
    }
  });
})();
