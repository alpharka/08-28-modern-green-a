/* Design: Modern Botanical Editorial — tactile paper, asymmetrical editorial flow, ink green + warm ivory, Cormorant Garamond / DM Sans, gentle reveal motion. */
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, CalendarDays, Check, Copy, ExternalLink, Heart, MapPin, Music2, Pause, Play, X } from "lucide-react";

const CONFIG = {
  couple: "Raka & Anindya",
  shortNames: "Raka · Anin",
  parents: "Putra pertama dari Bapak Surya & Ibu Ratih · Putri pertama dari Bapak Bima & Ibu Laras",
  dateLabel: "Sabtu, 24 Oktober 2026",
  eventDate: "2026-10-24T16:00:00+07:00",
  akadTime: "15.30 — 16.30 WIB",
  receptionTime: "18.30 — 21.00 WIB",
  venue: "Sasana Rasa, Bandung",
  address: "Jl. Ciumbuleuit No. 108, Bandung, Jawa Barat",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sasana+Rasa+Bandung",
  calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Raka+%26+Anindya+%E2%80%94+Wedding&dates=20261024T083000Z%2F20261024T140000Z&details=Perayaan+pernikahan+Raka+dan+Anindya&location=Sasana+Rasa%2C+Bandung&ctz=Asia%2FJakarta",
  walletProvider: "GoPay",
  walletNumber: "0812 3456 7890",
  bank: "BCA",
  accountNumber: "1234567890",
  accountName: "Anindya Larasati",
  paymentLink: "https://contoh.link/raka-anin",
  ambientTrack: "",
};

