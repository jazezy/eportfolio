(() => {
  const P = window.PORTFOLIO, O = P.owner;
  const app = document.getElementById("app");
  const ICONS = {
    home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>', list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    book: '<path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6M20 4v14h-6"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    school: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.500 6-3v-5"/>', folder: '<path d="M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>',
    spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>', clip: '<path d="M21 11l-9 9a5 5 0 01-7-7l9-9a3.500 3.500 0 015 5l-9 9a2 2 0 01-3-3l8-8"/>',
    doc: '<path d="M6 3h8l5 5v13H6zM14 3v5h5M9 13h6M9 17h6"/>', image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
    out: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>', down: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>', back: '<path d="M15 5l-7 7 7 7"/>'
  };
  const ic = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

  /* ---------- Data helpers ---------- */
  const pageOf = {}, itemById = {};
  Object.entries(P.groups).forEach(([page, groups]) => groups.forEach(g => g.items.forEach(it => { it.page = page; itemById[it.id] = it; pageOf[it.id] = page; })));
  const allItems = Object.values(itemById);

  const M = window.DOC_MANIFEST || {};
  const isHttp = /^https?:/.test(location.protocol);
  async function checkAvailability() {
    await Promise.all(allItems.map(async it => {
      if (M[it.path]) { it.available = true; return; }          // registered by tools/update_documents.py
      it.available = false;
      if (!isHttp) return;                                       // browsers block file checks on file://
      try {
        const r = await fetch(it.path, { method: "HEAD" });
        it.available = r.ok && !(r.headers.get("content-type") || "").includes("text/html");
      } catch (e) {}
    }));
  }

  /* Load a PDF's bytes: from the server when possible, otherwise from the embedded copy (works on file://) */
  function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("script")); document.head.appendChild(s); }); }
  async function loadPdfBytes(it) {
    if (isHttp) { try { const r = await fetch(it.path); if (r.ok) return new Uint8Array(await r.arrayBuffer()); } catch (e) {} }
    const emb = M[it.path] && M[it.path].embed;
    if (!emb) throw new Error("no data");
    if (!(window.__PDF_DATA && window.__PDF_DATA[it.path])) await loadScript(emb);
    const bin = atob(window.__PDF_DATA[it.path]), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    delete window.__PDF_DATA[it.path];
    return bytes;
  }

  /* ---------- Shared components ---------- */
  function card(it, gallery) {
    const ok = it.available, isImg = it.type === "image";
    const status = ok ? `<span class="status up">Uploaded</span>` : `<span class="status">Not yet uploaded. Coming soon.</span>`;
    const btn = ok ? `<a class="btn small" href="#/view/${it.id}">${isImg ? "View Photo" : "View Document"}</a>`
                   : `<button class="btn small" disabled>View Document</button>`;
    const thumb = gallery ? `<div class="thumb">${ok ? `<img src="${it.path}" alt="${it.title}" loading="lazy">` : "Photo will be added soon"}</div>` : "";
    return `<article class="card ${ok ? "ready" : ""}">${thumb}
      ${gallery ? "" : `<div class="card-top"><span class="ico">${ic(isImg ? "image" : "doc")}</span>${it.ref ? `<span class="ref">${it.ref}</span>` : ""}</div>`}
      <h3>${it.title}</h3><p>${it.desc || ""}</p>${status}${btn}</article>`;
  }
  function groupHTML(g) {
    const text = g.textKey ? (P.text[g.textKey] ? `<p class="group-text">${P.text[g.textKey]}</p>` :
      `<p class="group-text placeholder">Content for this section will be added soon.</p>`) : "";
    const ready = g.items.filter(i => i.available).length;
    const body = g.items.length ? `<div class="cards ${g.gallery ? "gallery" : ""}">${g.items.map(i => card(i, g.gallery)).join("")}</div>`
      : `<div class="empty">${g.empty || "No documents yet."}</div>`;
    return `<details class="group" open><summary><span><h2 style="display:inline">${g.title}</h2><span class="count">${ready} of ${g.items.length} uploaded</span></span></summary><div class="group-body">${text}${body}</div></details>`;
  }
  const head = (t, d) => `<div class="page-head"><h1>${t}</h1>${d ? `<p>${d}</p>` : ""}</div>`;
  const portrait = () => `<div class="portrait"><img src="assets/images/portrait.jpg" alt="Portrait of ${O.name}"></div>`;
  const textBlock = (key, label) => P.text[key] ? `<div class="prose"><p>${P.text[key]}</p></div>`
    : `<div class="prose placeholder"><p>${label} will be added soon. Edit it in js/documents.js.</p></div>`;

  /* ---------- Pages ---------- */
  const DESCR = {
    toc: "Every section and document in this portfolio. Search by title or task sheet number.",
    about: "The teacher behind the portfolio.",
    environment: `Field Study placement at ${O.partnerSchool}.`,
    fs1: "Field Study 1 documentation.", fs2: "Field Study 2: curriculum, planning, and professional development.",
    microteaching: "Practice teaching evidence and evaluation.", research: "Classroom-Based Action Research proposal and panel evaluation.",
    philosophy: "What I believe about teaching and learning.", appendices: "Supporting evaluations and records."
  };
  const render = {
    home() {
      const total = allItems.filter(i => i.type !== "image").length, ready = allItems.filter(i => i.type !== "image" && i.available).length;
      return `<div class="page"><section class="hero"><div>
        <p class="kicker">Electronic Teaching Portfolio</p><h1>Field Study 1 &amp; 2</h1><h2>${O.name}</h2>
        <p class="meta"><b>${O.program}</b><br>${O.major} | ${O.section}<br>${O.university}<br>Partner School: ${O.partnerSchool}</p>
        <p class="welcome">${O.welcome}</p>
        <a class="btn" href="#/toc">Explore My Portfolio</a>
        <div class="stats"><span class="pill"><b>${ready} Uploaded</b> of ${total} documents</span></div></div>${portrait()}</section></div>`;
    },
    toc() {
      return `<div class="page">${head("Table of Contents", DESCR.toc)}
        <div class="toolbar"><input type="search" id="q" placeholder="Search documents" aria-label="Search documents"><label><input type="checkbox" id="onlyReady"> Uploaded only</label></div>
        <div id="tocList"></div></div>`;
    },
    introduction() {
      return `<div class="page">${head("Introduction", "Purpose and scope of this portfolio.")}
        <div class="prose"><p>${O.welcome}</p></div>${textBlock("introduction", "My personal introduction")}</div>`;
    },
    about() {
      return `<div class="page">${head("About Me", DESCR.about)}
        <section class="profile">${portrait()}<div><h2>${O.name}</h2>
        <dl class="facts"><dt>University</dt><dd>${O.university}</dd><dt>Program</dt><dd>${O.program}</dd><dt>Major</dt><dd>${O.major.replace("Major in ", "")}</dd>
        <dt>Section</dt><dd>${O.section}</dd><dt>Partner school</dt><dd>${O.partnerSchool}</dd></dl></div></section>
        ${textBlock("aboutBio", "My short introduction as a pre-service teacher")}${P.groups.about.map(groupHTML).join("")}</div>`;
    },
    fs1: () => `<div class="page">${head("FS1 Portfolio", DESCR.fs1)}${P.groups.fs1.map(groupHTML).join("")}</div>`,
    fs2: () => `<div class="page">${head("FS2 Portfolio", DESCR.fs2)}${P.groups.fs2.map(groupHTML).join("")}</div>`
  };
  ["environment", "microteaching", "research", "philosophy", "appendices"].forEach(k => {
    const label = P.pages.find(p => p.key === k).label;
    render[k] = () => `<div class="page">${head(label, DESCR[k])}${P.groups[k].map(groupHTML).join("")}</div>`;
  });

  /* ---------- Table of contents filtering ---------- */
  function setupTOC() {
    const q = document.getElementById("q"), only = document.getElementById("onlyReady"), out = document.getElementById("tocList");
    const draw = () => {
      const term = q.value.trim().toLowerCase();
      const html = P.pages.filter(p => P.groups[p.key]).map(p => {
        const items = P.groups[p.key].flatMap(g => g.items).filter(i => i.type !== "image")
          .filter(i => (!only.checked || i.available) && (!term || `${i.title} ${i.ref || ""}`.toLowerCase().includes(term)));
        if (!items.length && (term || only.checked)) return "";
        const li = items.map(i => `<li><span>${i.available ? `<a href="#/view/${i.id}">${i.title}</a>` : i.title}${i.ref ? ` (${i.ref})` : ""}</span>${i.available ? "" : '<span class="soon">Coming soon</span>'}</li>`).join("");
        return `<div class="toc-section"><a href="#/${p.key}">${p.label}</a>${li ? `<ul>${li}</ul>` : ""}</div>`;
      }).join("");
      out.innerHTML = html || `<div class="empty">No documents match your search.</div>`;
    };
    q.oninput = only.onchange = draw; draw();
  }

  /* ---------- PDF / image viewer ---------- */
  let token = 0;
  async function openViewer(id) {
    const it = itemById[id], my = ++token;
    if (!it || !it.available) { location.hash = "#/" + (it ? it.page : "toc"); return; }
    const isImg = it.type === "image" || /\.(png|jpe?g|webp|gif)$/i.test(it.path);
    app.innerHTML = `<section class="viewer" aria-label="${it.title}">
      <div class="viewer-bar"><a class="btn ghost small" href="#/${it.page}">${ic("back")} Back</a><h1>${it.title}${it.ref ? " (" + it.ref + ")" : ""}</h1>
        ${isImg ? "" : `<div class="grp"><button class="btn ghost small" id="zo" aria-label="Zoom out">−</button><output id="zl">100%</output><button class="btn ghost small" id="zi" aria-label="Zoom in">+</button><button class="btn ghost small" id="zf">Fit width</button></div><output id="pg"></output>`}
        <a class="btn ghost small" href="${it.path}" target="_blank" rel="noopener">${ic("out")} Open in new tab</a>
        <a class="btn ghost small" href="${it.path}" download>${ic("down")} Download</a></div>
      <div class="viewer-scroll" id="vs"><div class="viewer-msg"><div class="spinner"></div>Loading document…</div></div></section>`;
    const vs = document.getElementById("vs");
    if (isImg) { vs.innerHTML = `<img src="${it.path}" alt="${it.title}" style="max-width:100%">`; return; }
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "js/vendor/pdf.worker.min.js";
      const bytes = await loadPdfBytes(it);
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      if (my !== token) return;
      let zoom = 1, pages = [];
      const pg = document.getElementById("pg"), zl = document.getElementById("zl");
      const draw = async () => {
        const run = ++token; vs.innerHTML = ""; pages = [];
        const dpr = window.devicePixelRatio || 1, avail = vs.clientWidth - 32;
        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n); if (run !== token) return;
          const base = page.getViewport({ scale: 1 }), s = (Math.min(avail, 1000) / base.width) * zoom, vp = page.getViewport({ scale: s * dpr });
          const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
          c.style.width = vp.width / dpr + "px"; c.style.height = vp.height / dpr + "px"; c.dataset.n = n; vs.appendChild(c); pages.push(c);
          await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
        }
      };
      pg.textContent = `Page 1 of ${pdf.numPages}`;
      vs.addEventListener("scroll", () => { const mid = vs.scrollTop + vs.clientHeight / 3; const cur = pages.filter(c => c.offsetTop <= mid).pop(); if (cur) pg.textContent = `Page ${cur.dataset.n} of ${pdf.numPages}`; });
      document.getElementById("zi").onclick = () => { zoom = Math.min(3, zoom + .25); zl.textContent = Math.round(zoom * 100) + "%"; draw(); };
      document.getElementById("zo").onclick = () => { zoom = Math.max(.4, zoom - .25); zl.textContent = Math.round(zoom * 100) + "%"; draw(); };
      document.getElementById("zf").onclick = () => { zoom = 1; zl.textContent = "100%"; draw(); };
      draw();
    } catch (e) {
      if (my !== token) return;
      vs.innerHTML = `<div class="viewer-msg"><h2>This document could not be displayed</h2><p>Use Open in new tab or Download above to view the original file.</p></div>`;
    }
  }

  /* ---------- Router and navigation ---------- */
  const nav = document.getElementById("nav"), sidebar = document.getElementById("sidebar"), scrim = document.getElementById("scrim"), menuBtn = document.getElementById("menuBtn");
  nav.innerHTML = P.pages.map(p => `<a href="#/${p.key}" data-k="${p.key}">${ic(p.icon)}${p.label}</a>`).join("");
  const closeMenu = () => { sidebar.classList.remove("open"); scrim.classList.remove("on"); menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.onclick = () => { const o = sidebar.classList.toggle("open"); scrim.classList.toggle("on", o); menuBtn.setAttribute("aria-expanded", o); };
  scrim.onclick = closeMenu;

  function route() {
    closeMenu(); token++;
    const parts = location.hash.replace(/^#\/?/, "").split("/"), key = parts[0] || "home";
    const active = key === "view" ? (itemById[parts[1]] || {}).page : key;
    nav.querySelectorAll("a").forEach(a => a.removeAttribute("aria-current"));
    nav.querySelectorAll("a").forEach(a => { if (a.dataset.k === active) a.setAttribute("aria-current", "page"); });
    if (key === "view") return openViewer(parts[1]);
    app.innerHTML = (render[key] || render.home)();
    if (key === "toc") setupTOC();
    window.scrollTo(0, 0); document.title = `${(P.pages.find(p => p.key === key) || {}).label || "Home"} | ${O.name} E-Portfolio`;
  }
  window.addEventListener("hashchange", route);
  app.innerHTML = '<div class="viewer-msg" style="margin-top:6rem;text-align:center"><div class="spinner"></div>Loading portfolio…</div>';
  checkAvailability().then(route);
})();
