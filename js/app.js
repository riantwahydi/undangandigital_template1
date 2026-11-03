/* ============================================================
   APP LOGIC — professional digital wedding invitation
   ============================================================ */
(function () {
  "use strict";

  const C = window.WEDDING_CONFIG || {};

  /* ---------- helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const setText = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
  const setHTML = (sel, val) => { const el = $(sel); if (el) el.innerHTML = val; };
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* gambar gagal dimuat: sembunyikan agar tidak muncul ikon rusak.
     Membantu saat file belum ada / nama salah, tanpa merusak tata letak. */
  const IMG_FALLBACK = "this.style.visibility='hidden';this.parentElement&&this.parentElement.classList.add('img-missing');";

  /* ---------- SEO / config apply ---------- */
  function applySEO() {
    if (C.seo) {
      if (C.seo.title) document.title = C.seo.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && C.seo.description) metaDesc.setAttribute("content", C.seo.description);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && C.seo.title) ogTitle.setAttribute("content", C.seo.title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && C.seo.description) ogDesc.setAttribute("content", C.seo.description);
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg && C.seo.ogImage) ogImg.setAttribute("content", C.seo.ogImage);
    }
    if (C.couple) {
      ["bride","groom"].forEach((k) => {
        const p = C.couple[k];
        const img = document.querySelector(`[data-photo="${k}"]`);
        if (img && p && p.photo) img.src = p.photo;
      });
      if (C.couple.heroPhoto) {
        const h = document.querySelector("[data-hero-photo]");
        if (h) h.src = C.couple.heroPhoto;
      }
      if (C.couple.coverPhoto) {
        const cv = document.querySelector("[data-cover-photo]");
        if (cv) cv.src = C.couple.coverPhoto;
      }
    }
  }

  /* ---------- render couple ---------- */
  function renderCouple() {
    const b = C.couple?.bride, g = C.couple?.groom;
    if (b) {
      setText("[data-bride-name]", b.fullName);
      setText("[data-bride-nick]", b.nickname ? `“${b.nickname}”` : "");
      setText("[data-bride-parents]", b.parents);
    }
    if (g) {
      setText("[data-groom-name]", g.fullName);
      setText("[data-groom-nick]", g.nickname ? `“${g.nickname}”` : "");
      setText("[data-groom-parents]", g.parents);
    }
  }

  /* ---------- render events ---------- */
  function renderEvents() {
    const akad = C.event?.akad, resepsi = C.event?.resepsi;
    function fill(prefix, ev) {
      if (!ev) return;
      setText(`[data-${prefix}-title]`, ev.title);
      setText(`[data-${prefix}-time]`, ev.time);
      setText(`[data-${prefix}-venue]`, ev.venue);
      setText(`[data-${prefix}-address]`, ev.address);
      const btn = document.querySelector(`[data-${prefix}-map]`);
      if (btn && ev.mapsQuery) {
        btn.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ev.mapsQuery);
      }
    }
    fill("akad", akad);
    fill("resepsi", resepsi);

    setText("[data-wedding-date-text]", C.event?.weddingDateText);
    setText("[data-dress-code]", C.event?.dressCode);

    // countdown
    startCountdown(C.event?.weddingDateISO);
  }

  function startCountdown(iso) {
    const target = iso ? new Date(iso).getTime() : NaN;
    const ids = { d: "cd-d", h: "cd-h", m: "cd-m", s: "cd-s" };
    function update() {
      if (isNaN(target)) {
        setText("#cd-d", "--"); setText("#cd-h", "--"); setText("#cd-m", "--"); setText("#cd-s", "--");
        return;
      }
      let diff = target - Date.now();
      if (diff < 0) {
        diff = 0;
        const done = $("#countdown-done");
        if (done && done.dataset.shown !== "1") {
          done.textContent = "Acara telah berlangsung. Terima kasih atas doa restunya.";
          done.dataset.shown = "1";
        }
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setText("#cd-d", String(d).padStart(2, "0"));
      setText("#cd-h", String(h).padStart(2, "0"));
      setText("#cd-m", String(m).padStart(2, "0"));
      setText("#cd-s", String(s).padStart(2, "0"));
    }
    update();
    if (!isNaN(target)) setInterval(update, 1000);
  }

  /* ---------- render story ---------- */
  function renderStory() {
    const wrap = $("#story-list");
    if (!wrap || !Array.isArray(C.story)) return;
    wrap.innerHTML = C.story.map((item, i) => `
      <div class="tl-item reveal${i % 2 === 1 ? " delay-1" : ""}">
        <span class="tl-dot"></span>
        <div class="tl-content">
          <p class="tl-date">${escapeHTML(item.year || "")}</p>
          <h4>${escapeHTML(item.title || "")}</h4>
          <p>${escapeHTML(item.desc || "")}</p>
          ${item.photo ? `<div class="tl-photo"><img src="${escapeHTML(item.photo)}" alt="${escapeHTML(item.title || "")}" loading="lazy"></div>` : ""}
        </div>
      </div>
    `).join("");
  }

  /* ---------- render gallery + lightbox ---------- */
  let galleryItems = [];
  let currentLb = 0;
  function renderGallery() {
    const wrap = $("#gallery-grid");
    if (!wrap || !Array.isArray(C.gallery)) return;
    galleryItems = C.gallery;
    wrap.innerHTML = galleryItems.map((g, i) => `
      <figure class="gallery-item reveal" data-index="${i}">
        <img src="${escapeHTML(g.src)}" alt="${escapeHTML(g.alt || "")}" loading="lazy" onerror="${IMG_FALLBACK}">
      </figure>
    `).join("");
    wrap.addEventListener("click", (e) => {
      const fig = e.target.closest(".gallery-item");
      if (!fig) return;
      openLightbox(Number(fig.dataset.index));
    });
  }

  function openLightbox(i) {
    const lb = $("#lightbox");
    if (!lb || !galleryItems.length) return;
    currentLb = (i + galleryItems.length) % galleryItems.length;
    const g = galleryItems[currentLb];
    const img = $("#lb-img");
    if (img) { img.src = g.src; img.alt = g.alt || ""; }
    const cap = $("#lb-caption");
    if (cap) cap.textContent = (currentLb + 1) + " / " + galleryItems.length + (g.alt ? " · " + g.alt : "");
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    const lb = $("#lightbox");
    if (!lb) return;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function lbNav(dir) {
    openLightbox(currentLb + dir);
  }

  /* ---------- render gift ---------- */
  function renderGift() {
    const wrap = $("#gift-list");
    if (!wrap || !C.gift) return;
    const accounts = C.gift.accounts || [];
    wrap.innerHTML = accounts.map((a) => `
      <div class="bank-card reveal">
        <div class="bank-head">
          <div class="bank-logo">${escapeHTML((a.provider || "").slice(0, 4).toUpperCase())}</div>
          <div>
            <p class="bank-name">${escapeHTML(a.name || "")}</p>
            <p class="bank-number" data-acc>${escapeHTML(a.number || "")}</p>
            <p class="bank-holder">a.n. ${escapeHTML(a.holder || "")}</p>
          </div>
        </div>
        <button class="copy-btn" type="button" data-copy="${escapeHTML(a.number || "")}">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Salin Nomor
        </button>
      </div>
    `).join("");

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      copyText(btn.dataset.copy, btn);
    });

    setText("#gift-note", C.gift.note);
    setText("#shipping-address", C.gift.shipping?.address);
    setText("[data-shipping-label]", C.gift.shipping?.label);
  }

  /* ---------- RSVP deadline (di dalam section RSVP) ---------- */
  function renderRsvpDeadline() {
    setText("[data-rsvp-deadline]", C.contact?.rsvpDeadline);
  }

  /* ---------- copy ---------- */
  async function copyText(text, btn) {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      else { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); }
      const orig = btn.innerHTML;
      btn.innerHTML = "✓ Tersalin";
      btn.style.background = "var(--sage)";
      btn.style.color = "#fff";
      btn.style.borderColor = "var(--sage)";
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ""; btn.style.color = ""; btn.style.borderColor = ""; }, 1700);
      showToast("Nomor berhasil disalin.");
    } catch (e) {
      showToast("Gagal menyalin. Silakan salin manual.");
    }
  }

  /* ---------- toast ---------- */
  function showToast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 3000);
  }

  /* ---------- RSVP storage ---------- */
  const RSVP_KEY = "wedding_rsvp_v1";
  function loadRsvps() {
    try { return JSON.parse(localStorage.getItem(RSVP_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveRsvps(list) { localStorage.setItem(RSVP_KEY, JSON.stringify(list)); }

  async function submitToBackend(payload) {
    const b = C.backend;
    if (!b) return { ok: true, mode: "local" };
    // Supabase example placeholder
    if (b.type === "supabase") {
      const res = await fetch(b.url + "/rest/v1/" + encodeURIComponent(b.table), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": b.anonKey,
          "Authorization": "Bearer " + b.anonKey,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return { ok: true, mode: "supabase" };
    }
    throw new Error("Backend tidak didukung.");
  }

  function renderWishes() {
    const wrap = $("#wishes-list");
    if (!wrap) return;
    const list = loadRsvps().slice().reverse();
    if (!list.length) {
      wrap.classList.remove("is-scroll");
      wrap.style.maxHeight = "";
      wrap.innerHTML = `<p class="text-center" style="color:var(--muted); font-size:13px; padding: 24px 0;">Belum ada ucapan. Jadilah yang pertama mengirimkan doa restu.</p>`;
      return;
    }
    wrap.innerHTML = list.map((r) => `
      <div class="wish">
        <p class="wish-name">${escapeHTML(r.name)}</p>
        <p class="wish-text">“${escapeHTML(r.message || "-")}”</p>
        <p class="wish-meta">${escapeHTML(r.attendanceLabel)} · ${escapeHTML(r.guests)} tamu · ${escapeHTML(r.date)}</p>
      </div>
    `).join("");
    fitWishesHeight(wrap);
  }

  /* batasi tinggi daftar ucapan agar tampil maksimal 5 kartu.
     Bila lebih dari 5, isinya bisa di-scroll. */
  function fitWishesHeight(wrap) {
    const cards = wrap.querySelectorAll(".wish");
    if (cards.length <= 5) {
      wrap.classList.remove("is-scroll");
      wrap.style.maxHeight = "";
      return;
    }
    wrap.classList.add("is-scroll");
    wrap.style.maxHeight = "";               // reset agar pengukuran akurat
    const first = cards[0];
    const fifth = cards[4];
    wrap.style.maxHeight = (fifth.offsetTop + fifth.offsetHeight - first.offsetTop) + "px";
  }

  function attachRsvp() {
    const form = $("#rsvp-form");
    if (!form) return;
    let attendance = "hadir";
    const attendBtns = $$(".attend-btn");
    attendBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        attendBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        attendance = btn.dataset.value;
        const g = $("#guest-count");
        if (g) g.style.display = attendance === "hadir" ? "" : "none";
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fb = $("#rsvp-feedback");
      const name = ($("#rsvp-name").value || "").trim();
      const msg = ($("#rsvp-message").value || "").trim();
      const guests = Number($("#rsvp-guests")?.value || 1);
      const btn = form.querySelector('button[type="submit"]');

      // validation
      if (name.length < 2) { showFb(fb, "Nama minimal 2 karakter.", "error"); return; }
      if (msg.length > 500) { showFb(fb, "Ucapan maksimal 500 karakter.", "error"); return; }
      if (attendance === "hadir" && (!guests || guests < 1)) { showFb(fb, "Jumlah tamu tidak valid.", "error"); return; }

      btn.disabled = true;
      const origHTML = btn.innerHTML;
      btn.innerHTML = "Mengirim…";
      try {
        const payload = {
          name, attendance, guests: attendance === "hadir" ? guests : 0,
          message: msg, created_at: new Date().toISOString()
        };
        const res = await submitToBackend(payload);
        const labels = { hadir: "Hadir", tidak: "Tidak hadir", ragu: "Masih ragu" };
        const entry = {
          name, attendance, attendanceLabel: labels[attendance] || attendance,
          guests: attendance === "hadir" ? guests : 0,
          message: msg,
          date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        };
        const list = loadRsvps();
        list.push(entry);
        saveRsvps(list);
        renderWishes();
        form.reset();
        attendance = "hadir";
        attendBtns.forEach((b) => b.classList.toggle("active", b.dataset.value === "hadir"));
        const g = $("#guest-count");
        if (g) g.style.display = "";
        showFb(fb, res.mode === "supabase" ? "Konfirmasi tersimpan ke database." : "Terima kasih! Konfirmasi tersimpan (demo lokal).", "success");
        showToast("RSVP berhasil dikirim.");
      } catch (err) {
        showFb(fb, "Terjadi kesalahan. Silakan coba lagi.", "error");
        console.error(err);
      } finally {
        btn.disabled = false;
        btn.innerHTML = origHTML;
      }
    });
  }

  function showFb(fb, msg, type) {
    if (!fb) return;
    fb.textContent = msg;
    fb.classList.remove("success", "error");
    fb.classList.add(type);
  }

  /* ---------- music ---------- */
  let musicPlaying = false;
  function setupMusic() {
    const audio = $("#bg-music");
    const btn = $("#music-toggle");
    if (!audio || !btn) return;
    audio.volume = 0.45;
    const updateIcon = () => {
      btn.classList.toggle("playing", musicPlaying);
      btn.setAttribute("aria-pressed", String(musicPlaying));
      btn.setAttribute("aria-label", musicPlaying ? "Jeda musik" : "Putar musik");
    };
    btn.addEventListener("click", async () => {
      try {
        if (musicPlaying) { audio.pause(); musicPlaying = false; }
        else { await audio.play(); musicPlaying = true; }
        updateIcon();
      } catch (e) {
        showToast("Browser memblokir autoplay. Klik lagi.");
      }
    });
    audio.addEventListener("ended", () => { musicPlaying = false; updateIcon(); });
    window.__startMusic = async () => {
      try { await audio.play(); musicPlaying = true; updateIcon(); } catch (e) { /* needs user gesture, ignore */ }
    };
    updateIcon();
  }

  /* ---------- animasi masuk cover ---------- */
  function setupCoverIntro() {
    const cover = $("#cover");
    if (!cover) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // aktifkan animasi masuk, lalu lepas setelah selesai agar tidak
    // mengunci transform saat cover keluar
    document.body.classList.add("cover-in");
    setTimeout(() => document.body.classList.remove("cover-in"), 1900);
  }

  /* ---------- cover open ---------- */
  function setupCover() {
    const cover = $("#cover");
    const openBtn = $("#open-btn");
    if (!openBtn || !cover) return;
    if (openBtn.dataset.bound === "1") return; // cegah listener ganda
    openBtn.dataset.bound = "1";

    openBtn.addEventListener("click", () => {
      // 1) mulai rangkaian: sinar emas membesar dari tengah
      document.body.classList.add("opening");

      // 2) kartu cover beranjak keluar (terbaca jelas sebelum panel muncul)
      setTimeout(() => cover.classList.add("is-hidden"), 60);

      // 3) panel shutter menutup layar (mulai 300ms), lalu konten di baliknya siap
      setTimeout(() => {
        document.body.classList.remove("locked");
        document.body.classList.add("opened");
        document.documentElement.style.scrollBehavior = "smooth";
        const main = $("#main");
        if (main) { main.setAttribute("aria-hidden", "false"); main.focus({ preventScroll: true }); }
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 620);

      // 4) bersihkan class transisi setelah rangkaian selesai
      setTimeout(() => document.body.classList.remove("opening"), 1750);

      if (typeof window.__startMusic === "function") window.__startMusic();
    });
  }

  /* ---- Back to cover when scrolling up at top ---- */
  function setupBackToCover() {
    const cover = $("#cover");
    if (!cover) return;
    let guard = false;
    function goCover() {
      if (guard) return;
      guard = true;
      window.scrollTo({ top: 0, behavior: "instant" });
      cover.classList.remove("is-hidden");
      document.body.classList.remove("opened");
      document.body.classList.add("locked");
      const main = $("#main");
      if (main) main.setAttribute("aria-hidden", "true");
      /* beri tahu layer daun agar dibersihkan di halaman cover */
      window.dispatchEvent(new Event("coveropen"));
      /* bersihkan sisa efek transisi jika masih ada */
      document.body.classList.remove("opening");
      setTimeout(() => { guard = false; }, 900);
    }
    let lastUp = 0;
    window.addEventListener("wheel", (e) => {
      if (!document.body.classList.contains("opened")) return;
      if (window.scrollY > 2) return;
      if (e.deltaY >= 0) return;
      const now = performance.now();
      if (now - lastUp < 220) return; // debounce
      lastUp = now;
      e.preventDefault();
      goCover();
    }, { passive: false });

    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => {
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });
    window.addEventListener("touchend", (e) => {
      if (!document.body.classList.contains("opened")) return;
      if (window.scrollY > 2) return;
      const dy = e.changedTouches[0].clientY - touchStartY; // positive = swipe down
      if (dy > 70) goCover();
    }, { passive: true });
  }

  /* ---------- nav active ---------- */
  const SECTION_LABELS = {
    hero: "Beranda", couple: "Mempelai", event: "Acara", story: "Cerita",
    gallery: "Galeri", rsvp: "RSVP", gift: "Hadiah"
  };
  const SECTION_ICONS = {
    hero: '<path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    couple: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    event: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    story: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    gallery: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    rsvp: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>'
  };

  function setupNav() {
    const sections = $$("main section[id]");

    /* ---- bottom nav (mobile) & side nav (desktop):
           dibuat dari sumber data yang sama — ikon, label, animasi identik ---- */
    const navData = sections.map((s) => ({
      id: s.id,
      label: SECTION_LABELS[s.id] || s.id,
      icon: SECTION_ICONS[s.id] || '<circle cx="12" cy="12" r="3"/>'
    }));

    function navItemHTML(item, cls, icCls, withLabel) {
      return `
        <a class="${cls}" href="#${escapeHTML(item.id)}" data-target="${escapeHTML(item.id)}" aria-label="${escapeHTML(item.label)}">
          <span class="${icCls}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg></span>
          ${withLabel ? `<span class="nav-label">${escapeHTML(item.label)}</span>` : ""}
        </a>
      `;
    }

    const bottomNav = $("#bottom-nav");
    const links = [];
    if (bottomNav) {
      bottomNav.innerHTML = navData.map((item) => navItemHTML(item, "nav-link", "nav-ic", true)).join("");
      $$(".nav-link", bottomNav).forEach((a) => links.push(a));
      bottomNav.addEventListener("click", (e) => {
        const a = e.target.closest("a.nav-link");
        if (!a) return;
        e.preventDefault();
        const el = document.getElementById(a.dataset.target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    const sideNav = $("#side-nav");
    let sideLinks = [];
    if (sideNav) {
      /* side nav hanya berisi ikon — label TIDAK dimasukkan ke dalam nav */
      sideNav.innerHTML = navData.map((item) => navItemHTML(item, "side-link", "side-ic", false)).join("");
      sideLinks = $$(".side-link", sideNav);

      /* label melayang terpisah, muncul hanya saat ikon diklik */
      const tip = document.createElement("span");
      tip.className = "side-tip";
      tip.setAttribute("aria-hidden", "true");
      document.body.appendChild(tip);
      let tipTimer = null;

      function showTip(link) {
        const label = link.getAttribute("aria-label") || "";
        const r = link.getBoundingClientRect();
        tip.textContent = label;
        tip.style.top = (r.top + r.height / 2) + "px";
        tip.style.right = (window.innerWidth - r.left + 10) + "px";
        tip.classList.add("visible");
        clearTimeout(tipTimer);
        tipTimer = setTimeout(() => tip.classList.remove("visible"), 1800);
      }

      sideNav.addEventListener("click", (e) => {
        const a = e.target.closest("a.side-link");
        if (!a) return;
        e.preventDefault();
        showTip(a);
        const el = document.getElementById(a.dataset.target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          const id = ent.target.id;
          links.forEach((a) => a.classList.toggle("active", a.dataset.target === id));
          sideLinks.forEach((a) => a.classList.toggle("active", a.dataset.target === id));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach((s) => obs.observe(s));

    const topBtn = $("#back-to-top");
    if (topBtn) {
      window.addEventListener("scroll", () => {
        topBtn.classList.toggle("visible", window.scrollY > 600);
      }, { passive: true });
      topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  }

  /* ---------- animasi teks judul (kata per kata) ---------- */
  /* Bungkus tiap kata judul dengan <span class="tw"> dan beri jeda bertingkat,
     sehingga judul muncul kata demi kata saat masuk viewport. */
  function setupTitleAnim() {
    const titles = $$(".section-title, .hero-text h1");
    titles.forEach((el) => {
      if (el.dataset.twReady === "1") return;
      el.dataset.twReady = "1";

      let i = 0;
      const wrapWord = (word, accentTag) => {
        const span = document.createElement("span");
        span.className = "tw" + (accentTag ? " tw--em" : "");
        span.style.setProperty("--tw-delay", (i * 110) + "ms");
        i += 1;
        if (accentTag) {
          // pertahankan gaya asli (<em> miring emas / <span class="amp">)
          const inner = document.createElement(accentTag);
          if (accentTag === "SPAN") inner.className = "amp";
          inner.textContent = word;
          span.appendChild(inner);
        } else {
          span.textContent = word;
        }
        return span;
      };

      const splitInto = (text, accentTag, frag) => {
        const parts = text.split(/(\s+)/);
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          frag.appendChild(wrapWord(part, accentTag));
        });
      };

      // kumpulkan anak (termasuk <em> / .amp emas) agar urutan kata tetap benar
      const kids = Array.from(el.childNodes);
      const out = document.createDocumentFragment();
      kids.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          splitInto(node.textContent, null, out);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName === "EM" ? "EM"
            : node.classList.contains("amp") ? "SPAN"
            : null;
          if (tag) splitInto(node.textContent, tag, out);
          else out.appendChild(node.cloneNode(true));
        } else {
          out.appendChild(node.cloneNode(true));
        }
      });
      el.innerHTML = "";
      el.appendChild(out);
    });
  }

  /* ---------- reveal on scroll (berulang, dua arah) ---------- */
  function setupReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      $$(".reveal").forEach((el) => el.classList.add("show"));
      return;
    }
    // amati viewport (bukan <main>) agar perhitungan batas akurat
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
        else if (!e.target.closest(".hero")) e.target.classList.remove("show");
      });
    }, { threshold: 0.12, rootMargin: "-8% 0px -8% 0px" });
    $$(".reveal").forEach((el) => obs.observe(el));

    // bagian hero selalu tampil (tidak ikut disembunyikan saat scroll)
    const heroText = $(".hero-text");
    if (heroText) heroText.classList.add("show");
  }

  /* ---------- lightbox wiring ---------- */
  function setupLightbox() {
    const lb = $("#lightbox");
    if (!lb) return;
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lb-close")) closeLightboxUtil();
    });
    const prev = $("#lb-prev"), next = $("#lb-next");
    if (prev) prev.addEventListener("click", (e) => { e.stopPropagation(); window.__lbNav(-1); });
    if (next) next.addEventListener("click", (e) => { e.stopPropagation(); window.__lbNav(1); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightboxUtil();
      if (e.key === "ArrowLeft") window.__lbNav(-1);
      if (e.key === "ArrowRight") window.__lbNav(1);
    });
  }

  // expose for lightbox module
  window.__lbOpen = openLightboxGlobal;
  window.__lbClose = closeLightboxUtil;
  window.__lbNav = (d) => { if (typeof openLightboxGlobalNav === "function") openLightboxGlobalNav(d); };

  let galleryItemsGlobal = [];
  let currentLbGlobal = 0;
  function openLightboxGlobal(i) {
    const lb = $("#lightbox");
    if (!lb || !galleryItemsGlobal.length) return;
    currentLbGlobal = (i + galleryItemsGlobal.length) % galleryItemsGlobal.length;
    const g = galleryItemsGlobal[currentLbGlobal];
    const img = $("#lb-img");
    if (img) { img.src = g.src; img.alt = g.alt || ""; }
    const cap = $("#lb-caption");
    if (cap) cap.textContent = (currentLbGlobal + 1) + " / " + galleryItemsGlobal.length + (g.alt ? " · " + g.alt : "");
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function openLightboxGlobalNav(d) { openLightboxGlobal(currentLbGlobal + d); }
  function closeLightboxUtil() {
    const lb = $("#lightbox");
    if (!lb) return;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ---------- init ---------- */
  function renderGalleryAndBind() {
    const wrap = $("#gallery-grid");
    if (!wrap || !Array.isArray(C.gallery)) return;
    galleryItemsGlobal = C.gallery;
    wrap.innerHTML = galleryItemsGlobal.map((g, i) => `
      <figure class="gallery-item reveal" data-index="${i}">
        <img src="${escapeHTML(g.src)}" alt="${escapeHTML(g.alt || "")}" loading="lazy" onerror="${IMG_FALLBACK}">
      </figure>
    `).join("");
    wrap.addEventListener("click", (e) => {
      const fig = e.target.closest(".gallery-item");
      if (!fig) return;
      openLightboxGlobal(Number(fig.dataset.index));
    });
  }

  function boot() {
    applySEO();
    renderCouple();
    renderEvents();
    renderStory();
    renderGalleryAndBind();
    renderGift();
    renderRsvpDeadline();
    renderWishes();
    attachRsvp();
    setupMusic();
    setupCoverIntro();
    setupCover();
    setupBackToCover();
    setupNav();
    setupLightbox();
    setupTitleAnim();
    setupReveal();

    // expose lightbox nav globally
    window.__lbNav = openLightboxGlobalNav;

    // footer year
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();

    // jaga tinggi daftar ucapan tetap pas 5 kartu saat ukuran berubah
    const wishes = $("#wishes-list");
    if (wishes) {
      let rt;
      window.addEventListener("resize", () => {
        clearTimeout(rt);
        rt = setTimeout(() => fitWishesHeight(wishes), 150);
      });
      // ukur ulang setelah font selesai dimuat (tinggi kartu bisa berubah)
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => fitWishesHeight(wishes));
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
