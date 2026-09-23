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
