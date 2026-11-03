// ============================================================
//    WEDDING CONFIG — PLACEHOLDER SAMPLE DATA
//    Ganti seluruh nilai di bawah dengan data asli undangan Anda.
//    Tandai data contoh dengan komentar /* SAMPLE */ jika perlu.
//    ============================================================ 
window.WEDDING_CONFIG = {
  isSampleData: true,

  seo: {
    title: "Undangan Pernikahan Digital — Mawar & Hindia",
    description: "Undangan pernikahan digital elegan dan responsif.",
    ogImage: "image/bride.jpg",
    favicon: "image/bride.jpg"
  },

  couple: {
    bride: {
      fullName: "Mawar Merah",
      nickname: "Mawar",
      parents: "Manda & Lommi",
      photo: "image/bride.jpg"
    },
    groom: {
      fullName: "Hindia Belanda",
      nickname: "Hindia",
      parents: "Makmur & Rojiah",
      photo: "image/groom.jpg"
    },
    heroPhoto: "image/bg-hero.jpg",
    coverPhoto: "image/bg-hero.jpg"
  },

  event: {
    weddingDateISO: "2026-12-12T10:00:00+07:00",
    weddingDateText: "Kamis, 20 Mei 2029",
    dressCode: "[Kode Busana, mis. Formal / Batik nuansa ivory & sage]",
    akad: {
      title: "Akad Nikah",
      time: "08.00 — 10.00 WIB",
      venue: "Di Kediaman Mempelai Wanita",
      address: "Pegangsaan Timur, N0 09 Jakarta Barat"
    
    },
    resepsi: {
      title: "Resepsi Pernikahan",
      time: "11.00 — 14.00 WIB",
      venue: "Di Kediaman Mempelai Wanita",
      address: "Pegangsaan Timur, N0 09 Jakarta Barat"
    }
  },

  story: [
    {
      year: "2017",
      title: "Pertemuan Pertama",
      desc: "Takdir mempertemukan kami di sebuah acara kampus. Perkenalan sederhana itu ternyata menjadi awal dari segalanya — tanpa kami sadari, saat itulah perjalanan panjang ini dimulai.",
      photo: "image/dummy-1.jpg"
    },
    {
      year: "2018",
      title: "Mulai Dekat",
      desc: "Dari obrolan ringan tentang tugas dan mimpi, kami mulai sering menghabiskan waktu bersama. Tanpa terburu-buru, kami belajar saling mengenal, memahami, dan menemukan kenyamanan satu sama lain.",
      photo: "image/dummy-2.jpg"
    },
    {
      year: "2020",
      title: "Menjalin Hubungan",
      desc: "Setelah melalui banyak cerita dan perbedaan, kami memutuskan untuk berjalan bersama. Sejak saat itu, setiap langkah terasa lebih ringan karena dijalani berdua.",
      photo: "image/dummy-3.jpg"
    },
    {
      year: "2022",
      title: "Bertemu Keluarga",
      desc: "Kami membuka lembaran baru dengan saling memperkenalkan kepada keluarga masing-masing. Restu dan dukungan mereka menjadi bekal berharga bagi kami untuk melangkah lebih jauh.",
      photo: "image/bride.jpg"
    },
    {
      year: "2024",
      title: "Lamaran",
      desc: "Di bawah langit yang sama seperti saat pertama bertemu, ia mengucapkan janji untuk seumur hidup. Momen sederhana yang penuh makna itu menjadi titik balik menuju hari yang kami tunggu.",
      photo: "image/groom.jpg"
    },
    {
      year: "2029",
      title: "Hari Bahagia",
      desc: "Hari inilah yang kami nantikan. Dengan mengucap Bismillah, kami mengikat janji suci di hadapan Allah dan orang-orang tercinta — awal dari perjalanan kami menjadi satu keluarga.",
      photo: "image/bg-hero.jpg"
    }
  ],

  gallery: [
    { src: "image/dummy-1.jpg", alt: "Foto pasangan 1" },
    { src: "image/dummy-2.jpg", alt: "Foto pasangan 2" },
    { src: "image/dummy-3.jpg", alt: "Foto pasangan 3" },
    { src: "image/bride.jpg", alt: "Foto mempelai wanita" },
    { src: "image/groom.jpg", alt: "Foto mempelai pria" },
    { src: "image/bg-hero.jpg", alt: "Foto bersama" }
  ],

  gift: {
    note: "Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih, tersedia informasi berikut.",
    accounts: [
      { provider: "Bank", name: "[Nama Bank]", number: "[Nomor Rekening]", holder: "[Atas Nama]" },
      { provider: "E-Wallet", name: "[Nama E-Wallet]", number: "[Nomor Akun]", holder: "[Atas Nama]" }
    ],
    shipping: {
      label: "Alamat Pengiriman Hadiah Fisik",
      address: "[Nama Penerima], [Alamat Lengkap], [Kota], [Kode Pos], [No. HP]"
    }
  },

  contact: {
    coordinator: "[Nama Koordinator]",
    phone: "[08xx-xxxx-xxxx]",
    whatsapp: "[628xxxxxxxxxx]",
    rsvpDeadline: "[DD Bulan YYYY]"
  },

  music: {
    src: "image/perfect-ed-sheeran.mp3",
    title: "Lagu latar (contoh)"
  },

  // Optional backend (Supabase/Firebase). Biarkan null untuk mode demo (localStorage).
  backend: null
  // Contoh Supabase:
  // backend: { type: "supabase", url: "https://xxxx.supabase.co", anonKey: "eyJ...", table: "rsvps" }
};
