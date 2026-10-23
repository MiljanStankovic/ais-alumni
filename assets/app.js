/* AIESEC Alumni — prototip (statički, bez servera).
   Svi podaci su izmišljeni; stanje živi u memoriji i resetuje se pri osvežavanju. */
(function () {
  'use strict';

  /* ---------------- Pomoćne funkcije ---------------- */
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var map = function (arr, fn) { return arr.map(fn).join(''); };
  var when = function (c, html) { return c ? html : ''; };

  var I = {
    home: '<path d="M3.5 10.5 12 3.5l8.5 7V20a.5.5 0 0 1-.5.5h-5v-6h-6v6H4a.5.5 0 0 1-.5-.5z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.9.7 3.1 2.4 3.5 5.2"/>',
    inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    layers: '<path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    chev: '<path d="m7 10 5 5 5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    group: '<circle cx="9" cy="9" r="3.2"/><circle cx="16.5" cy="10" r="2.6"/><path d="M3.5 19c.7-3 2.9-4.6 5.5-4.6s4.8 1.6 5.5 4.6M14.5 14.6c2.6-.3 4.9 1.1 5.6 4.4"/>',
    down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    up: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v.01M12 11v5"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    chat: '<path d="M4 4.5h10.5a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1z"/><path d="M18 8.5h2a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1h-1v3l-4-3h-3.5"/>',
    person: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
    menu: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.3 2.2 3.4 4.9 3.4 8s-1.1 5.8-3.4 8c-2.3-2.2-3.4-4.9-3.4-8S9.7 6.2 12 4z"/>',
    upTrend: '<path d="m5 15 7-7 7 7"/>',
    alert: '<path d="M12 7v6M12 17h.01"/>'
  };
  var ic = function (n, s, sw, extra) {
    s = s || 18; sw = sw || 1.6;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + I[n] + '</svg>';
  };
  var ava = function (ini, bg, ink, cls) {
    return '<span class="avatar ' + (cls || '') + '" style="background:' + bg + ';color:' + ink + '" aria-hidden="true">' + esc(ini) + '</span>';
  };

  /* ---------------- Podaci ---------------- */
  var LCS = [
    { code: 'MET', name: 'LC Metropolitan', n: 248 },
    { code: 'FON', name: 'LC FON', n: 221 },
    { code: 'NS', name: 'LC Novi Sad', n: 196 },
    { code: 'EF', name: 'LC EF', n: 164 },
    { code: 'KG', name: 'LC Kragujevac', n: 132 },
    { code: 'NIŠ', name: 'LC Niš', n: 118 },
    { code: 'SINGI', name: 'LC Singidunum', n: 97 },
    { code: 'SUB', name: 'LC Subotica', n: 71 }
  ];
  var GROWTH = { all: 38, MET: 8, FON: 7, NS: 6, EF: 5, KG: 4, 'NIŠ': 4, SINGI: 3, SUB: 1 };

  var PERSONAS = {
    mcp: { name: 'Milica Ranković', ini: 'MR', role: 'MCP, glavni admin', scope: 'Svi LC-ovi', bg: '#18181B', ink: '#FFFFFF', kind: 'admin' },
    lcpns: { name: 'Stefan Jovanović', ini: 'SJ', role: 'LCP Novi Sad, lokalni admin', scope: 'LC Novi Sad', bg: '#0F3D2E', ink: '#FFFFFF', kind: 'admin' },
    lcpfon: { name: 'Đorđe Lazić', ini: 'ĐL', role: 'LCP FON, lokalni admin', scope: 'LC FON', bg: '#EDE9FE', ink: '#5B21B6', kind: 'admin' },
    alum: { name: 'Teodora Vasić', ini: 'TV', role: 'Alumni, LC Novi Sad', scope: 'LC Novi Sad', bg: '#DCEBFB', ink: '#0352A8', kind: 'alumni' }
  };

  var ALUMNI = [
    ['Teodora Vasić', 'TV', 'Beograd', 'NS', 'LCVP oGX', '2016–2020', 'Nordeus', 'Senior Product Manager', true, '#DCEBFB', '#0352A8'],
    ['Vuk Marković', 'VM', 'Novi Sad', 'NS', 'LCP', '2013–2016', 'Frame Studio', 'Osnivač', true, '#F1E6FA', '#6B21A8'],
    ['Lazar Mitrović', 'LM', 'Beograd', 'MET', 'LCVP iGV', '2018–2021', 'Microsoft Development Center', 'Software Engineer II', false, '#E3F4E8', '#166534'],
    ['Katarina Lukić', 'KL', 'Beograd', 'FON', 'MCVP Finance', '2012–2016', 'Deloitte Srbija', 'Senior Manager, Audit', true, '#FDE8D7', '#9A3412'],
    ['Filip Đurić', 'FĐ', 'Niš', 'NIŠ', 'Team Leader B2B', '2019–2021', 'Seven Bridges', 'Data Analyst', false, '#E0F2F1', '#115E59'],
    ['Mina Stojanović', 'MS', 'Beograd', 'NIŠ', 'LCP', '2017–2020', 'HTEC Group', 'Engineering Manager', true, '#FCE7F3', '#9D174D'],
    ['Dušan Radovanović', 'DR', 'Kragujevac', 'KG', 'LCVP Talent Mgmt', '2015–2018', 'Fiat Srbija', 'HR Business Partner', false, '#EDE9FE', '#5B21B6'],
    ['Ivana Simonović', 'IS', 'Kragujevac', 'KG', 'LCP', '2016–2018', 'Raiffeisen banka', 'Risk Analyst', true, '#DCEBFB', '#0352A8'],
    ['Andrej Pavlović', 'AP', 'Subotica', 'SUB', 'Team Leader oGV', '2020–2022', 'NCR Voyix', 'QA Engineer', false, '#FEF3C7', '#92400E'],
    ['Petar Vlahović', 'PV', 'Beograd', 'EF', 'LCVP Finance', '2018–2020', 'Erste banka', 'Financial Controller', false, '#E0F2F1', '#115E59'],
    ['Jovana Ristić', 'JR', 'Beograd', 'SINGI', 'Team Leader oGV', '2020–2022', 'Startit centar', 'Community Lead', true, '#FDE8D7', '#9A3412'],
    ['Nikola Bogdanović', 'NB', 'Beograd', 'MET', 'MCP', '2010–2014', 'Bogdanović & partneri', 'Osnivač, konsultant', true, '#F4F4F5', '#27272A']
  ].map(function (a) { return { name: a[0], ini: a[1], city: a[2], code: a[3], pos: a[4], years: a[5], company: a[6], title: a[7], mentor: a[8], bg: a[9], ink: a[10] }; });

  var APPLICANTS = [
    { id: 'tv', name: 'Teodora Vasić', ini: 'TV', bg: '#DCEBFB', ink: '#0352A8', email: 'teodora.vasic@gmail.com', when: 'danas, 11:42', headline: 'LCVP oGX, 2018–2020', job: 'Senior Product Manager, Nordeus',
      positions: [['2016–2017', 'Član, oGV tim'], ['2017–2018', 'Team Leader, oGV'], ['2018–2020', 'LCVP Outgoing Exchange']],
      criteria: [['Članstvo 12+ meseci', 'Deklarisano: 3 godine i 9 meseci', 1], ['Završena uloga vođstva', 'Team Leader, LCVP', 1], ['Pronađena u evidenciji LC-a', 'Lista članova 2016–2020, poklapanje po emailu', 1], ['Nije već u bazi', 'Nema duplikata po emailu i imenu', 1]] },
    { id: 'at', name: 'Anđela Tomić', ini: 'AT', bg: '#FDE8D7', ink: '#9A3412', email: 'andjela.tomic@gmail.com', when: 'pre 2 dana', headline: 'OC President, 2021', job: 'Konsultantkinja, Deloitte Srbija',
      positions: [['2019–2020', 'Član, Marketing'], ['2021', 'OC President, Youth Speak Forum']],
      criteria: [['Članstvo 12+ meseci', 'Deklarisano: 2 godine', 1], ['Završena uloga vođstva', 'Predsednica organizacionog komiteta', 1], ['Pronađena u evidenciji LC-a', 'Nije pronađena, proveri ručno', 0], ['Nije već u bazi', 'Nema duplikata', 1]] },
    { id: 'vm', name: 'Vuk Marković', ini: 'VM', bg: '#F1E6FA', ink: '#6B21A8', email: 'vuk.markovic@proton.me', when: 'pre 4 dana', headline: 'LCP, 2015–2016', job: 'Osnivač, Frame Studio',
      positions: [['2013–2014', 'Team Leader, iGV'], ['2014–2015', 'LCVP Finance'], ['2015–2016', 'LCP LC Novi Sad']],
      criteria: [['Članstvo 12+ meseci', 'Deklarisano: 3 godine', 1], ['Završena uloga vođstva', 'LCP', 1], ['Pronađen u evidenciji LC-a', 'Arhiva LCP-ova', 1], ['Nije već u bazi', 'Nema duplikata', 1]] },
    { id: 'nk', name: 'Nemanja Kostić', ini: 'NK', bg: '#E3F4E8', ink: '#166534', email: 'nemanja.kostic@outlook.com', when: 'pre 5 dana', headline: 'Član TM, 2022–2023', job: 'HR Generalist, Delhaize Serbia',
      positions: [['2022–2023', 'Član, Talent Management']],
      criteria: [['Članstvo 12+ meseci', 'Deklarisano: 10 meseci', 0], ['Završena uloga vođstva', 'Nema deklarisane uloge', 0], ['Pronađen u evidenciji LC-a', 'Lista članova 2022/23', 1], ['Nije već u bazi', 'Nema duplikata', 1]] },
    { id: 'sp', name: 'Sara Petković', ini: 'SP', bg: '#E0F2F1', ink: '#115E59', email: 'sara.petkovic@gmail.com', when: '12. okt', headline: 'LCVP B2B, 2020–2021', job: 'Key Account Manager, Raiffeisen banka',
      positions: [['2019–2020', 'Team Leader, B2B'], ['2020–2021', 'LCVP Business Development']],
      criteria: [['Članstvo 12+ meseci', '2 godine', 1], ['Završena uloga vođstva', 'LCVP', 1], ['Pronađena u evidenciji LC-a', 'Da', 1], ['Nije već u bazi', 'Nema duplikata', 1]] },
    { id: 'oi', name: 'Ognjen Ilić', ini: 'OI', bg: '#F4F4F5', ink: '#3F3F46', email: 'ognjen.ilic@gmail.com', when: '3. okt', headline: 'Član, 2024', job: 'Student',
      positions: [['2024', 'Član, oGV tim (4 meseca)']],
      criteria: [['Članstvo 12+ meseci', '4 meseca', 0], ['Završena uloga vođstva', 'Nema', 0], ['Pronađen u evidenciji LC-a', 'Da', 1], ['Nije već u bazi', 'Nema duplikata', 1]] }
  ];

  /* ---------------- Stanje ---------------- */
  var S = {
    scope: 'all',
    apStep: 1,
    apTab: 'pending', apSel: 'tv', apOpenPhone: false,
    apStatus: { tv: 'pending', at: 'pending', vm: 'pending', nk: 'pending', sp: 'approved', oi: 'rejected' },
    dirLc: 'all', dirQ: '', dirMentor: false,
    pf: 'idle',
    nlOn: { all: true }, nlMobile: false, nlSent: false,
    grLocked: true, grRules: ['pos', 'ind'],
    rlLc: 'NS', rlOff: {},
    ctTab: 'in', ctSt: { a: 'pending', b: 'pending' },
    agInvite: true, agMember: { base: true, it: true, mentor: true, lead: false, bg: false, pre: false, kon: false, vol: false }
  };
  var entering = true; // animacije samo pri ulasku na ekran

  /* ---------------- Rute ---------------- */
  var ADMIN_NAV = [
    { id: 'pregled', label: 'Pregled', icon: 'home' },
    { id: 'baza', label: 'Alumni baza', icon: 'users' },
    { id: 'prijave', label: 'Prijave', icon: 'inbox', count: function () { return pendingCount(); } },
    { id: 'kontakt', label: 'Zahtevi za kontakt', short: 'Kontakt', icon: 'phone', count: function () { return ctPending(); }, blue: true },
    { group: 'Komunikacija' },
    { id: 'newsletter', label: 'Newsletteri', icon: 'mail' },
    { id: 'grupe', label: 'Grupe', icon: 'layers' },
    { group: 'Administracija' },
    { id: 'uloge', label: 'Uloge i uslovi', short: 'Uloge', icon: 'shield' },
    { group: 'Prototip' },
    { id: 'moje-grupe', label: 'Pogled alumnija', short: 'Alumni', icon: 'person' },
    { id: 'prijava', label: 'Javna prijava', short: 'Prijava', icon: 'ext' }
  ];
  var ALUMNI_NAV = [
    { id: 'baza', label: 'Imenik alumnija', short: 'Imenik', icon: 'users' },
    { id: 'moje-grupe', label: 'Grupe', icon: 'layers', count: function () { return S.agInvite ? 1 : 0; }, blue: true },
    { id: 'dogadjaji', label: 'Događaji', icon: 'cal', soon: true },
    { id: 'mentorstvo', label: 'Mentorstvo', icon: 'chat', soon: true },
    { group: 'Prototip' },
    { id: 'pregled', label: 'Nazad na admin prikaz', short: 'Admin', icon: 'left' }
  ];
  var ADMIN_TABS = ['pregled', 'baza', 'prijave', 'kontakt'];
  var ALUMNI_TABS = ['baza', 'moje-grupe'];

  var ROUTES = {
    pregled: { title: 'Pregled zajednice', persona: 'mcp', view: viewPregled },
    baza: { title: 'Alumni baza', persona: 'mcp', view: viewBaza },
    prijave: { title: 'Prijave', persona: 'lcpns', view: viewPrijave },
    kontakt: { title: 'Zahtevi za kontakt', persona: 'lcpns', view: viewKontakt },
    profil: { title: 'Teodora Vasić', persona: 'lcpfon', view: viewProfil, parent: 'baza' },
    newsletter: { title: 'Novi newsletter', persona: 'lcpns', view: viewNewsletter },
    grupe: { title: 'Grupe', persona: 'lcpns', view: viewGrupe },
    uloge: { title: 'Uloge i uslovi', persona: 'mcp', view: viewUloge },
    'moje-grupe': { title: 'Grupe', persona: 'alum', view: viewMojeGrupe },
    prijava: { title: 'Prijava za alumni', public: true, view: viewPrijava }
  };

  function route() {
    var id = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return ROUTES[id] ? id : 'pregled';
  }

  /* ---------------- Okvir (shell) ---------------- */
  function navLinks(items, cur) {
    return map(items, function (it) {
      if (it.group) return '<div class="nav-group" role="presentation">' + esc(it.group) + '</div>';
      var c = it.count ? it.count() : 0;
      var href = it.soon ? '#/' + cur : '#/' + it.id;
      var curAttr = it.id === cur || (ROUTES[cur] && ROUTES[cur].parent === it.id) ? ' aria-current="page"' : '';
      var act = it.soon ? ' data-act="soon"' : '';
      return '<a class="nav-a" href="' + href + '"' + curAttr + act + '>' + ic(it.icon) +
        '<span class="label">' + esc(it.short && window.matchMedia('(max-width:1079px) and (min-width:720px)').matches ? it.short : it.label) + '</span>' +
        when(c > 0, '<span class="count' + (it.blue ? ' blue' : '') + '">' + c + '</span>') + '</a>';
    });
  }

  function shell(id, content) {
    var r = ROUTES[id];
    var p = PERSONAS[r.persona];
    var nav = p.kind === 'alumni' ? ALUMNI_NAV : ADMIN_NAV;
    var tabs = p.kind === 'alumni' ? ALUMNI_TABS : ADMIN_TABS;
    var tabItems = tabs.map(function (t) { return nav.filter(function (n) { return n.id === t; })[0]; });

    return '' +
      '<div class="app">' +
        '<aside class="side" aria-label="Glavna navigacija">' +
          '<a class="brand" href="#/pregled"><span class="brand-mark">' + ic('globe', 17, 1.8, ' style="color:#fff"') + '</span>' +
            '<span class="brand-text"><b>AIESEC Alumni</b><span>AIESEC in Serbia</span></span></a>' +
          when(p.kind === 'admin', '<button class="scope" type="button" data-act="soon"><span><small>Opseg</small><b>' + esc(p.scope) + '</b></span>' + ic('chev', 16) + '</button>') +
          '<nav class="nav" aria-label="Meni">' + navLinks(nav, id) + '</nav>' +
          '<div class="me">' + ava(p.ini, p.bg, p.ink, 'sm') + '<span class="me-text"><b>' + esc(p.name) + '</b><span>' + esc(p.role) + '</span></span></div>' +
        '</aside>' +
        '<header class="topbar">' +
          (r.parent
            ? '<a class="btn btn-icon btn-sm" href="#/' + r.parent + '" aria-label="Nazad">' + ic('left', 18) + '</a>'
            : '<a class="brand-mark" href="#/' + tabs[0] + '" aria-label="Početna">' + ic('globe', 17, 1.8, ' style="color:#fff"') + '</a>') +
          '<span class="title"><b>' + esc(r.title) + '</b><span>' + esc(p.name + ', ' + p.role) + '</span></span>' +
          ava(p.ini, p.bg, p.ink, 'sm') +
        '</header>' +
        '<main class="main" id="main" tabindex="-1"><div class="wrap' + (entering ? ' view-in' : '') + '">' + content + '</div></main>' +
        '<nav class="tabbar" aria-label="Donja navigacija">' +
          map(tabItems, function (it) {
            var c = it.count ? it.count() : 0;
            var on = it.id === id || r.parent === it.id;
            return '<a class="tab" href="#/' + it.id + '"' + (on ? ' aria-current="page"' : '') + '><span class="tab-ico">' + ic(it.icon, 20) + '</span>' + esc(it.short || it.label) +
              when(c > 0, '<span class="dot">' + c + '</span>') + '</a>';
          }) +
          '<button class="tab" type="button" data-act="openSheet"' + (tabs.indexOf(id) < 0 && !r.parent ? ' aria-current="page"' : '') + '><span class="tab-ico">' + ic('menu', 20, 2) + '</span>Više</button>' +
        '</nav>' +
      '</div>';
  }

  function openSheet() {
    var id = route();
    var p = PERSONAS[ROUTES[id].persona || 'mcp'];
    var nav = p.kind === 'alumni' ? ALUMNI_NAV : ADMIN_NAV;
    var body = document.getElementById('sheet-body');
    body.innerHTML = '<div class="row" style="padding:8px 12px 14px">' + ava(p.ini, p.bg, p.ink) + '<span class="stack"><b>' + esc(p.name) + '</b><span>' + esc(p.role) + '</span></span></div>' +
      navLinks(nav, id) +
      '<button class="btn" type="button" data-act="closeSheet" style="margin:12px 12px 4px">Zatvori</button>';
    var d = document.getElementById('sheet');
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  }
  function closeSheet() {
    var d = document.getElementById('sheet');
    if (d.open) { if (d.close) d.close(); else d.removeAttribute('open'); }
  }

  function toast(msg, dot) {
    var reg = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="dotx" style="background:' + (dot || '#22C55E') + '"></span>' + esc(msg);
    reg.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }

  /* ---------------- Ekran: Pregled (MCP) ---------------- */
  function viewPregled() {
    var cur = S.scope === 'all' ? { label: 'Svi LC-ovi', n: 1247 } : LCS.filter(function (l) { return l.code === S.scope; }).map(function (l) { return { label: l.name, n: l.n }; })[0];
    var pending = [
      ['Bojan Đokić', 'BĐ', '#DCEBFB', '#0352A8', 'LC FON', 'LCVP iGV, 2019–2021', 'pre 1 dan', true],
      ['Anđela Tomić', 'AT', '#FDE8D7', '#9A3412', 'LC Novi Sad', 'OC President, 2021', 'pre 2 dana', true],
      ['Nemanja Kostić', 'NK', '#E3F4E8', '#166534', 'LC Novi Sad', 'Član TM, 2022–2023', 'pre 5 dana', false],
      ['Milena Savić', 'MS', '#F1E6FA', '#6B21A8', 'LC EF', 'LCP, 2017–2018', 'pre 6 dana', true]
    ];
    var news = [
      ['Homecoming 2026: sačuvaj datum', 'Svi alumniji (1.247)', '14. okt', '52,3%'],
      ['Mentorski program: prijave otvorene', 'Mentori (62)', '2. okt', '71,0%'],
      ['LC Niš: godišnji izveštaj', 'LC Niš (118)', '19. sep', '44,8%']
    ];
    var max = LCS[0].n;
    return '' +
      '<div class="proto-note">' + ic('info', 18) + '<span>Prototip sa izmišljenim podacima. Svaki ekran je prikazan iz ugla jedne uloge (MCP, LCP ili alumni).</span><a href="#/prijava">Pogledaj javnu prijavu</a></div>' +
      '<div class="page-head"><div class="t"><span class="kicker">Petak, 23. oktobar, mandat 2026/27</span><h1 class="h1">Pregled zajednice</h1></div>' +
        '<div class="btn-row"><a class="btn hide-phone" href="#/grupe">Nova grupa</a><a class="btn btn-primary" href="#/newsletter">' + ic('plus', 16, 2) + 'Novi newsletter</a></div></div>' +
      '<div class="chips scroll-phone" role="group" aria-label="Filter po LC-u">' +
        '<button class="chip" type="button" aria-pressed="' + (S.scope === 'all') + '" data-act="scope" data-v="all">Svi LC-ovi</button>' +
        map(LCS, function (l) { return '<button class="chip" type="button" aria-pressed="' + (S.scope === l.code) + '" data-act="scope" data-v="' + l.code + '">LC ' + esc(l.code) + '</button>'; }) +
      '</div>' +
      '<section class="kpis" aria-label="Ključni brojevi">' +
        '<div class="kpi big"><div style="display:flex;flex-direction:column;gap:8px"><span class="lbl">Alumni u bazi, ' + esc(cur.label) + '</span><span class="num">' + cur.n.toLocaleString('sr-RS') + '</span>' +
          '<span class="sub" style="color:var(--ok-ink);display:flex;align-items:center;gap:6px">' + ic('upTrend', 14, 2) + '+' + GROWTH[S.scope] + ' ovog kvartala</span></div>' +
          '<svg width="220" height="72" viewBox="0 0 220 72" fill="none" aria-hidden="true" style="max-width:100%"><path d="M0 64 L24 60 L48 61 L72 52 L96 50 L120 41 L144 38 L168 26 L192 22 L220 10" stroke="#0369D1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 64 L24 60 L48 61 L72 52 L96 50 L120 41 L144 38 L168 26 L192 22 L220 10 L220 72 L0 72 Z" fill="#0369D1" fill-opacity=".07"/><circle cx="220" cy="10" r="3.5" fill="#0369D1"/></svg></div>' +
        '<a class="kpi" href="#/prijave"><span class="lbl"><span class="dotx pulse" style="background:#D97706"></span>Prijave na čekanju</span><span class="num">7</span><span class="sub">Najstarija čeka 6 dana</span></a>' +
        '<div class="kpi"><span class="lbl">Otvorenost newslettera</span><span class="num">48,6%</span><span class="sub">Prosek za 90 dana</span></div>' +
        '<div class="kpi dark"><span class="lbl">Mentori dostupni</span><span class="num">62</span><span class="sub">19 aktivnih parova</span></div>' +
      '</section>' +
      '<div class="split"><div class="main-col">' +
        '<section class="card" aria-labelledby="pend-h"><div class="card-head"><h2 class="h2" id="pend-h">Čekaju odobrenje</h2><a href="#/prijave" class="small" style="font-weight:500;display:inline-flex;align-items:center;gap:6px;min-height:44px">Sve prijave' + ic('right', 14, 2) + '</a></div>' +
          '<div class="list">' + map(pending, function (p) {
            return '<div class="row" style="flex-wrap:wrap">' + ava(p[1], p[2], p[3]) +
              '<span class="stack" style="flex:1 1 180px"><b>' + esc(p[0]) + '</b><span>' + esc(p[4] + ', ' + p[5]) + '</span></span>' +
              (p[7] ? '<span class="badge ok">Ispunjava uslove LC-a</span>' : '<span class="badge warn">Nedostaje 1 uslov</span>') +
              '<span class="small muted" style="min-width:72px;text-align:right">' + esc(p[6]) + '</span></div>';
          }) + '</div></section>' +
      '</div><div class="side-col">' +
        '<section class="card card-body" aria-labelledby="lc-h" style="display:flex;flex-direction:column;gap:14px"><h2 class="h2" id="lc-h">Alumni po LC-u</h2>' +
          map(LCS, function (l, i) {
            return '<div style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;justify-content:space-between;font-size:14px"><span>' + esc(l.name) + '</span><span class="mono" style="color:var(--ink-2)">' + l.n + '</span></div>' +
              '<div class="bar"><i class="' + (entering ? 'grow' : '') + '" style="width:' + Math.round(l.n / max * 100) + '%;animation-delay:' + (200 + i * 80) + 'ms"></i></div></div>';
          }) +
        '</section>' +
        '<section class="card card-body" aria-labelledby="ev-h" style="display:flex;flex-direction:column;gap:14px"><h2 class="h2" id="ev-h">Predstojeći događaji</h2>' +
          '<div class="row"><span class="date-tile"><small>NOV</small><b>14</b></span><span class="stack"><b style="font-size:14px">Alumni Homecoming, Novi Sad</b><span>86 potvrđenih dolazaka</span></span></div>' +
          '<div class="row"><span class="date-tile"><small>NOV</small><b>28</b></span><span class="stack"><b style="font-size:14px">Mentorski speed-networking, Beograd</b><span>23 od 30 mesta popunjeno</span></span></div>' +
        '</section>' +
      '</div></div>' +
      '<section class="card" aria-labelledby="nl-h"><div class="card-head"><h2 class="h2" id="nl-h">Poslednji newsletteri</h2><a href="#/newsletter" class="small" style="font-weight:500;min-height:44px;display:inline-flex;align-items:center">Otvori</a></div>' +
        '<div class="table-wrap" tabindex="0" role="region" aria-labelledby="nl-h"><table class="tbl stackable"><thead><tr><th scope="col">Naslov</th><th scope="col">Publika</th><th scope="col">Poslato</th><th scope="col" class="r">Otvoreno</th></tr></thead><tbody>' +
          map(news, function (n) {
            return '<tr><th scope="row" style="font-weight:500">' + esc(n[0]) + '</th><td data-label="Publika" class="muted">' + esc(n[1]) + '</td><td data-label="Poslato" class="muted">' + esc(n[2]) + '</td><td data-label="Otvoreno" class="r mono">' + esc(n[3]) + '</td></tr>';
          }) +
        '</tbody></table></div></section>';
  }

  /* ---------------- Ekran: Javna prijava ---------------- */
  function viewPrijava() {
    var step = S.apStep;
    var labels = ['Lični podaci', 'AIESEC put', 'Karijera', 'Slanje'];
    var perk = function (t) { return '<div class="perk"><i>' + ic('check', 13, 2.4, ' style="color:#7DB5F5"') + '</i><span>' + esc(t) + '</span></div>'; };
    var form = '';
    if (step === 1) {
      form = '<form class="pop" style="display:flex;flex-direction:column;gap:20px" onsubmit="return false">' +
        '<div style="display:flex;flex-direction:column;gap:6px"><h2 style="font-size:24px;letter-spacing:-.02em;font-weight:600">Lični podaci</h2><p class="lead">Ovi podaci su vidljivi samo odobrenim alumnijima i EB-u.</p></div>' +
        '<div class="grid-2"><div class="field"><label for="ime">Ime</label><input id="ime" class="input" value="Teodora" autocomplete="given-name"></div>' +
        '<div class="field"><label for="prezime">Prezime</label><input id="prezime" class="input" value="Vasić" autocomplete="family-name"></div></div>' +
        '<div class="field"><label for="email">Email</label><input id="email" type="email" class="input" value="teodora.vasic@" aria-invalid="true" aria-describedby="email-err" autocomplete="email" inputmode="email"><span id="email-err" class="err">Unesi celu email adresu, npr. ime@domen.rs</span></div>' +
        '<div class="grid-2"><div class="field"><label for="grad">Grad u kom živiš</label><input id="grad" class="input" value="Beograd" autocomplete="address-level2"></div>' +
        '<div class="field"><label for="tel">Telefon <span class="opt">(opciono)</span></label><input id="tel" type="tel" class="input" placeholder="+381 6x xxx xxxx" autocomplete="tel" inputmode="tel"></div></div>' +
        '<div class="field"><label for="li">LinkedIn profil <span class="opt">(opciono)</span></label><input id="li" class="input" placeholder="linkedin.com/in/…" inputmode="url"><span class="help">Pomaže tvom LC-u da brže pregleda prijavu.</span></div></form>';
    } else if (step === 2) {
      form = '<form class="pop" style="display:flex;flex-direction:column;gap:20px" onsubmit="return false">' +
        '<div style="display:flex;flex-direction:column;gap:6px"><h2 style="font-size:24px;letter-spacing:-.02em;font-weight:600">Tvoj put kroz AIESEC</h2><p class="lead">Na osnovu ovoga tvoj LC pregleda prijavu.</p></div>' +
        '<div class="grid-2"><div class="field"><label for="mc">Nacionalni komitet (MC)</label><select id="mc" class="input"><option>AIESEC in Serbia</option><option>Drugi MC</option></select></div>' +
        '<div class="field"><label for="lc">Lokalni komitet (LC)</label><select id="lc" class="input">' + map(['NS', 'MET', 'FON', 'EF', 'SINGI', 'KG', 'NIŠ', 'SUB'], function (c) { var l = LCS.filter(function (x) { return x.code === c; })[0]; return '<option>' + esc(l.name + ' (LC ' + c + ')') + '</option>'; }) + '</select><span class="help">LCP ovog LC-a odobrava tvoju prijavu.</span></div></div>' +
        '<div class="grid-2"><div class="field"><label for="od">Pridružio/la se</label><input id="od" class="input" value="Oktobar 2016"></div><div class="field"><label for="do">Završio/la članstvo</label><input id="do" class="input" value="Jul 2020"></div></div>' +
        '<fieldset style="margin:0;padding:0;border:0;display:flex;flex-direction:column;gap:10px"><legend class="legend" style="margin-bottom:10px">Pozicije u AIESEC-u</legend>' +
          map([['2016–2017', 'Član, oGV tim'], ['2017–2018', 'Team Leader, oGV'], ['2018–2020', 'LCVP Outgoing Exchange']], function (p) {
            return '<div class="pos-row"><span class="mono small muted" style="min-width:84px">' + p[0] + '</span><span style="flex:1 1 160px;font-weight:500">' + esc(p[1]) + '</span><button class="btn btn-icon btn-sm" type="button" aria-label="Ukloni poziciju ' + esc(p[1]) + '" style="border:0">' + ic('x', 16) + '</button></div>';
          }) +
          '<button class="btn btn-dashed" type="button" style="align-self:flex-start">' + ic('plus', 16) + 'Dodaj poziciju</button></fieldset>' +
        '<label class="check"><input type="checkbox" checked>Išao/la sam na razmenu (Global Volunteer, Talent ili Teacher)</label></form>';
    } else if (step === 3) {
      form = '<form class="pop" style="display:flex;flex-direction:column;gap:20px" onsubmit="return false">' +
        '<div style="display:flex;flex-direction:column;gap:6px"><h2 style="font-size:24px;letter-spacing:-.02em;font-weight:600">Karijera i interesovanja</h2><p class="lead">Pomaže drugim alumnijima i EB-u da te pronađu.</p></div>' +
        '<div class="grid-2"><div class="field"><label for="firma">Trenutna kompanija</label><input id="firma" class="input" value="Nordeus" autocomplete="organization"></div><div class="field"><label for="poz">Pozicija</label><input id="poz" class="input" value="Senior Product Manager" autocomplete="organization-title"></div></div>' +
        '<div class="field"><label for="ind">Industrija</label><select id="ind" class="input"><option>IT i softver</option><option>Konsalting</option><option>Finansije</option><option>FMCG</option><option>NVO i javni sektor</option><option>Preduzetništvo</option></select></div>' +
        '<div style="display:flex;flex-direction:column;gap:10px"><span class="legend">Prethodna iskustva</span><div class="pos-row"><span class="mono small muted" style="min-width:84px">2020–2023</span><span style="flex:1 1 160px;font-weight:500">Product Owner, HTEC Group</span></div>' +
          '<button class="btn btn-dashed" type="button" style="align-self:flex-start">' + ic('plus', 16) + 'Dodaj prethodni posao</button></div>' +
        '<fieldset style="margin:0;padding:0;border:0"><legend class="legend" style="margin-bottom:4px">Kako želiš da doprineseš</legend>' +
          '<label class="check"><input type="checkbox" checked>Mentorstvo trenutnim članovima</label>' +
          '<label class="check"><input type="checkbox">Predavanja i treninzi na konferencijama</label>' +
          '<label class="check"><input type="checkbox" checked>Oglasi za posao i praksu iz moje firme</label>' +
          '<label class="check"><input type="checkbox">Partnerstva i podrška LC-u</label></fieldset></form>';
    } else if (step === 4) {
      var dl = [['Ime i prezime', 'Teodora Vasić'], ['LC i MC', 'LC Novi Sad, AIESEC in Serbia'], ['Članstvo', 'Okt 2016 – Jul 2020, 3 pozicije'], ['Trenutno', 'Senior Product Manager, Nordeus']];
      form = '<form class="pop" style="display:flex;flex-direction:column;gap:20px" onsubmit="return false">' +
        '<div style="display:flex;flex-direction:column;gap:6px"><h2 style="font-size:24px;letter-spacing:-.02em;font-weight:600">Pregled i saglasnost</h2><p class="lead">Proveri podatke pre slanja. Možeš ih menjati i kasnije, na svom profilu.</p></div>' +
        '<dl class="card" style="margin:0">' + map(dl, function (d, i) {
          return '<div style="display:flex;flex-wrap:wrap;gap:4px 16px;padding:14px 16px;' + (i ? 'border-top:1px solid var(--line-2)' : '') + '"><dt style="flex:0 0 140px" class="small muted">' + esc(d[0]) + '</dt><dd style="margin:0;font-weight:500">' + esc(d[1]) + '</dd></div>';
        }) + '</dl>' +
        '<div><label class="check"><input type="checkbox" checked>Saglasan/na sam da AIESEC in Serbia čuva i obrađuje moje podatke u svrhu alumni mreže, u skladu sa politikom privatnosti.</label>' +
        '<label class="check"><input type="checkbox" checked>Želim da primam newslettere svog LC-a i MC-a. Odjava je moguća u svakom emailu.</label></div></form>';
    } else {
      form = '<div class="card pop" style="padding:32px;display:flex;flex-direction:column;gap:16px;box-shadow:var(--shadow)">' +
        '<span style="width:52px;height:52px;border-radius:16px;background:var(--ok-bg);color:var(--ok-ink);display:grid;place-items:center">' + ic('check', 26, 2) + '</span>' +
        '<h2 style="font-size:26px;letter-spacing:-.02em;font-weight:600">Prijava je poslata</h2>' +
        '<p class="lead">LC Novi Sad je dobio tvoju prijavu i pregledaće je. Kad je LCP odobri, stiže ti email sa linkom za ulazak na platformu.</p>' +
        '<div class="btn-row"><button class="btn" type="button" data-act="apReset">Nova prijava</button><a class="btn" href="#/pregled">Nazad na admin prikaz</a></div></div>';
    }
    return '' +
      '<div class="public">' +
        '<section class="public-aside">' +
          '<svg class="globe" width="420" height="420" viewBox="0 0 420 420" fill="none" aria-hidden="true"><circle cx="210" cy="210" r="200" stroke="#2A5BA0"/><circle cx="210" cy="210" r="150" stroke="#2A5BA0"/><ellipse cx="210" cy="210" rx="80" ry="200" stroke="#2A5BA0"/><path d="M10 210h400M40 110h340M40 310h340" stroke="#2A5BA0"/></svg>' +
          '<a class="brand" href="#/pregled" style="color:#F4F6FA;padding:0;position:relative"><span class="brand-mark">' + ic('globe', 17, 1.8, ' style="color:#fff"') + '</span><b style="font-size:15px">AIESEC Alumni Srbija</b></a>' +
          '<div style="display:flex;flex-direction:column;gap:14px;position:relative"><h1>Bio si deo AIESEC-a. Ostani deo mreže.</h1><p>Prijavi se u alumni bazu svog lokalnog komiteta. Prijavu pregleda i odobrava LCP tvog LC-a; posle toga dobijaš pristup imeniku, grupama i događajima.</p></div>' +
          '<div class="hide-narrow" style="display:flex;flex-direction:column;gap:12px;position:relative"><span style="font-size:13px;color:#8FA0B8">Šta dobijaš u mreži</span>' +
            perk('Imenik alumnija iz svih osam LC-ova u Srbiji') + perk('Grupe po interesovanjima, u koje ulaziš i iz kojih izlaziš kad hoćeš') + perk('Pozivi na Homecoming, konferencije i mentorski program') +
            '<span style="font-size:13px;color:#8FA0B8">Tvoj kontakt drugi LC-ovi dobijaju samo uz odobrenje tvog LCP-a.</span></div>' +
        '</section>' +
        '<section class="public-form"><div>' +
          when(step < 5, '<ol class="stepper" aria-label="Koraci prijave">' + map(labels, function (l, i) {
            var n = i + 1;
            return '<li class="' + (n < step ? 'done' : n === step ? 'cur' : '') + '"' + (n === step ? ' aria-current="step"' : '') + '><span>' + esc(n + '. ' + l) + '</span></li>';
          }) + '</ol>') +
          form +
          when(step < 5, '<div class="form-foot"><button class="btn" type="button" data-act="apBack"' + (step === 1 ? ' disabled style="opacity:.5"' : '') + '>Nazad</button>' +
            '<button class="btn btn-primary" type="button" data-act="apNext">' + (step === 4 ? 'Pošalji prijavu' : 'Dalje') + ic('right', 16, 2) + '</button></div>') +
        '</div></section>' +
      '</div>';
  }

  /* ---------------- Ekran: Prijave (LCP NS) ---------------- */
  function inTab(id, tab) { var s = S.apStatus[id]; return tab === 'pending' ? (s === 'pending' || s === 'info') : s === tab; }
  function pendingCount() { return APPLICANTS.filter(function (a) { return inTab(a.id, 'pending'); }).length; }

  function viewPrijave() {
    var labels = { pending: 'Na čekanju', approved: 'Odobreno', rejected: 'Odbijeno', info: 'Traži dopunu' };
    var cls = { pending: 'warn', approved: 'ok', rejected: 'bad', info: 'blue' };
    var visible = APPLICANTS.filter(function (a) { return inTab(a.id, S.apTab); });
    var sel = visible.filter(function (a) { return a.id === S.apSel; })[0];
    var list = visible.length ? map(visible, function (a) {
      var ok = a.criteria.filter(function (c) { return c[2]; }).length;
      var full = ok === a.criteria.length;
      return '<button class="md-item" type="button" data-act="apSel" data-v="' + a.id + '"' + (sel && sel.id === a.id ? ' aria-current="true"' : '') + '>' + ava(a.ini, a.bg, a.ink) +
        '<span class="stack" style="flex:1"><b>' + esc(a.name) + '</b><span>' + esc(a.headline) + '</span></span>' +
        '<span class="meta"><span class="small muted">' + esc(a.when) + '</span><span class="badge mono ' + (full ? 'ok' : 'warn') + '" aria-label="Uslovi: ' + ok + ' od ' + a.criteria.length + '">' + ok + '/' + a.criteria.length + '</span></span></button>';
    }) : '<div class="empty">' + ic('inbox', 40, 1.2, ' style="color:#C4C4CC"') + '<b>Ovde nema prijava</b><p>Kad neko izabere LC Novi Sad u javnoj prijavi, prijava se pojavljuje ovde.</p><a href="#/prijava" class="small" style="min-height:44px;display:inline-flex;align-items:center">Pogledaj javnu prijavu</a></div>';

    var detail = sel ? '' +
      '<section class="card raised" aria-labelledby="det-h">' +
        '<div class="card-head" style="justify-content:flex-start">' +
          '<button class="btn btn-sm back-phone" type="button" data-act="apBackList">' + ic('left', 16) + 'Lista</button>' +
          ava(sel.ini, sel.bg, sel.ink, 'lg') +
          '<span class="stack" style="flex:1 1 200px"><b id="det-h" style="font-size:20px;letter-spacing:-.02em">' + esc(sel.name) + '</b><span>' + esc(sel.email) + ', poslato ' + esc(sel.when) + '</span></span>' +
          '<span class="badge ' + cls[S.apStatus[sel.id]] + '">' + labels[S.apStatus[sel.id]] + '</span></div>' +
        '<div class="detail-grid"><div><h3 class="small muted" style="font-weight:600">Deklarisano iskustvo</h3>' +
          map(sel.positions, function (p) { return '<div class="row" style="align-items:baseline;gap:12px"><span class="mono small muted" style="min-width:80px">' + p[0] + '</span><span style="font-size:14px;font-weight:500">' + esc(p[1]) + '</span></div>'; }) +
          '<div style="height:1px;background:var(--line-2)"></div><div class="row" style="align-items:baseline;gap:12px"><span class="small muted" style="min-width:80px">Trenutno</span><span style="font-size:14px;font-weight:500">' + esc(sel.job) + '</span></div></div>' +
          '<div><h3 class="small muted" style="font-weight:600">Uslovi LC Novi Sad</h3>' +
          map(sel.criteria, function (c) {
            return '<div class="crit"><span class="ic" style="background:' + (c[2] ? 'var(--ok-bg);color:var(--ok-ink)' : 'var(--warn-bg);color:var(--warn-ink)') + '">' + ic(c[2] ? 'check' : 'alert', 12, 3) + '</span>' +
              '<span class="stack"><b style="font-size:14px;font-weight:500">' + esc(c[0]) + ' <span class="sr-only">' + (c[2] ? 'ispunjeno' : 'nije ispunjeno') + '</span></b><span>' + esc(c[1]) + '</span></span></div>';
          }) + '</div></div>' +
        '<div class="card-body" style="border-top:1px solid #EEEFF2;display:flex;flex-direction:column;gap:8px"><label for="note" style="font-size:14px;font-weight:500">Poruka podnosiocu <span class="muted" style="font-weight:400">(ide uz odluku)</span></label>' +
          '<textarea id="note" class="input" rows="2" placeholder="Npr. Dobro došla nazad! Vidimo se na Homecoming-u."></textarea></div>' +
        '<div class="card-body btn-row stretch" style="justify-content:flex-end;padding-top:0">' +
          '<button class="btn btn-danger" type="button" data-act="apDecide" data-v="rejected">Odbij</button>' +
          '<button class="btn" type="button" data-act="apDecide" data-v="info">Traži dopunu</button>' +
          '<button class="btn btn-primary" type="button" data-act="apDecide" data-v="approved">' + ic('check', 16, 2.2) + 'Odobri alumni status</button></div>' +
      '</section>' : '<div class="card empty hide-phone"><b>Izaberi prijavu sa liste</b></div>';

    return '' +
      '<div class="page-head"><div class="t"><span class="kicker">LC Novi Sad: vidiš i odobravaš samo prijave svog LC-a</span><h1 class="h1">Prijave za alumni status</h1></div>' +
        '<div class="seg" role="tablist" aria-label="Status prijava">' + map(['pending', 'approved', 'rejected'], function (k) {
          return '<button type="button" role="tab" aria-selected="' + (S.apTab === k) + '" data-act="apTab" data-v="' + k + '">' + labels[k] + ' <span class="n">' + APPLICANTS.filter(function (a) { return inTab(a.id, k); }).length + '</span></button>';
        }) + '</div></div>' +
      '<div class="md' + (S.apOpenPhone && sel ? ' has-detail' : '') + '"><section class="card md-list" aria-label="Lista prijava">' + list + '</section><div class="md-detail">' + detail + '</div></div>';
  }

  /* ---------------- Ekran: Alumni baza ---------------- */
  function dirBase() {
    var q = S.dirQ.trim().toLowerCase();
    return ALUMNI.filter(function (r) {
      if (S.dirMentor && !r.mentor) return false;
      if (!q) return true;
      return (r.name + ' ' + r.company + ' ' + r.title + ' ' + r.pos + ' ' + r.city).toLowerCase().indexOf(q) >= 0;
    });
  }
  function dirChips(base) {
    return '<button class="chip" type="button" aria-pressed="' + (S.dirLc === 'all') + '" data-act="dirLc" data-v="all">Svi LC-ovi <span class="n">' + base.length + '</span></button>' +
      map(LCS, function (l) {
        var n = base.filter(function (r) { return r.code === l.code; }).length;
        return '<button class="chip" type="button" aria-pressed="' + (S.dirLc === l.code) + '" data-act="dirLc" data-v="' + l.code + '">LC ' + esc(l.code) + ' <span class="n">' + n + '</span></button>';
      });
  }
  function dirResults(base) {
    var rows = base.filter(function (r) { return S.dirLc === 'all' || r.code === S.dirLc; });
    var head = '<div class="card-head" style="font-size:14px;color:var(--ink-3)"><span id="dir-cap">Prikazano <b class="mono" style="color:var(--ink);font-weight:500">' + rows.length + '</b> od 1.247</span><span class="hide-phone">Sortirano po poslednjoj aktivnosti</span></div>';
    if (!rows.length) {
      return head + '<div class="empty">' + ic('search', 40, 1.2, ' style="color:#C4C4CC"') + '<b>Nema alumnija za ove filtere</b><p>Probaj drugi LC ili isključi „Samo mentori”.</p><button class="btn" type="button" data-act="dirReset">Poništi filtere</button></div>';
    }
    return head + '<div class="table-wrap" tabindex="0" role="region" aria-labelledby="dir-cap"><table class="tbl stackable compact"><thead><tr>' +
      '<th scope="col">Alumni</th><th scope="col">LC</th><th scope="col">Najviša pozicija</th><th scope="col">Članstvo</th><th scope="col">Trenutno radi</th><th scope="col" class="r">Kontakt</th></tr></thead><tbody>' +
      map(rows, function (r) {
        return '<tr><th scope="row"><div class="row" style="gap:12px">' + ava(r.ini, r.bg, r.ink, 'sm') +
          '<span class="stack"><span style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><a href="#/profil" style="color:var(--ink);font-weight:600;text-decoration:none">' + esc(r.name) + '</a>' + when(r.mentor, '<span class="badge blue" style="padding:2px 8px;font-size:11px">Mentor</span>') + '</span><span>' + esc(r.city) + '</span></span></div></th>' +
          '<td data-label="LC"><span class="code">LC ' + esc(r.code) + '</span></td>' +
          '<td data-label="Pozicija"><span class="badge">' + esc(r.pos) + '</span></td>' +
          '<td data-label="Članstvo" class="mono small" style="color:var(--ink-2)">' + esc(r.years) + '</td>' +
          '<td data-label="Radi" class="wide"><span class="stack" style="text-align:inherit"><b style="font-size:14px;font-weight:500">' + esc(r.company) + '</b><span>' + esc(r.title) + '</span></span></td>' +
          '<td class="r full"><a class="btn btn-sm" href="#/profil">' + ic('lock', 14) + 'Zatraži kontakt</a></td></tr>';
      }) + '</tbody></table></div>';
  }
  function viewBaza() {
    var base = dirBase();
    return '' +
      '<div class="page-head"><div class="t"><span class="kicker">Odobreni alumniji iz svih 8 LC-ova. Kontakt se otključava zahtevom LCP-u.</span><h1 class="h1">Alumni baza</h1></div>' +
        '<div class="btn-row hide-phone"><button class="btn" type="button" data-act="soon">' + ic('down', 16) + 'Izvezi CSV</button><button class="btn" type="button" data-act="soon">' + ic('up', 16) + 'Uvezi listu</button><a class="btn btn-primary" href="#/grupe">Pozovi u grupu</a></div></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">' +
        '<div style="position:relative;flex:1 1 300px"><span style="position:absolute;left:14px;top:14px;color:var(--muted)">' + ic('search', 18) + '</span>' +
          '<label for="q" class="sr-only">Pretraga alumnija</label><input id="q" type="search" class="input" style="padding-left:42px" placeholder="Ime, kompanija, pozicija, grad…" value="' + esc(S.dirQ) + '" data-input="dirQ" autocomplete="off"></div>' +
        '<label class="chip" style="cursor:pointer;min-height:46px;border-radius:12px"><input type="checkbox" data-change="dirMentor"' + (S.dirMentor ? ' checked' : '') + ' style="width:18px;height:18px;accent-color:var(--accent)">Samo mentori</label></div>' +
      '<div class="chips scroll-phone" id="dir-chips" role="group" aria-label="Filter po LC-u">' + dirChips(base) + '</div>' +
      '<section class="card" aria-label="Rezultati" id="dir-results">' + dirResults(base) + '</section>';
  }

  /* ---------------- Ekran: Profil (gledano iz LC FON) ---------------- */
  function viewProfil() {
    var tl = [
      ['2016–2017', 'Članica, oGV tim', 'LC Novi Sad, prva godina, 14 realizovanih razmena', '#FFFFFF', '#A1A1AA'],
      ['2017–2018', 'Team Leader, Outgoing Global Volunteer', 'LC Novi Sad, tim od 6 članova', '#FFFFFF', '#0369D1'],
      ['2018–2020', 'LCVP Outgoing Exchange', 'LC Novi Sad, dva mandata', '#0369D1', '#0369D1'],
      ['2019', 'Global Talent, Lisabon', 'Razmena, 3 meseca u startupu', '#F59E0B', '#F59E0B']
    ];
    var contact = '';
    if (S.pf === 'idle') {
      contact = '<p class="small" style="color:var(--ink-3)">Teodora je alumni LC Novi Sad. Kontakt dobijaš kad tvoj zahtev odobri LCP Novog Sada.</p>' +
        '<button class="btn btn-primary" type="button" data-act="pf" data-v="form">Zatraži kontakt od LC Novi Sad</button>';
    } else if (S.pf === 'form') {
      contact = '<form class="pop" onsubmit="return false" style="display:flex;flex-direction:column;gap:12px;padding:14px;border-radius:14px;background:var(--surface-2);border:1px solid #EEEFF2">' +
        '<span class="small" style="color:var(--ink-3)">Zahtev ide: <b style="color:var(--ink)">Stefan Jovanović, LCP Novi Sad</b></span>' +
        '<div class="field"><label for="why" style="font-size:13px">Zašto želiš da je kontaktiraš</label><textarea id="why" class="input" rows="3" aria-describedby="why-help">Predavač na panelu o karijeri u IT-u, FON Leadership Days, 6. decembar.</textarea><span id="why-help" class="help" style="font-size:12px">Teodora vidi ovaj tekst ako zahtev bude odobren.</span></div>' +
        '<fieldset style="margin:0;padding:0;border:0"><legend class="small" style="font-weight:500;margin-bottom:2px">Kako želiš da je kontaktiraš</legend>' +
          '<label class="check" style="min-height:40px;padding:6px 0"><input type="checkbox" checked>Email</label><label class="check" style="min-height:40px;padding:6px 0"><input type="checkbox" checked>Telefonski poziv</label></fieldset>' +
        '<div class="btn-row stretch" style="justify-content:flex-end"><button class="btn btn-sm" type="button" data-act="pf" data-v="idle">Otkaži</button><button class="btn btn-sm btn-primary" type="button" data-act="pf" data-v="sent">Pošalji zahtev</button></div></form>';
    } else {
      contact = '<div class="pop" role="status" style="display:flex;flex-direction:column;gap:8px;padding:14px;border-radius:14px;background:#FFFBEB;border:1px solid #FDE68A">' +
        '<b style="display:flex;align-items:center;gap:8px;font-size:14px;color:var(--warn-ink)"><span class="dotx pulse" style="background:var(--warn-ink)"></span>Zahtev čeka odobrenje</b>' +
        '<span class="small" style="color:#713F12">Kad ga Stefan odobri, ovde se pojavljuju dugmad „Pošalji email” i „Pozovi”. Dobijaš i obaveštenje emailom.</span>' +
        '<a href="#/kontakt" class="small" style="font-weight:500;min-height:36px;display:inline-flex;align-items:center">Pogledaj kako LCP odobrava zahtev</a></div>';
    }
    return '' +
      '<a href="#/baza" class="hide-phone" style="align-self:flex-start;display:inline-flex;align-items:center;gap:6px;min-height:44px;font-size:14px;font-weight:500;text-decoration:none;color:var(--ink-3)">' + ic('left', 16) + 'Alumni baza</a>' +
      '<section class="card" style="overflow:hidden;border-radius:var(--r-xl)">' +
        '<div class="hero-band"><svg width="100%" height="120" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M0 90 C200 40 340 110 560 70 S920 20 1200 60" stroke="#2A5BA0"/><path d="M0 110 C240 60 420 120 640 86 S980 40 1200 84" stroke="#1E406F"/></svg></div>' +
        '<div class="profile-head"><div class="big-ava" aria-hidden="true">TV<span class="online breathe"></span></div>' +
          '<div style="flex:1 1 260px;display:flex;flex-direction:column;gap:6px"><h1 class="h1" style="font-size:28px">Teodora Vasić</h1><span style="color:var(--ink-2)">Senior Product Manager, Nordeus</span>' +
            '<div class="chips" style="gap:6px;padding-top:4px"><span class="badge mono">LC NS</span><span class="badge">AIESEC in Serbia</span><span class="badge ok">Otvorena za mentorstvo</span></div></div>' +
          '<span class="badge" style="padding:8px 12px;font-size:13px">' + ic('info', 14) + 'Drugi LC, samo pregled</span></div>' +
      '</section>' +
      '<div class="split"><div class="main-col">' +
        '<section class="card card-body" aria-labelledby="a-h" style="display:flex;flex-direction:column;gap:18px"><div style="display:flex;justify-content:space-between;gap:8px 12px;flex-wrap:wrap;align-items:baseline"><h2 class="h2" id="a-h">Put kroz AIESEC</h2><span class="small muted">3 godine i 9 meseci, odobrio LC Novi Sad</span></div>' +
          '<ol class="timeline">' + map(tl, function (t) {
            return '<li><span class="mono small muted" style="padding-top:2px">' + t[0] + '</span><span class="rail"><i style="background:' + t[3] + ';border-color:' + t[4] + '"></i></span><span class="what"><b style="font-size:15px;font-weight:600">' + esc(t[1]) + '</b><span class="small" style="color:var(--ink-3)">' + esc(t[2]) + '</span></span></li>';
          }) + '</ol></section>' +
        '<section class="card card-body" aria-labelledby="j-h" style="display:flex;flex-direction:column;gap:16px"><h2 class="h2" id="j-h">Karijera</h2>' +
          '<div class="row" style="align-items:flex-start"><span class="group-ico locked" style="font-weight:700">N</span><span class="stack"><b>Senior Product Manager</b><span>Nordeus, Beograd, 2023 – danas</span></span></div>' +
          '<div class="row" style="align-items:flex-start"><span class="group-ico" style="background:#F4F4F5;font-weight:700">H</span><span class="stack"><b>Product Owner</b><span>HTEC Group, Novi Sad, 2020 – 2023</span></span></div>' +
          '<div class="chips" style="gap:6px"><span class="badge">IT i softver</span><span class="badge">Product management</span><span class="badge">Gaming</span></div></section>' +
      '</div><div class="side-col">' +
        '<section class="card card-body" aria-labelledby="c-h" style="display:flex;flex-direction:column;gap:14px"><div class="row" style="gap:8px">' + ic('lock', 16) + '<h2 class="h2" id="c-h" style="font-size:15px">Kontakt</h2></div>' +
          '<div class="stack"><span>Email</span><span class="blurred" aria-hidden="true" style="font-size:14px;color:var(--ink)">teodora.vasic@gmail.com</span><span class="sr-only">Sakriveno do odobrenja</span></div>' +
          '<div class="stack"><span>Telefon</span><span class="blurred" aria-hidden="true" style="font-size:14px;color:var(--ink)">+381 63 555 0192</span><span class="sr-only">Sakriveno do odobrenja</span></div>' +
          '<div class="stack"><span>Grad</span><b style="font-size:14px;font-weight:400">Beograd</b></div>' + contact + '</section>' +
        '<section class="card card-body" aria-labelledby="g-h" style="display:flex;flex-direction:column;gap:12px"><h2 class="h2" id="g-h" style="font-size:15px">Otvorene grupe</h2>' +
          '<div class="chips" style="gap:6px"><span class="badge blue">IT industrija</span><span class="badge blue">Alumni u Beogradu</span></div><span class="small muted">Zatvorene grupe vide samo njihovi članovi.</span></section>' +
      '</div></div>';
  }

  /* ---------------- Ekran: Newsletter (LCP NS) ---------------- */
  var NL_GROUPS = [['all', 'Svi alumniji LC Novi Sad', 196], ['lead', 'Bivši VP-ovi i LCP-ovi', 41], ['mentor', 'Mentori 2026/27', 17], ['it', 'IT industrija', 96], ['gen', 'Generacije 2012–2016', 74], ['vol', 'Homecoming volonteri', 22]];
  function nlTotal() {
    if (S.nlOn.all) return 196;
    var sel = NL_GROUPS.filter(function (g) { return S.nlOn[g[0]]; });
    var raw = sel.reduce(function (a, g) { return a + g[2]; }, 0);
    return Math.round(raw * (sel.length > 1 ? 0.83 : 1));
  }
  function viewNewsletter() {
    var total = nlTotal();
    return '' +
      '<div class="page-head"><div class="t"><span class="kicker">Nacrt je sačuvan pre 12 sekundi</span><h1 class="h1">Novi newsletter</h1></div>' +
        '<div class="btn-row stretch"><button class="btn hide-phone" type="button" data-act="toastMsg" data-v="Test je poslat na tvoj email.">Pošalji test sebi</button><button class="btn" type="button" data-act="toastMsg" data-v="Zakazivanje stiže u pravoj verziji.">' + ic('clock', 16) + 'Zakaži</button>' +
        '<button class="btn btn-primary" type="button" data-act="nlSend"' + (total ? '' : ' disabled') + '>' + ic('send', 16) + 'Pošalji' + (total ? ' (' + total + ')' : '') + '</button></div></div>' +
      when(S.nlSent, '<div class="card pop" role="status" style="display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 20px;background:#ECFDF3;border-color:#BBF7D0"><span style="width:36px;height:36px;border-radius:12px;background:var(--ok-bg);color:var(--ok-ink);display:grid;place-items:center">' + ic('check', 18, 2.2) + '</span>' +
        '<span style="flex:1 1 240px;font-size:14px;color:#14532D"><b>Newsletter je poslat.</b> Statistika otvaranja se pojavljuje za oko sat vremena.</span><button class="btn btn-sm" type="button" data-act="nlUndo">Poništi slanje (30 s)</button></div>') +
      '<div class="split"><div class="main-col" style="flex:1.15 1 460px">' +
        '<section class="card card-body" aria-labelledby="aud-h" style="display:flex;flex-direction:column;gap:14px"><div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px"><h2 class="h2" id="aud-h">Kome šalješ</h2><span class="small" style="color:var(--ink-3)"><b class="mono" style="color:var(--ink);font-weight:500">' + total + '</b> primalaca, bez duplikata</span></div>' +
          '<div class="chips" role="group" aria-label="Grupe primalaca">' + map(NL_GROUPS, function (g) {
            var on = !!S.nlOn[g[0]];
            return '<button class="chip soft" type="button" aria-pressed="' + on + '" data-act="nlToggle" data-v="' + g[0] + '">' + when(on, ic('check', 14, 2.6)) + esc(g[1]) + ' <span class="n">' + g[2] + '</span></button>';
          }) + '<a class="chip" href="#/grupe" style="border-style:dashed">' + ic('plus', 14, 2) + 'Nova grupa</a></div>' +
          '<span class="small muted">Kao LCP šalješ alumnijima svog LC-a i grupama koje si napravio. Ko je izašao iz grupe ili se odjavio, automatski je isključen.</span></section>' +
        '<section class="card card-body" aria-labelledby="cnt-h" style="display:flex;flex-direction:column;gap:16px"><h2 class="h2" id="cnt-h">Sadržaj</h2>' +
          '<div class="field"><label for="sub">Naslov emaila</label><input id="sub" class="input" value="Homecoming 2026: vidimo se 14. novembra"></div>' +
          '<div class="field"><label for="pre">Pretekst <span class="opt">(vidi se u inboxu)</span></label><input id="pre" class="input" value="Prijave za večeru su otvorene do 7. novembra."></div>' +
          '<div style="display:flex;flex-direction:column;gap:10px"><span class="legend">Blokovi</span>' +
            '<div class="blk"><span class="k">Naslov</span><span class="v">Dragi alumniji LC Novi Sad,</span></div>' +
            '<div class="blk"><span class="k">Tekst</span><span class="v" style="color:var(--ink-2)">Ove godine slavimo 30 godina LC-a. Okupljamo sve generacije…</span></div>' +
            '<div class="blk" style="border-color:#B9D5F6;background:#F7FAFE"><span class="k" style="color:var(--accent-ink)">Događaj</span><span class="v">Alumni Homecoming, 14. nov, [MESTO]</span><span class="small hide-phone" style="color:var(--accent-ink)">sa potvrdom dolaska</span></div>' +
            '<div class="blk"><span class="k">Dugme</span><span class="v">Potvrdi dolazak</span></div>' +
            '<div class="chips" style="gap:6px">' + map(['Tekst', 'Slika', 'Oglas za posao', 'Alumni priča'], function (t) { return '<button class="btn btn-sm" type="button" data-act="soon">' + ic('plus', 14) + esc(t) + '</button>'; }) + '</div></div></section>' +
      '</div><div class="side-col" style="flex:1 1 360px">' +
        '<section class="preview-pane" aria-label="Pregled emaila"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="small" style="font-weight:600;color:var(--ink-2)">Pregled</span>' +
          '<div class="seg" role="tablist" aria-label="Veličina pregleda" style="background:#DCDEE3;padding:3px"><button type="button" role="tab" aria-selected="' + !S.nlMobile + '" data-act="nlMobile" data-v="0" style="min-height:34px;font-size:13px">Računar</button><button type="button" role="tab" aria-selected="' + S.nlMobile + '" data-act="nlMobile" data-v="1" style="min-height:34px;font-size:13px">Telefon</button></div></div>' +
          '<article class="mail" style="max-width:' + (S.nlMobile ? '340px' : '560px') + '"><div style="padding:14px 20px;border-bottom:1px solid var(--line-2)"><div class="small muted">Od: AIESEC Alumni, LC Novi Sad</div><b style="font-size:15px">Homecoming 2026: vidimo se 14. novembra</b></div>' +
            '<div style="padding:22px;display:flex;flex-direction:column;gap:14px"><div style="height:110px;border-radius:12px;background:var(--navy);display:flex;align-items:flex-end;padding:16px"><span style="color:#F4F6FA;font-size:20px;font-weight:600;letter-spacing:-.02em">30 godina LC Novi Sad</span></div>' +
              '<p style="font-weight:600">Dragi alumniji LC Novi Sad,</p><p class="small" style="line-height:1.6;color:var(--ink-2)">Ove godine slavimo 30 godina LC-a. Okupljamo sve generacije na jednom mestu: od prvih članova do onih koji su predali mandat ovog leta.</p>' +
              '<div class="row" style="padding:12px;border-radius:12px;border:1px solid #E4E4E7;gap:12px"><span class="date-tile" style="width:44px"><small>NOV</small><b style="font-size:17px">14</b></span><span class="stack"><b style="font-size:14px">Alumni Homecoming</b><span>19:00, [MESTO]</span></span></div>' +
              '<a href="#/newsletter" class="btn btn-primary" style="align-self:flex-start">Potvrdi dolazak</a>' +
              '<span class="small muted" style="padding-top:8px;border-top:1px solid var(--line-2);font-size:12px">Dobijaš ovaj email kao alumni LC Novi Sad. Odjavi se ili promeni podešavanja obaveštenja.</span></div></article></section>' +
      '</div></div>';
  }

  /* ---------------- Ekran: Grupe (LCP) ---------------- */
  var RULES = {
    pos: ['Pozicija u AIESEC-u', 'je jedna od', 'Član oGX, TL oGX, LCVP oGX', 'Pozicija', 0.36],
    ind: ['Industrija', 'je', 'IT i softver', 'Industrija', 0.31],
    gen: ['Godina pridruživanja', 'između', '2012 i 2018', 'Generacija', 0.55],
    city: ['Grad', 'je', 'Beograd', 'Grad', 0.28],
    mentor: ['Otvoren/a za mentorstvo', 'je', 'Da', 'Mentorstvo', 0.2],
    exch: ['Išao/la na razmenu', 'je', 'Da', 'Razmena', 0.48]
  };
  function viewGrupe() {
    var lk = S.grLocked;
    var m = 196; S.grRules.forEach(function (k) { m *= RULES[k][4]; });
    var matches = Math.max(1, Math.round(m));
    var existing = [
      ['Svi alumniji LC Novi Sad', 'Zatvorena, osnovna grupa LC-a', 196, '3 izašlo', true],
      ['Bivši VP-ovi i LCP-ovi', 'Zatvorena, 1 poziv na čekanju', 41, 'niko nije izašao', true],
      ['Organizatori Homecoming-a', 'Zatvorena, ručni pozivi', 9, '1 izašao', true],
      ['Homecoming volonteri', 'Otvorena, LC Novi Sad', 22, '2 izašla', false],
      ['IT industrija', 'Otvorena, napravio MC', 287, '11 izašlo', false]
    ];
    return '' +
      '<div class="page-head"><div class="t"><span class="kicker">Grupe pravi samo LCP (za svoj LC) i MCP (za sve)</span><h1 class="h1">Grupe</h1></div>' +
        '<a href="#/moje-grupe" class="small" style="font-weight:500;display:inline-flex;align-items:center;gap:6px;min-height:44px">Kako alumni vidi grupe' + ic('right', 14, 2) + '</a></div>' +
      '<div class="split">' +
        '<section class="side-col" aria-label="Postojeće grupe" style="flex:1 1 320px;gap:10px">' + map(existing, function (g) {
          return '<div class="card row" style="padding:16px 18px"><span class="group-ico ' + (g[4] ? 'locked' : 'open') + '">' + ic(g[4] ? 'lock' : 'group', 17, 1.8) + '</span>' +
            '<span class="stack" style="flex:1"><b>' + esc(g[0]) + '</b><span>' + esc(g[1]) + '</span></span><span class="stack" style="align-items:flex-end"><b class="mono" style="font-weight:500;font-size:14px">' + g[2] + '</b><span style="font-size:12px">' + esc(g[3]) + '</span></span></div>';
        }) + '</section>' +
        '<section class="card raised main-col" aria-labelledby="new-h" style="flex:2 1 520px;gap:0">' +
          '<div class="card-body" style="display:flex;flex-direction:column;gap:14px;border-bottom:1px solid #EEEFF2"><h2 class="h2" id="new-h" style="font-size:18px">Nova grupa</h2>' +
            '<div class="field"><label for="gname">Naziv</label><input id="gname" class="input" value="' + (lk ? 'Bivši oGX tim, IT industrija' : 'Alumni u IT-u, Novi Sad') + '"></div>' +
            '<div role="radiogroup" aria-label="Tip grupe" class="grid-2" style="gap:10px">' +
              '<button class="type-card" type="button" role="radio" aria-checked="' + !lk + '" data-act="grType" data-v="open"><b style="display:flex;align-items:center;gap:8px;font-size:14px">' + ic('group', 16, 1.8) + 'Otvorena</b><span class="small" style="color:var(--ink-3)">Vide je svi alumniji. Ulaze i izlaze sami, bez odobrenja.</span></button>' +
              '<button class="type-card" type="button" role="radio" aria-checked="' + lk + '" data-act="grType" data-v="lock"><b style="display:flex;align-items:center;gap:8px;font-size:14px">' + ic('lock', 16, 1.8) + 'Zatvorena</b><span class="small" style="color:var(--ink-3)">Nevidljiva dok ne dobiješ poziv. Ulaz samo na poziv LCP-a ili MCP-a, izlaz uvek slobodan.</span></button></div></div>' +
          '<div class="card-body" style="display:flex;flex-direction:column;gap:12px"><span style="font-size:14px;font-weight:500">' + (lk ? 'Koga pozivaš' : 'Koga obaveštavaš o grupi') + ' <span class="muted" style="font-weight:400">' + (lk ? '(samo pozvani vide grupu)' : '(opciono, grupu svakako vide svi)') + '</span></span>' +
            map(S.grRules, function (k, i) {
              var r = RULES[k];
              return '<div class="rule"><span class="j">' + (i ? 'I' : 'AKO') + '</span><span class="pill-field" style="flex:1 1 140px">' + esc(r[0]) + '</span><span class="small" style="color:var(--ink-3)">' + esc(r[1]) + '</span><span class="pill-field val" style="flex:2 1 160px">' + esc(r[2]) + '</span>' +
                '<button class="btn btn-icon btn-sm" type="button" style="border:0;background:transparent" aria-label="Ukloni kriterijum ' + esc(r[3]) + '" data-act="grDel" data-v="' + k + '">' + ic('x', 16) + '</button></div>';
            }) +
            when(!S.grRules.length, '<span class="small muted">Bez kriterijuma poziv ide svim alumnijima LC Novi Sad.</span>') +
            '<div class="chips" style="gap:6px">' + map(Object.keys(RULES).filter(function (k) { return S.grRules.indexOf(k) < 0; }), function (k) {
              return '<button class="btn btn-sm btn-dashed" type="button" data-act="grAdd" data-v="' + k + '">' + ic('plus', 13, 2) + esc(RULES[k][3]) + '</button>';
            }) + '<a class="btn btn-sm btn-dashed" href="#/baza">Izaberi pojedinačno iz baze</a></div></div>' +
          '<div class="card-body" style="border-top:1px solid #EEEFF2;background:var(--surface-2);border-radius:0 0 var(--r-lg) var(--r-lg);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px">' +
            '<span style="display:flex;align-items:center;gap:12px"><span style="display:flex">' + ava('TV', '#DCEBFB', '#0352A8', 'sm') + '<span style="margin-left:-10px;display:flex">' + ava('VM', '#F1E6FA', '#6B21A8', 'sm') + '</span><span style="margin-left:-10px;display:flex">' + ava('SP', '#E0F2F1', '#115E59', 'sm') + '</span></span>' +
            '<span class="small" style="color:var(--ink-2)"><b class="mono" style="color:var(--ink);font-weight:500">' + matches + '</b> ' + (lk ? 'alumnija dobija poziv emailom' : 'alumnija dobija obaveštenje') + '</span></span>' +
            '<button class="btn btn-primary" type="button" data-act="toastMsg" data-v="' + (lk ? 'Grupa je napravljena, pozivi su poslati.' : 'Otvorena grupa je napravljena.') + '">' + (lk ? 'Napravi i pošalji pozive' : 'Napravi otvorenu grupu') + '</button></div>' +
        '</section></div>';
  }

  /* ---------------- Ekran: Uloge (MCP) ---------------- */
  var ADMINS = [
    ['Milica Ranković', 'MR', '#18181B', '#FFFFFF', 'MCP, glavni admin', 'MC', '9 (MC EB)', '31.07.2027.', 'Aktivan', 'ok'],
    ['Uroš Mladenović', 'UM', '#FDE8D7', '#9A3412', 'LCP', 'LC MET', '6', '31.01.2027.', 'Aktivan', 'ok'],
    ['Đorđe Lazić', 'ĐL', '#EDE9FE', '#5B21B6', 'LCP', 'LC FON', '7', '31.01.2027.', 'Aktivan', 'ok'],
    ['Stefan Jovanović', 'SJ', '#0F3D2E', '#FFFFFF', 'LCP', 'LC NS', '6', '31.01.2027.', 'Aktivan', 'ok'],
    ['Jelena Ćirić', 'JĆ', '#E0F2F1', '#115E59', 'LCP', 'LC EF', '5', '31.01.2027.', 'Aktivan', 'ok'],
    ['Luka Jeremić', 'LJ', '#F4F4F5', '#27272A', 'LCP', 'LC KG', '5', '31.10.2026.', 'Primopredaja za 8 dana', 'warn'],
    ['Tamara Nikolić', 'TN', '#F1E6FA', '#6B21A8', 'LCP', 'LC NIŠ', '4', '31.01.2027.', 'Aktivan', 'ok'],
    ['Aleksa Popović', 'AP', '#DCEBFB', '#0352A8', 'LCP', 'LC SINGI', '5', '31.01.2027.', 'Aktivan', 'ok'],
    ['Upražnjeno', '?', '#F4F4F5', '#63636B', 'LCP', 'LC SUB', '3', '—', 'MCP pokriva LC', 'bad']
  ];
  var PERMS = [
    ['Pregled cele baze alumnija', 'y', 'y', 'y', 'y'],
    ['Izmena profila', 'samo svoj', 'n', 'svoj LC', 'y'],
    ['Odobravanje i odbijanje prijava', 'n', 'n', 'svoj LC', 'y'],
    ['Uklanjanje alumnija', 'n', 'n', 'svoj LC', 'y'],
    ['Uslovi za alumni status', 'n', 'n', 'svoj LC', 'y'],
    ['Pravljenje grupa i slanje poziva', 'n', 'n', 'svoj LC', 'y'],
    ['Ulazak i izlazak iz otvorenih grupa', 'y', 'n', 'n', 'n'],
    ['Slanje newslettera', 'n', 'n', 'svoj LC', 'y'],
    ['Kontakt alumnija svog LC-a', 'n', 'y', 'y', 'uz zahtev'],
    ['Kontakt alumnija drugog LC-a', 'n', 'uz zahtev', 'uz zahtev', 'uz zahtev'],
    ['Odobravanje zahteva za kontakt', 'n', 'n', 'svoj LC', 'ako nema LCP-a'],
    ['Izvoz podataka (CSV)', 'n', 'n', 'svoj LC', 'y'],
    ['Dodela uloga i EB pristupa', 'n', 'n', 'svoj EB', 'y'],
    ['Primopredaja mandata nasledniku', 'n', 'n', 'LCP na LCP', 'MCP na MCP']
  ];
  var COND_DEF = [['Najmanje 12 meseci članstva', 'Ukupno, u jednom ili više LC-ova'], ['Bar jedna uloga vođstva', 'Team Leader, VP, LCP ili predsednik OC-a'], ['Potvrda iz evidencije članova', 'Poklapanje sa uvezenom listom članova LC-a'], ['Bez otvorenih obaveza prema LC-u', 'LCP potvrđuje ručno']];
  var COND_CUSTOM = {
    MET: [['Najmanje 2 semestra članstva', 'Računa se samo članstvo u LC MET'], ['Učešće na bar jednoj nacionalnoj konferenciji', 'Delegat ili OC'], ['Preporuka LCP-a iz mandata', 'LCP iz godine kad je osoba bila član']],
    FON: [['Najmanje 12 meseci članstva', 'Ukupno, u jednom ili više LC-ova'], ['Završen projekat ili razmena', 'Projekat u LC-u ili Global Volunteer, Talent, Teacher']],
    NS: COND_DEF.concat([['Razmena kao alternativni put', 'Ko je bio na razmeni može postati alumni i bez 12 meseci članstva', true]])
  };
  var EDITORS = { MET: 'Uroš Mladenović, LCP', FON: 'Đorđe Lazić, LCP', NS: 'Stefan Jovanović, LCP', EF: 'Jelena Ćirić, LCP', KG: 'Luka Jeremić, LCP', 'NIŠ': 'Tamara Nikolić, LCP', SINGI: 'Aleksa Popović, LCP', SUB: 'MCP (LCP upražnjen)' };

  function permCell(v, label) {
    if (v === 'y') return '<td class="c" data-label="' + label + '"><span class="yes" role="img" aria-label="Da">' + ic('check', 18, 2.4) + '</span></td>';
    if (v === 'n') return '<td class="c" data-label="' + label + '"><span class="no-dash" role="img" aria-label="Ne"></span></td>';
    return '<td class="c" data-label="' + label + '"><span class="small" style="font-weight:500;color:' + (v === 'uz zahtev' ? 'var(--warn-ink)' : 'var(--accent-ink)') + '">' + esc(v) + '</span></td>';
  }
  function viewUloge() {
    var lc = S.rlLc;
    var list = COND_CUSTOM[lc] || COND_DEF;
    var name = LCS.filter(function (l) { return l.code === lc; })[0].name;
    return '' +
      '<div class="page-head"><div class="t"><span class="kicker">Administracija: MCP vidi i menja sve</span><h1 class="h1">Uloge, pristup i uslovi</h1></div></div>' +
      '<section class="roles" aria-label="Nivoi pristupa">' +
        '<div class="role dark"><span class="k">Glavni admin</span><b>MCP</b><p>Menja sve, u svim LC-ovima. Ulogu dobija i predaje kroz primopredaju mandata.</p></div>' +
        '<div class="role blue"><span class="k">Lokalni admin</span><b>LCP</b><p>Menja sve za svoj LC. Ulogu dobija i predaje kroz primopredaju.</p></div>' +
        '<div class="role"><span class="k">Pregled</span><b>EB (LC i MC)</b><p>Vide celu bazu i ne menjaju ništa. Kontakt traže zahtevom.</p></div>' +
        '<div class="role"><span class="k">Pregled</span><b>Alumniji</b><p>Vide imenik, menjaju svoj profil, ulaze i izlaze iz grupa.</p></div></section>' +
      '<p class="small muted" style="margin-top:-8px">Trenutni članovi koji nisu u EB-u nemaju pristup platformi.</p>' +
      '<section class="card" aria-labelledby="adm-h"><div class="card-head"><div class="stack" style="gap:4px"><h2 class="h2" id="adm-h">Admini i EB pristup</h2><span>Admin prava ističu kad se mandat završi. Odlazeći MCP i LCP-ovi ih predaju nasledniku; LCP dodaje i uklanja svoj EB, MCP svoj MC EB.</span></div>' +
        '<button class="btn" type="button" data-act="soon">' + ic('swap', 16) + 'Pokreni primopredaju</button></div>' +
        '<div class="table-wrap" tabindex="0" role="region" aria-labelledby="adm-h"><table class="tbl stackable compact"><thead><tr><th scope="col">Admin</th><th scope="col">Uloga</th><th scope="col">Opseg</th><th scope="col">EB sa pregledom</th><th scope="col">Mandat do</th><th scope="col" class="r">Status</th></tr></thead><tbody>' +
          map(ADMINS, function (a) {
            return '<tr><th scope="row"><div class="row" style="gap:10px">' + ava(a[1], a[2], a[3], 'sm') + '<b style="font-weight:600">' + esc(a[0]) + '</b></div></th><td data-label="Uloga">' + esc(a[4]) + '</td><td data-label="Opseg"><span class="code">' + esc(a[5]) + '</span></td>' +
              '<td data-label="EB" class="mono small keep">' + esc(a[6]) + '</td><td data-label="Do" class="mono small keep">' + esc(a[7]) + '</td><td data-label="Status" class="r"><span class="badge ' + a[9] + '">' + esc(a[8]) + '</span></td></tr>';
          }) + '</tbody></table></div></section>' +
      '<section class="card" aria-labelledby="perm-h"><div class="card-head"><h2 class="h2" id="perm-h">Ko šta sme</h2></div>' +
        '<div class="table-wrap" tabindex="0" role="region" aria-labelledby="perm-h"><table class="tbl stackable perm"><thead><tr><th scope="col">Dozvola</th><th scope="col" class="c">Alumni</th><th scope="col" class="c">EB (LC/MC)</th><th scope="col" class="c" style="background:#F7FAFE">LCP</th><th scope="col" class="c" style="background:#F0F6FE">MCP</th></tr></thead><tbody>' +
          map(PERMS, function (p) {
            return '<tr><th scope="row" style="font-weight:500">' + esc(p[0]) + '</th>' + permCell(p[1], 'Alumni') + permCell(p[2], 'EB') + permCell(p[3], 'LCP') + permCell(p[4], 'MCP') + '</tr>';
          }) + '</tbody></table></div></section>' +
      '<section class="card card-body" aria-labelledby="cond-h" style="display:flex;flex-direction:column;gap:14px"><div class="stack" style="gap:4px"><h2 class="h2" id="cond-h">Uslovi za alumni status, po LC-u</h2><span>Svaki LCP podešava uslove svog LC-a. Ne prikazuju se u javnoj prijavi; LCP ih koristi kao podsetnik pri odobravanju.</span></div>' +
        '<div class="chips scroll-phone" role="tablist" aria-label="LC">' + map(LCS, function (l) {
          return '<button class="chip" type="button" role="tab" aria-selected="' + (l.code === lc) + '" data-act="rlLc" data-v="' + l.code + '">LC ' + esc(l.code) + '</button>';
        }) + '</div>' +
        '<div class="pop" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:12px 16px;border-radius:12px;background:var(--surface-2);border:1px solid #EEEFF2"><span style="font-size:14px"><b>' + esc(name) + '</b> <span class="muted">uređuje ' + esc(EDITORS[lc]) + '</span></span>' +
          '<span class="badge ' + (COND_CUSTOM[lc] ? 'blue' : '') + '">' + (COND_CUSTOM[lc] ? 'Prilagođeni uslovi' : 'Podrazumevani uslovi MC-a') + '</span></div>' +
        '<div>' + map(list, function (c, i) {
          var key = lc + ':' + i;
          var on = S.rlOff[key] === undefined ? !c[2] : !S.rlOff[key];
          return '<div class="cond"><span class="stack" style="flex:1 1 260px"><b style="font-weight:500">' + esc(c[0]) + '</b><span>' + esc(c[1]) + '</span></span>' +
            '<button class="switch" type="button" role="switch" aria-checked="' + on + '" aria-label="' + esc(c[0]) + '" data-act="rlToggle" data-v="' + key + '" data-on="' + on + '"><span class="track"><span class="knob"></span></span></button></div>';
        }) + '<button class="btn btn-dashed btn-sm" type="button" data-act="soon" style="margin-top:8px">' + ic('plus', 14, 2) + 'Dodaj uslov</button></div></section>';
  }

  /* ---------------- Ekran: Zahtevi za kontakt (LCP NS) ---------------- */
  function ctPending() { return Object.keys(S.ctSt).filter(function (k) { return S.ctSt[k] === 'pending'; }).length; }
  function viewKontakt() {
    var look = { pending: ['Čeka tvoju odluku', 'warn'], approved: ['Odobreno, kontakt podeljen na 30 dana', 'ok'], declined: ['Odbijeno, podnosilac je obavešten', 'bad'] };
    var incoming = [
      { id: 'a', from: 'Đorđe Lazić', role: 'LCP, LC FON', ini: 'ĐL', bg: '#EDE9FE', ink: '#5B21B6', when: 'Pre 3 sata', alum: 'Teodora Vasić', meta: 'LCVP oGX 2018–2020, Senior PM u Nordeusu', reason: 'Predavač na panelu o karijeri u IT-u, FON Leadership Days, 6. decembar.', ch: 'Email i telefon' },
      { id: 'b', from: 'Milica Ranković', role: 'MCP', ini: 'MR', bg: '#18181B', ink: '#FFFFFF', when: 'Juče, 18:20', alum: 'Vuk Marković', meta: 'LCP 2015–2016, osnivač Frame Studija', reason: 'Govornik na panelu o preduzetništvu, nacionalna konferencija u martu.', ch: 'Telefon' }
    ];
    var isIn = S.ctTab === 'in';
    var body = isIn ? map(incoming, function (r) {
      var s = S.ctSt[r.id];
      return '<article class="card"><div class="card-head" style="justify-content:flex-start">' + ava(r.ini, r.bg, r.ink) +
        '<span class="stack" style="flex:1 1 220px"><span style="font-size:15px"><b>' + esc(r.from) + '</b> <span class="muted">(' + esc(r.role) + ')</span> traži kontakt</span><span>' + esc(r.when) + '</span></span>' +
        '<span class="badge ' + look[s][1] + '">' + when(s === 'pending', '<span class="dotx pulse" style="width:7px;height:7px;background:currentColor"></span>') + look[s][0] + '</span></div>' +
        '<div class="req-grid"><div class="stack" style="gap:4px"><span class="k">Alumni</span><a href="#/profil" style="font-weight:600;text-decoration:none">' + esc(r.alum) + '</a><span>' + esc(r.meta) + '</span></div>' +
          '<div class="stack" style="gap:4px"><span class="k">Svrha</span><span style="font-size:14px;color:var(--ink);line-height:1.5">' + esc(r.reason) + '</span></div>' +
          '<div class="stack" style="gap:4px"><span class="k">Traži</span><span style="font-size:14px;color:var(--ink)">' + esc(r.ch) + '</span></div></div>' +
        when(s === 'pending', '<div class="card-body" style="border-top:1px solid var(--line-2);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px"><span class="small muted" style="max-width:52ch">Alumni dobija obaveštenje ko je dobio njegov kontakt i zašto.</span>' +
          '<div class="btn-row stretch"><button class="btn btn-danger" type="button" data-act="ctSet" data-v="' + r.id + ':declined">Odbij</button><button class="btn btn-primary" type="button" data-act="ctSet" data-v="' + r.id + ':approved">' + ic('check', 16, 2.2) + 'Odobri kontakt</button></div></div>') +
        '</article>';
    }) : '' +
      '<article class="card raised" style="border-color:#BBE3C8"><div class="card-head" style="justify-content:flex-start">' + ava('MS', '#FCE7F3', '#9D174D') +
        '<span class="stack" style="flex:1 1 220px"><b style="font-size:16px">Mina Stojanović</b><span>LC Niš, Engineering Manager u HTEC Group</span></span><span class="badge ok">Odobreno, važi još 27 dana</span></div>' +
        '<div class="card-body" style="display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px"><div class="stack" style="flex:1 1 260px;gap:4px"><span>Odobrila Tamara Nikolić, LCP Niš. Svrha: trener na LC Novi Sad Leadership Summit-u.</span>' +
          '<span style="font-size:15px;color:var(--ink);word-break:break-word"><span class="mono">mina.stojanovic@gmail.com</span><br><span class="mono">+381 64 218 3907</span></span></div>' +
          '<div class="btn-row stretch"><a class="btn" href="tel:+381642183907">' + ic('phone', 16) + 'Pozovi</a><a class="btn btn-primary" href="mailto:mina.stojanovic@gmail.com?subject=Poziv%20za%20trenera%2C%20LC%20Novi%20Sad">' + ic('mail', 16) + 'Pošalji email</a></div></div></article>' +
      '<article class="card row" style="padding:18px 22px;flex-wrap:wrap">' + ava('LM', '#E3F4E8', '#166534') + '<span class="stack" style="flex:1 1 220px"><b style="font-size:16px">Lazar Mitrović</b><span>LC Metropolitan, čeka LCP-a LC MET, poslato juče</span></span><span class="badge warn"><span class="dotx pulse" style="width:7px;height:7px;background:currentColor"></span>Na čekanju</span><button class="btn btn-sm" type="button" data-act="toastMsg" data-v="Zahtev je povučen.">Povuci zahtev</button></article>' +
      '<article class="card row" style="padding:18px 22px;flex-wrap:wrap">' + ava('KL', '#FDE8D7', '#9A3412') + '<span class="stack" style="flex:1 1 220px"><b style="font-size:16px">Katarina Lukić</b><span>LC FON: „Alumni je zamolila da je ne kontaktiramo do januara.”</span></span><span class="badge bad">Odbijeno</span></article>';

    return '' +
      '<div class="page-head"><div class="t"><span class="kicker">LC Novi Sad</span><h1 class="h1">Zahtevi za kontakt</h1></div>' +
        '<div class="seg" role="tablist" aria-label="Vrsta zahteva"><button type="button" role="tab" aria-selected="' + isIn + '" data-act="ctTab" data-v="in">Za moje alumnije <span class="n">' + ctPending() + '</span></button><button type="button" role="tab" aria-selected="' + !isIn + '" data-act="ctTab" data-v="out">Moji zahtevi <span class="n">3</span></button></div></div>' +
      '<ol class="how" aria-label="Kako radi"><li><b>1</b><span>Drugi LC ili MC traži kontakt alumnija i navodi zašto</span></li><li><b>2</b><span>LCP alumnijevog LC-a odobrava ili odbija zahtev</span></li><li><b>3</b><span>Podnosilac šalje email ili zove direktno iz aplikacije, 30 dana</span></li></ol>' +
      '<section style="display:flex;flex-direction:column;gap:14px" aria-label="' + (isIn ? 'Zahtevi za alumnije LC Novi Sad' : 'Moji zahtevi') + '">' + body + '</section>';
  }

  /* ---------------- Ekran: Grupe iz ugla alumnija ---------------- */
  var AG = [
    ['base', 'Svi alumniji LC Novi Sad', 'LC Novi Sad', 196, true],
    ['lead', 'Bivši VP-ovi i LCP-ovi', 'LC Novi Sad', 42, true],
    ['mentor', 'Mentori 2026/27', 'MC', 62, true],
    ['it', 'IT industrija', 'Napravio MC', 287, false, 'Oglasi za posao, meetupi i preporuke za alumnije u softveru i tehnologiji.'],
    ['bg', 'Alumni u Beogradu', 'Napravio MC', 512, false, 'Neformalna okupljanja i alumni kafa jednom mesečno, bez obzira na LC.'],
    ['pre', 'Preduzetnici', 'Napravio LC Metropolitan', 38, false, 'Alumniji koji vode svoju firmu ili startup: razmena iskustava i kontakata.'],
    ['kon', 'Konsalting i finansije', 'Napravio LC FON', 121, false, 'Big 4, banke i savetovanje: prakse za članove i godišnji networking.'],
    ['vol', 'Homecoming volonteri', 'Napravio LC Novi Sad', 22, false, 'Pomažeš u organizaciji Homecoming-a 14. novembra. Grupa se gasi posle događaja.']
  ];
  function viewMojeGrupe() {
    var mine = AG.filter(function (g) { return S.agMember[g[0]]; });
    var disc = AG.filter(function (g) { return !g[4] && !S.agMember[g[0]]; });
    return '' +
      '<div class="page-head"><div class="t"><span class="kicker">Pogled alumnija</span><h1 class="h1">Grupe</h1></div></div>' +
      when(S.agInvite, '<section class="card invite card-body" aria-labelledby="inv-h" style="display:flex;flex-wrap:wrap;align-items:center;gap:16px"><span class="group-ico locked" style="width:44px;height:44px;border-radius:14px">' + ic('lock', 18, 1.8) + '</span>' +
        '<span class="stack" style="flex:1 1 280px;gap:3px"><b id="inv-h" style="font-size:16px">Poziv u zatvorenu grupu „Bivši VP-ovi i LCP-ovi”</b><span style="font-size:14px;color:var(--ink-3)">Pozvao te Stefan Jovanović, LCP Novi Sad. Grupa ima 41 člana i vide je samo pozvani.</span></span>' +
        '<div class="btn-row stretch"><button class="btn" type="button" data-act="agInvite" data-v="0">Odbij</button><button class="btn btn-primary" type="button" data-act="agInvite" data-v="1">Prihvati poziv</button></div></section>') +
      '<section style="display:flex;flex-direction:column;gap:12px" aria-labelledby="mine-h"><div style="display:flex;align-items:baseline;justify-content:space-between;gap:6px 12px;flex-wrap:wrap"><h2 class="h2" id="mine-h" style="font-size:18px">Moje grupe</h2><span class="small muted">Iz svake grupe možeš da izađeš kad god hoćeš.</span></div>' +
        '<div class="card list">' + (mine.length ? map(mine, function (g) {
          return '<div class="row" style="flex-wrap:wrap"><span class="group-ico ' + (g[4] ? 'locked' : 'open') + '">' + ic(g[4] ? 'lock' : 'group', 17, 1.8) + '</span>' +
            '<span class="stack" style="flex:1 1 200px"><b>' + esc(g[1]) + '</b><span>' + (g[4] ? 'Zatvorena' : 'Otvorena') + ', ' + esc(g[2]) + ', ' + g[3] + ' članova</span></span>' +
            '<button class="btn btn-sm" type="button" data-act="agLeave" data-v="' + g[0] + '">Izađi</button></div>';
        }) : '<div class="empty"><b>Nisi ni u jednoj grupi</b><p>Pridruži se nekoj od otvorenih grupa ispod.</p></div>') + '</div></section>' +
      '<section style="display:flex;flex-direction:column;gap:12px" aria-labelledby="open-h"><div style="display:flex;align-items:baseline;justify-content:space-between;gap:6px 12px;flex-wrap:wrap"><h2 class="h2" id="open-h" style="font-size:18px">Otvorene grupe</h2><span class="small muted">Pravi ih LCP ili MCP; ulaziš sam/a, bez odobrenja.</span></div>' +
        '<div class="discover">' + map(disc, function (g) {
          return '<article class="card card-body" style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;justify-content:space-between;gap:12px"><span class="stack"><b>' + esc(g[1]) + '</b><span>' + esc(g[2]) + '</span></span><span class="mono small" style="color:var(--ink-2)">' + g[3] + '</span></div>' +
            '<p class="small" style="color:var(--ink-2);line-height:1.5">' + esc(g[5]) + '</p><button class="btn btn-sm" type="button" data-act="agJoin" data-v="' + g[0] + '" style="align-self:flex-start;border-color:var(--accent);color:var(--accent-ink);font-weight:600">' + ic('plus', 14, 2.2) + 'Pridruži se</button></article>';
        }) + '</div>' + when(!disc.length, '<div class="card empty"><b>Već si u svim otvorenim grupama</b></div>') + '</section>';
  }

  /* ---------------- Akcije ---------------- */
  var ACT = {
    soon: function (v, el, e) { e.preventDefault(); toast('Ovo stiže u pravoj verziji platforme.', '#60A5FA'); return false; },
    openSheet: function () { openSheet(); return false; },
    closeSheet: function () { closeSheet(); return false; },
    toastMsg: function (v) { toast(v); return false; },
    scope: function (v) { S.scope = v; },
    apNext: function () { S.apStep = Math.min(5, S.apStep + 1); window.scrollTo(0, 0); },
    apBack: function () { S.apStep = Math.max(1, S.apStep - 1); },
    apReset: function () { S.apStep = 1; },
    apTab: function (v) {
      S.apTab = v; S.apOpenPhone = false;
      var first = APPLICANTS.filter(function (a) { return inTab(a.id, v); })[0];
      S.apSel = first ? first.id : null;
    },
    apSel: function (v) { S.apSel = v; S.apOpenPhone = true; window.scrollTo(0, 0); },
    apBackList: function () { S.apOpenPhone = false; },
    apDecide: function (v) {
      var cur = APPLICANTS.filter(function (a) { return a.id === S.apSel; })[0];
      if (!cur) return;
      S.apStatus[cur.id] = v;
      var msg = { approved: ' je odobren/a. Email dobrodošlice je poslat.', rejected: ': prijava je odbijena, obrazloženje je poslato.', info: ': zatražena je dopuna podataka.' }[v];
      toast(cur.name + msg, { approved: '#22C55E', rejected: '#F87171', info: '#60A5FA' }[v]);
      if (v !== 'info') {
        var next = APPLICANTS.filter(function (a) { return inTab(a.id, S.apTab); })[0];
        S.apSel = next ? next.id : null;
        S.apOpenPhone = false;
      }
    },
    dirLc: function (v) { S.dirLc = v; },
    dirReset: function () { S.dirLc = 'all'; S.dirQ = ''; S.dirMentor = false; },
    pf: function (v) { S.pf = v; },
    nlToggle: function (v) { S.nlOn[v] = !S.nlOn[v]; S.nlSent = false; },
    nlMobile: function (v) { S.nlMobile = v === '1'; },
    nlSend: function () { S.nlSent = true; window.scrollTo(0, 0); },
    nlUndo: function () { S.nlSent = false; },
    grType: function (v) { S.grLocked = v === 'lock'; },
    grDel: function (v) { S.grRules = S.grRules.filter(function (k) { return k !== v; }); },
    grAdd: function (v) { S.grRules = S.grRules.concat([v]); },
    rlLc: function (v) { S.rlLc = v; },
    rlToggle: function (v, el) { S.rlOff[v] = el.getAttribute('data-on') === 'true'; },
    ctTab: function (v) { S.ctTab = v; },
    ctSet: function (v) {
      var p = v.split(':'); S.ctSt[p[0]] = p[1];
      toast(p[1] === 'approved' ? 'Kontakt je odobren. Podnosilac može da pošalje email ili da pozove.' : 'Zahtev je odbijen.', p[1] === 'approved' ? '#22C55E' : '#F87171');
    },
    agInvite: function (v) {
      S.agInvite = false;
      if (v === '1') { S.agMember.lead = true; toast('Pridružila si se grupi „Bivši VP-ovi i LCP-ovi”.'); }
    },
    agLeave: function (v) { S.agMember[v] = false; toast('Izašla si iz grupe.', '#A1A1AA'); },
    agJoin: function (v) { S.agMember[v] = true; toast('Pridružila si se grupi.'); }
  };

  /* ---------------- Render ---------------- */
  var lastRoute = null;
  function render() {
    var id = route();
    entering = id !== lastRoute;
    var r = ROUTES[id];
    var html = r.public ? r.view() : shell(id, r.view());
    document.getElementById('root').innerHTML = html;
    document.title = r.title + ' · AIESEC Alumni';
    if (entering && lastRoute !== null) {
      window.scrollTo(0, 0);
      var main = document.getElementById('main');
      if (main) main.focus({ preventScroll: true });
    }
    lastRoute = id;
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) {
      if (e.target.closest('#sheet a')) closeSheet();
      return;
    }
    var fn = ACT[el.getAttribute('data-act')];
    if (!fn) return;
    var res = fn(el.getAttribute('data-v'), el, e);
    if (el.closest('#sheet') && el.getAttribute('data-act') !== 'closeSheet') closeSheet();
    if (res !== false) render();
  });

  document.addEventListener('input', function (e) {
    if (e.target.getAttribute('data-input') === 'dirQ') {
      S.dirQ = e.target.value;
      var base = dirBase();
      document.getElementById('dir-chips').innerHTML = dirChips(base);
      document.getElementById('dir-results').innerHTML = dirResults(base);
    }
  });
  document.addEventListener('change', function (e) {
    if (e.target.getAttribute('data-change') === 'dirMentor') {
      S.dirMentor = e.target.checked;
      var base = dirBase();
      document.getElementById('dir-chips').innerHTML = dirChips(base);
      document.getElementById('dir-results').innerHTML = dirResults(base);
    }
  });

  window.addEventListener('hashchange', function () { closeSheet(); render(); });
  var mq = window.matchMedia('(max-width:1079px) and (min-width:720px)');
  if (mq.addEventListener) mq.addEventListener('change', render);
  render();
})();