const gallery = [
  { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=85", alt: "Raka dan Anindya berjalan di antara rerumputan", caption: "Sore yang pelan" },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85", alt: "Potret Raka dan Anindya dengan bayangan dedaunan", caption: "Di bawah rimbun" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", alt: "Pasangan berjalan di taman saat cahaya keemasan", caption: "Langkah pertama" },
  { src: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1200&q=85", alt: "Detail bunga putih dalam suasana pernikahan", caption: "Hal-hal kecil" },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85", alt: "Pasangan tersenyum dalam suasana intim", caption: "Yang kami pilih" },
  { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85", alt: "Meja makan resepsi dengan dekorasi bunga", caption: "Satu meja, banyak cerita" },
];

function getGuestName() {
  const value = new URLSearchParams(window.location.search).get("to")?.replace(/\s+/g, " ").trim();
  return value ? value.slice(0, 70) : "Tamu undangan";
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function formatUnit(value: number) { return String(Math.max(0, value)).padStart(2, "0"); }

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [copied, setCopied] = useState("");
  const [guestbook, setGuestbook] = useState<{name:string; status:string; message:string}[]>(() => { try { return JSON.parse(localStorage.getItem("raka-anin-guestbook") || "[]"); } catch { return []; } });
  const [form, setForm] = useState({ name: "", status: "Saya akan hadir", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const guestName = useMemo(getGuestName, []);

  useReveal();

  useEffect(() => { const target = new Date(CONFIG.eventDate).getTime(); const update = () => { const gap = Math.max(0, target - Date.now()); setCountdown({ days: Math.floor(gap / 86400000), hours: Math.floor(gap / 3600000) % 24, minutes: Math.floor(gap / 60000) % 60, seconds: Math.floor(gap / 1000) % 60 }); }; update(); const id = window.setInterval(update, 1000); return () => window.clearInterval(id); }, []);
  useEffect(() => { document.body.classList.toggle("lightbox-open", lightbox !== null); return () => document.body.classList.remove("lightbox-open"); }, [lightbox]);
  useEffect(() => { const key = (event: KeyboardEvent) => { if (lightbox === null) return; if (event.key === "Escape") setLightbox(null); if (event.key === "ArrowRight") setLightbox((lightbox + 1) % gallery.length); if (event.key === "ArrowLeft") setLightbox((lightbox - 1 + gallery.length) % gallery.length); }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [lightbox]);

  const openInvitation = () => { setOpened(true); const audio = audioRef.current; if (audio && CONFIG.ambientTrack) audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false)); };
  const toggleMusic = () => { const audio = audioRef.current; if (!audio || !CONFIG.ambientTrack) return; if (musicOn) { audio.pause(); setMusicOn(false); } else { audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false)); } };
  const copyValue = async (label: string, value: string) => { try { await navigator.clipboard.writeText(value); } catch { const area = document.createElement("textarea"); area.value = value; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); } setCopied(label); window.setTimeout(() => setCopied(""), 2000); };
  const submit = (e: FormEvent) => { e.preventDefault(); if (!form.name.trim() || !form.message.trim()) return; const next = [...guestbook, { name: form.name.trim(), status: form.status, message: form.message.trim() }]; setGuestbook(next); try { localStorage.setItem("raka-anin-guestbook", JSON.stringify(next)); } catch {} setSubmitted(true); setForm({ name: "", status: "Saya akan hadir", message: "" }); };

  return <div className={`site ${opened ? "is-open" : ""}`}>
    <audio ref={audioRef} loop preload="auto" src={CONFIG.ambientTrack || undefined} />
    {!opened && <section className="cover" aria-label="Sampul undangan"><div className="cover-image" /><div className="cover-shade" /><div className="cover-content"><div className="emblem large" aria-label="Emblem Raka dan Anindya"><img src="/manus-storage/emblem-botanical_02c68f81.png" alt="" /></div><p className="eyebrow light">A private celebration · 24.10.26</p><h1>Raka <i>&</i><br />Anindya</h1><div className="cover-rule" /><p className="cover-guest">Kepada Yth.<strong>{guestName}</strong></p><button className="button button-light" onClick={openInvitation}>Buka Undangan <ArrowDown size={16} /></button></div></section>}
    <header className="topbar"><a href="#top" className="brand"><span className="emblem"><img src="/manus-storage/emblem-botanical_02c68f81.png" alt="" /></span><span>R <i>&</i> A</span></a><nav><a href="#cerita">Cerita</a><a href="#acara">Detail acara</a><a href="#galeri">Galeri</a><a href="#rsvp">RSVP</a><a href="#kasih">Tanda kasih</a></nav><span className="top-date">24 / 10 / 26</span></header>
    <main id="top">
      <section className="hero"><div className="hero-copy reveal"><p className="eyebrow">The beginning of always</p><h2>Raka <i>&</i><br /><span>Anindya</span></h2><p className="hero-lede">Kita bertemu di antara hari-hari biasa, lalu memilih pulang yang sama.</p><a className="text-link" href="#cerita">Baca cerita kami <ArrowDown size={16} /></a></div><div className="hero-photo reveal"><img src="/manus-storage/hero-botanical-dusk_43f309b4.jpg" alt="Raka dan Anindya berjalan di taman saat senja" /><span className="photo-stamp">RA <i>·</i> 01</span></div><div className="hero-meta">{CONFIG.dateLabel}<br />Bandung, Jawa Barat</div></section>
      <section id="cerita" className="story section-shell"><span className="archive-stamp">RA · 02</span><div className="section-index">01 / CERITA</div><div className="story-grid"><div className="story-copy reveal"><p className="eyebrow">A note from us</p><h3>Yang tumbuh<br /><i>perlahan.</i></h3><p>Berawal dari percakapan singkat di sebuah sore, kami belajar bahwa rumah tidak selalu berupa tempat. Kadang, ia adalah seseorang yang membuat hari terasa lebih lapang.</p><p>Setelah melewati musim yang berubah dan doa-doa yang kami simpan sendiri, kami ingin merayakan satu keputusan sederhana: untuk terus berjalan, berdampingan.</p><div className="signature">Raka <span>&</span> Anindya</div></div><figure className="story-photo reveal"><img src="/manus-storage/story-botanical_762d312a.jpg" alt="Detail tangan memegang bunga melati di atas kertas" /><figcaption>“Sebab yang baik tidak perlu terburu-buru.”</figcaption></figure></div></section>
      <section id="acara" className="events section-shell"><span className="archive-stamp">FIELD NOTE · 03</span><div className="section-index">02 / DETAIL ACARA</div><div className="events-head reveal"><p className="eyebrow">Please mark your calendar</p><h3>Hari yang kami<br /><i>tunggu.</i></h3><div className="countdown"><div><strong>{formatUnit(countdown.days)}</strong><span>hari</span></div><div><strong>{formatUnit(countdown.hours)}</strong><span>jam</span></div><div><strong>{formatUnit(countdown.minutes)}</strong><span>menit</span></div><div><strong>{formatUnit(countdown.seconds)}</strong><span>detik</span></div></div></div><div className="event-list"><article className="event-row reveal"><div className="event-time">15.30<br /><span>WIB</span></div><div><p className="eyebrow">Sabtu, 24 Oktober 2026</p><h4>Akad nikah</h4><p>Prosesi akad nikah akan dilangsungkan dengan khidmat dan intim.</p></div></article><article className="event-row reveal"><div className="event-time">18.30<br /><span>WIB</span></div><div><p className="eyebrow">Sasana Rasa</p><h4>Resepsi</h4><p>{CONFIG.venue}<br />{CONFIG.address}</p><div className="event-actions"><a className="button button-olive" href={CONFIG.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Lihat lokasi</a><a className="button button-outline" href={CONFIG.calendarUrl} target="_blank" rel="noreferrer"><CalendarDays size={15} /> Simpan tanggal</a></div></div></article></div></section>
      <section id="galeri" className="gallery-section section-shell"><span className="archive-stamp">CONTACT SHEET · 04</span><div className="section-index">03 / GALERI</div><div className="gallery-head reveal"><p className="eyebrow">A few frames from our story</p><h3>Potongan<br /><i>hari-hari kami.</i></h3></div><div className="gallery-grid">{gallery.map((item, i) => <button key={`gallery-${i}-${item.caption}`} className={`gallery-item item-${i + 1} reveal`} onClick={() => setLightbox(i)} aria-label={`Lihat foto: ${item.alt}`}><img src={item.src} alt={item.alt} /><span>Lihat foto <ArrowRight size={14} /></span></button>)}</div></section>
      <section id="rsvp" className="rsvp section-shell"><span className="archive-stamp">NOTE TO US · 05</span><div className="section-index">04 / RSVP</div><div className="rsvp-grid"><div className="rsvp-intro reveal"><p className="eyebrow">We would love to have you</p><h3>Hadir di<br /><i>hari kami?</i></h3><p>Mohon isi konfirmasi kehadiran dan tinggalkan pesan untuk kami. Setiap kata akan kami simpan baik-baik.</p></div><form className="form reveal" onSubmit={submit}><label htmlFor="name">Nama lengkap<input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Tulis namamu" /></label><label htmlFor="status">Konfirmasi kehadiran<select id="status" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option>Saya akan hadir</option><option>Belum bisa memastikan</option><option>Tidak dapat hadir</option></select></label><label htmlFor="message">Pesan ucapan<textarea id="message" rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tulis doa dan ucapanmu..." /></label><button className="button button-olive" type="submit">Kirim konfirmasi <ArrowRight size={16} /></button>{submitted && <p className="success"><Check size={16} /> Terima kasih, konfirmasimu sudah diterima.</p>}<small>Data RSVP tersimpan di perangkat ini untuk demo privat.</small></form></div><div className="guestbook"><div className="guestbook-head"><p className="eyebrow">Guestbook</p><span>{guestbook.length} pesan</span></div>{guestbook.length === 0 ? <p className="empty">Pesan ucapanmu akan muncul di sini setelah dikirim.</p> : <div className="messages">{guestbook.map((entry, i) => <article key={`${entry.name}-${i}`}><strong>{entry.name}</strong><span>{entry.status}</span><p>{entry.message}</p></article>)}</div>}</div></section>
      <section id="kasih" className="gift section-shell"><span className="archive-stamp">WITH GRATITUDE · 06</span><div className="section-index">05 / TANDA KASIH</div><div className="gift-grid"><div className="gift-copy reveal"><p className="eyebrow">With love, from near or far</p><h3>Tanda kasih<br /><i>yang berarti.</i></h3><p>Kehadiran dan doa baikmu sudah menjadi hadiah bagi kami. Bila ingin berbagi tanda kasih, berikut detail yang dapat digunakan.</p></div><div className="gift-details reveal"><div className="qr-box"><div className="qr-pattern">{Array.from({length: 49}).map((_, i) => <i key={i} style={{ opacity: (i * 13) % 7 > 2 ? 1 : .15 }} />)}</div><span>Scan untuk berbagi</span></div><div className="account"><p className="eyebrow">{CONFIG.walletProvider}</p><strong>{CONFIG.walletNumber}</strong><span>a.n. {CONFIG.accountName}</span><button onClick={() => copyValue("wallet", CONFIG.walletNumber)}>{copied === "wallet" ? <Check size={14} /> : <Copy size={14} />} {copied === "wallet" ? "Tersalin" : "Salin nomor"}</button></div><div className="account"><p className="eyebrow">{CONFIG.bank}</p><strong>{CONFIG.accountNumber}</strong><span>a.n. {CONFIG.accountName}</span><button onClick={() => copyValue("bank", CONFIG.accountNumber)}>{copied === "bank" ? <Check size={14} /> : <Copy size={14} />} {copied === "bank" ? "Tersalin" : "Salin nomor"}</button></div></div></div></section>
    </main>
    <footer><div className="emblem">✣</div><p className="footer-names">Raka <i>&</i> Anindya</p><p>Terima kasih telah menjadi bagian dari cerita kami.</p><span>24 · 10 · 2026</span></footer>
    {CONFIG.ambientTrack && <button className="music-toggle" onClick={toggleMusic} aria-label={musicOn ? "Jeda musik" : "Putar musik"}>{musicOn ? <Pause size={16} /> : <Play size={16} />} <span>{musicOn ? "Musik on" : "Putar musik"}</span><Music2 size={15} /></button>}
    {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Tutup"><X /></button><button className="lightbox-arrow prev" onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }} aria-label="Foto sebelumnya"><ArrowLeft /></button><figure onClick={e => e.stopPropagation()}><img src={gallery[lightbox].src} alt={gallery[lightbox].alt} /><figcaption>{gallery[lightbox].caption} <span>{String(lightbox + 1).padStart(2, "0")} / 06</span></figcaption></figure><button className="lightbox-arrow next" onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }} aria-label="Foto berikutnya"><ArrowRight /></button></div>}
  </div>;
}
