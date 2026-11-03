/* ============================================================
   FALLING LEAVES — dekorasi daun & kelopak berguguran
   Dibuat via JS: bentuk, warna, ukuran, dan durasi random
   mengikuti palette sage-green & gold. Aman untuk
   prefers-reduced-motion (dinonaktifkan otomatis).
   ============================================================ */
(function () {
  "use strict";

  const layer = document.getElementById("falling-leaves");
  if (!layer) return;

  // hormati preferensi user mengurangi animasi
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ---- bentuk daun/kelopak SVG (viewBox seragam 0 0 24 24) ---- */
  const LEAF_SHAPES = [
    // daun lonjong dengan tulang daun
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c5 4 8 9 8 14a8 8 0 0 1-16 0c0-5 3-10 8-14z" opacity=".9"/><path d="M12 5v14" stroke="rgba(255,255,255,.5)" stroke-width="1" fill="none"/></svg>',
    // daun melengkung (maple-ish)
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 4.3L19 4l-1.6 4.6L22 11l-4.2 2.1L19 18l-4.7-1.2L12 22l-2.3-5.2L5 18l1.2-4.9L2 11l4.6-2.4L5 4l4.8 2.3z" opacity=".85"/></svg>',
    // kelopak bunga hati
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c4 3 7 6 7 10a7 7 0 0 1-14 0c0-4 3-7 7-10z" opacity=".8"/></svg>',
    // daun kecil sederhana
    '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="5" ry="9" transform="rotate(25 12 12)" opacity=".85"/><path d="M9 18l6-11" stroke="rgba(255,255,255,.45)" stroke-width="1" fill="none"/></svg>',
    // daun rambing (trio)
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c-1-6 0-12 0-18M12 8c-3-1-5-3-6-6 3 0 5 1 6 4zm0 5c3-1 5-3 6-6-3 0-5 1-6 4z" stroke="currentColor" stroke-width="1.6" fill="none" opacity=".85"/></svg>'
  ];

  const COLORS = ["leaf--sage", "leaf--sage-deep", "leaf--gold", "leaf--stone"];

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* jumlah daun menyesuaikan lebar layar (hemat resource di mobile) */
  const MAX_LEAVES = window.innerWidth < 640 ? 12 : 22;
  const SPAWN_MS = 900; // jeda spawn
  let alive = 0;

  /* daun hanya di halaman undangan (setelah cover dibuka) */
  const isOpen = () => document.body.classList.contains("opened");

  function spawn() {
    if (!isOpen()) return;          // halaman cover: tidak ada daun
    if (alive >= MAX_LEAVES) return;

    const wrap = document.createElement("div");
    wrap.className = "leaf " + pick(COLORS);

    const sway = document.createElement("div");
    sway.className = "leaf-sway";
    sway.innerHTML = pick(LEAF_SHAPES);
    wrap.appendChild(sway);

    // variasi ukuran, kecepatan, dan geseran horizontal
    const size = rand(16, 30);
    wrap.style.width = size + "px";
    wrap.style.height = size + "px";
    wrap.style.left = rand(-5, 100) + "vw";
    wrap.style.setProperty("--leaf-drift", rand(-90, 90).toFixed(0) + "px");
    wrap.style.setProperty("--leaf-scale", rand(0.75, 1.15).toFixed(2));
    wrap.style.setProperty("--leaf-opacity", rand(0.55, 0.9).toFixed(2));
    wrap.style.animationDuration = rand(9, 17).toFixed(1) + "s";
    sway.style.setProperty("--leaf-sway-dur", rand(3, 6).toFixed(1) + "s");

    layer.appendChild(wrap);
    alive++;
    wrap.addEventListener("animationend", () => { wrap.remove(); alive--; }, { once: true });
  }

  /* burst awal hanya jika undangan sudah terbuka */
  if (isOpen()) {
    for (let i = 0; i < 6; i++) {
      setTimeout(spawn, i * 250);
    }
  }

  let timer = setInterval(spawn, SPAWN_MS);

  /* saat pengguna menekan "Buka Undangan": hentikan daun lama, mulai aliran baru */
  document.getElementById("open-btn")?.addEventListener("click", () => {
    for (let i = 0; i < 6; i++) {
      setTimeout(spawn, i * 250);
    }
  });

  /* kembali ke cover: bersihkan daun & hentikan sebentar */
  function clearLeaves() {
    layer.innerHTML = "";
    alive = 0;
  }
  window.addEventListener("coveropen", clearLeaves);

  /* jeda saat tab tidak aktif (hemat baterai) */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
      timer = null;
    } else if (!timer) {
      timer = setInterval(spawn, SPAWN_MS);
    }
  });
})();
