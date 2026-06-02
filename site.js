/* ============================================================
   site.js — Emu Bench landing: feature cards, hero mockup,
   scroll-reveal, sticky-nav state, mobile menu.
   Vanilla, no deps. Animations honor prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };

  /* ---------- icons ---------- */
  const ICONS = {
    library: '<path d="M3 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M11 7h10M11 12h10M11 17h6"/>',
    test: '<path d="M9 3h6M10 3v6l-5 9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1l-5-9V3"/><path d="M7.5 15h9"/>',
    catalog: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/>',
    bench: '<path d="M12 14a4 4 0 1 0-4-4"/><path d="M12 14v-4l2.5-2.5"/><path d="M4 20a8 8 0 0 1 16 0"/>',
    friends: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    tv: '<rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 21h8"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6.5 19Z"/><path d="M12 12v6m0 0 2.5-2.5M12 18l-2.5-2.5"/>',
    lang: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  };
  const FEATURES = [
    { ic: "library", t: "Biblioteca unificada", d: "Todos os seus consoles num lugar só, com grid de capas (via IGDB). Filtros por console, busca, ordenação e densidade ajustável." },
    { ic: "test", t: "Teste de compatibilidade", d: "Roda cada jogo nos emuladores instalados e dá uma nota de 0–10, com CPU médio e RAM pico — e recomenda o melhor automaticamente.", tone: "citron" },
    { ic: "catalog", t: "Catálogo de emuladores", d: "22+ emuladores com instalação e atualização em 1 clique. Resolve dependências e avisa quando falta BIOS, firmware ou keys." },
    { ic: "bench", t: "Benchmark de hardware", d: "Detecta CPU/GPU/RAM e aplica um preset de qualidade ideal nos emuladores — resolução, FSR, anti-aliasing — sem você mexer em config." },
    { ic: "friends", t: "Amigos & jogar online", d: "Adicione amigos, veja quem está online e convide pra jogar. Túnel de rede automático via ZeroTier — estilo Minecraft.", tone: "citron" },
    { ic: "tv", t: "Modo TV / Big Picture", d: "Uma interface 10-foot pra jogar do sofá, navegando 100% por controle, com foco visível e presets de shader CRT." },
    { ic: "cloud", t: "Sync na nuvem", d: "Mantenha seus saves sincronizados entre PCs. Criptografado, opt-in, e você pode usar seu próprio servidor." },
    { ic: "lang", t: "Multi-idioma", d: "Interface em português (BR), inglês e espanhol — sem estourar layout com textos longos." },
  ];
  const fg = $("#featGrid");
  if (fg) FEATURES.forEach((f, i) => {
    const card = el(`<article class="feat-card reveal-up ${f.tone === "citron" ? "tone-citron" : ""}" data-delay="${i % 3}">
      <div class="feat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">${ICONS[f.ic]}</svg></div>
      <h3>${f.t}</h3><p>${f.d}</p></article>`);
    fg.appendChild(card);
  });

  /* ---------- hero mini-grid posters ---------- */
  const TONES = ["#2a1216", "#142a44", "#102a18", "#0b2a3c", "#3a2a12", "#241640", "#142a44", "#2a1216"];
  const BADGES = [["9.2", "var(--good)"], ["", ""], ["6.4", "var(--ok)"], ["", ""], ["8.7", "var(--good)"], ["", ""], ["", ""], ["2.1", "var(--bad)"]];
  const mg = $("#miniGrid");
  if (mg) TONES.forEach((tone, i) => {
    const b = BADGES[i];
    mg.appendChild(el(`<div class="mini-poster" style="background:linear-gradient(155deg, ${tone}, var(--bg-1) 72%)">${b[0] ? `<span class="mp-badge" style="color:${b[1]}">${b[0]}</span>` : ""}</div>`));
  });

  /* ---------- sticky nav state ---------- */
  const nav = $("#siteNav");
  const onScroll = () => { if (nav) nav.classList.toggle("scrolled", window.scrollY > 12); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const toggle = $("#navToggle"), links = $("#navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------- scroll reveal ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = [...document.querySelectorAll(".reveal-up:not(.in)")];
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((r) => r.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    reveals.forEach((r) => io.observe(r));
  }

  /* ---------- download guard (placeholder URL) ---------- */
  const dl = $("#downloadBtn");
  if (dl) dl.addEventListener("click", (e) => {
    if (dl.getAttribute("href") === "LATEST_DOWNLOAD_URL") {
      e.preventDefault();
      const orig = dl.innerHTML;
      dl.innerHTML = "Link de download em breve — veja o GitHub";
      setTimeout(() => { dl.innerHTML = orig; }, 2200);
    }
  });
})();
