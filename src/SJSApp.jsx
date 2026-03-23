import { useState, useEffect, useRef, useCallback } from "react";

/* ── helpers ─────────────────────────────────────────────── */
function safeGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? v : fallback; }
  catch { return fallback; }
}
function safeSet(key, val) {
  try { localStorage.setItem(key, val); } catch { /* private browsing */ }
}

function getTier(stamps) {
  if (stamps >= 8) return "Gold";
  if (stamps >= 4) return "Silver";
  return "Bronze";
}

/* ── SVG nav icons ───────────────────────────────────────── */
const NavHome = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const NavEvents = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const NavCard = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);
const NavVIP = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const NavMore = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);

const NAV_ICONS = { home: NavHome, events: NavEvents, loyalty: NavCard, vip: NavVIP, more: NavMore };

/* ── share icon ──────────────────────────────────────────── */
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);

/* ── data ─────────────────────────────────────────────────── */
const SHOWS = [
  {
    id: 1, title: "SJS: May Long Weekend", venue: "Twelve West",
    date: "May 18, 2026", day: "SUN", month: "MAY", num: "18",
    time: "Doors 9:30 PM", tags: ["Selling Fast", "VIP Available"],
    price: "$25", sold: 72, image: "/images/event-may.jpg",
  },
  {
    id: 2, title: "SJS: Summer Kickoff", venue: "Commodore Ballroom",
    date: "June 22, 2026", day: "SUN", month: "JUN", num: "22",
    time: "Doors 9:00 PM", tags: ["Members Early Access"],
    price: "$30", sold: 40, image: "/images/hero-summer.jpeg",
  },
  {
    id: 3, title: "SJS: Boat Party", venue: "Vancouver Harbour",
    date: "July 13, 2026", day: "SUN", month: "JUL", num: "13",
    time: "Boards 7:00 PM", tags: ["Limited Capacity", "Members Only Pre-Sale"],
    price: "$45", sold: 88, image: "/images/boat-party.jpg",
  },
];

const STAMPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/* ── main app ─────────────────────────────────────────────── */
export default function SJSApp() {
  const [tab, setTab] = useState("home");
  const [tabKey, setTabKey] = useState(0);
  const [stamps, setStamps] = useState(() => Number(safeGet("sjs_stamps", "7")));
  const [vipOpen, setVipOpen] = useState(false);
  const [vipShow, setVipShow] = useState(null);
  const [vipStep, setVipStep] = useState(1);
  const [tableSize, setTableSize] = useState(null);
  const [notifDone, setNotifDone] = useState(() => safeGet("sjs_notif", "") === "1");
  const [ticketModal, setTicketModal] = useState(null);
  const [notifModal, setNotifModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  useEffect(() => { safeSet("sjs_stamps", String(stamps)); }, [stamps]);

  const contentRef = useRef(null);
  const switchTab = (id) => {
    if (id !== tab) {
      setTab(id);
      setTabKey(k => k + 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const dismissNotif = () => {
    setNotifDone(true);
    safeSet("sjs_notif", "1");
  };

  const openVip = (show) => {
    setVipShow(show); setVipStep(1); setTableSize(null); setVipOpen(true);
  };

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* Header */}
      <header style={styles.header} className={loaded ? "fade-in" : ""}>
        <div style={styles.logoBlock}>
          <img src="/images/logo.png" alt="Slow Jam Sundays" style={styles.logoImg} />
        </div>
        <div style={styles.headerActions}>
          <button style={styles.headerBtn} onClick={() => setNotifModal(true)} aria-label="Notifications" className="btn-nav">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span style={styles.notifBadge}>2</span>
          </button>
          <button style={styles.headerBtn} onClick={() => setProfileModal(true)} aria-label="Profile" className="btn-nav">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button style={styles.headerBtn} onClick={() => setAdminMode(true)} aria-label="Admin" className="btn-nav">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main ref={contentRef} style={styles.content}>
        <div key={tabKey} className="slide-up">
          {tab === "home" && <HomeTab stamps={stamps} openVip={openVip} setTab={switchTab} notifDone={notifDone} dismissNotif={dismissNotif} setTicketModal={setTicketModal} />}
          {tab === "events" && <EventsTab openVip={openVip} setTicketModal={setTicketModal} />}
          {tab === "loyalty" && <LoyaltyTab stamps={stamps} />}
          {tab === "vip" && <VIPLanding openVip={openVip} />}
          {tab === "more" && <MoreTab />}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav style={styles.nav}>
        {[
          { id: "home", label: "Home" },
          { id: "events", label: "Events" },
          { id: "loyalty", label: "My Card" },
          { id: "vip", label: "VIP" },
          { id: "more", label: "More" },
        ].map((t) => {
          const active = tab === t.id;
          const IconComp = NAV_ICONS[t.id];
          return (
            <button key={t.id} style={{ ...styles.navBtn, ...(active ? styles.navBtnActive : {}) }} onClick={() => switchTab(t.id)} aria-label={t.label} className="btn-nav">
              <IconComp color={active ? gold : "#ffffff"} />
              <span style={styles.navLabel}>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      {vipOpen && <VIPModal show={vipShow} step={vipStep} setStep={setVipStep} tableSize={tableSize} setTableSize={setTableSize} onClose={() => setVipOpen(false)} />}
      {ticketModal && <TicketModal show={ticketModal} onClose={() => setTicketModal(null)} />}
      {notifModal && <NotificationsModal onClose={() => setNotifModal(false)} />}
      {profileModal && <ProfileModal onClose={() => setProfileModal(false)} stamps={stamps} />}
      {adminMode && <AdminModal onClose={() => setAdminMode(false)} />}
    </div>
  );
}

/* ── share helper ─────────────────────────────────────────── */
function shareEvent(show) {
  const text = `${show.title}\n${show.venue} · ${show.date}\n${show.time}\nTickets: ${show.price}`;
  if (navigator.share) {
    navigator.share({ title: show.title, text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text);
  }
}

/* ── entry qr modal ──────────────────────────────────────── */
function EntryQRModal({ show, onClose }) {
  const ticketId = "SJS-TKT-4829";
  return (
    <div className="modal-overlay" style={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Fast Entry QR Code">
      <div className="modal-sheet" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>FAST ENTRY</div>
          <button style={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div style={styles.entryModalEvent}>
          <div style={styles.entryModalTitle}>{show.title}</div>
          <div style={styles.entryModalMeta}>{show.venue} · {show.date} · {show.time}</div>
        </div>

        <div style={styles.qrBlock}>
          <div style={styles.qrFrame}>
            <svg viewBox="0 0 200 200" width="180" height="180" style={{ display: "block" }}>
              <rect width="200" height="200" fill="#f4efe4" rx="4"/>
              <rect x="12" y="12" width="44" height="44" fill="#0c0907" rx="2"/>
              <rect x="18" y="18" width="32" height="32" fill="#f4efe4" rx="1"/>
              <rect x="24" y="24" width="20" height="20" fill="#0c0907" rx="1"/>
              <rect x="144" y="12" width="44" height="44" fill="#0c0907" rx="2"/>
              <rect x="150" y="18" width="32" height="32" fill="#f4efe4" rx="1"/>
              <rect x="156" y="24" width="20" height="20" fill="#0c0907" rx="1"/>
              <rect x="12" y="144" width="44" height="44" fill="#0c0907" rx="2"/>
              <rect x="18" y="150" width="32" height="32" fill="#f4efe4" rx="1"/>
              <rect x="24" y="156" width="20" height="20" fill="#0c0907" rx="1"/>
              {[
                [68,12],[80,12],[104,12],[116,12],[128,12],
                [68,24],[80,24],[92,24],[128,24],
                [68,36],[92,36],[104,36],[116,36],[128,36],
                [12,68],[24,68],[36,68],[68,68],[92,68],[104,68],[128,68],[144,68],[168,68],[180,68],
                [12,80],[36,80],[80,80],[92,80],[116,80],[144,80],[156,80],[180,80],
                [12,92],[24,92],[36,92],[68,92],[104,92],[116,92],[128,92],[156,92],[168,92],
                [24,104],[68,104],[92,104],[116,104],[128,104],[144,104],[168,104],[180,104],
                [12,116],[36,116],[80,116],[92,116],[104,116],[128,116],[156,116],[168,116],
                [12,128],[24,128],[68,128],[80,128],[104,128],[116,128],[144,128],[180,128],
                [68,144],[92,144],[104,144],[116,144],[128,144],[156,144],[168,144],[180,144],
                [68,156],[80,156],[116,156],[128,156],[144,156],[168,156],
                [68,168],[92,168],[104,168],[128,168],[144,168],[156,168],[180,168],
                [80,180],[92,180],[104,180],[116,180],[156,180],[168,180],
              ].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width="10" height="10" fill="#0c0907"/>
              ))}
              <rect x="74" y="74" width="52" height="52" fill="#f4efe4" rx="4"/>
              <rect x="78" y="78" width="44" height="44" fill="#0c0907" rx="3"/>
              <text x="100" y="97" textAnchor="middle" fill="#e2b655" fontSize="11" fontWeight="700" fontFamily="Georgia, serif">FAST</text>
              <text x="100" y="112" textAnchor="middle" fill="#e2b655" fontSize="11" fontWeight="700" fontFamily="Georgia, serif">ENTRY</text>
            </svg>
          </div>
          <div style={styles.qrMemberId}>{ticketId}</div>
          <div style={styles.qrTier}>General Admission · 1 ticket</div>
        </div>

        <div style={styles.entrySteps}>
          <div style={styles.entryStepRow}>
            <div style={styles.entryStepIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/></svg>
            </div>
            <div style={styles.entryStepText}>Show this QR at the venue entrance</div>
          </div>
          <div style={styles.entryStepRow}>
            <div style={styles.entryStepIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div style={styles.entryStepText}>Staff scans you in — no paper tickets needed</div>
          </div>
          <div style={styles.entryStepRow}>
            <div style={styles.entryStepIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div style={styles.entryStepText}>SJS Insiders earn a loyalty stamp automatically</div>
          </div>
        </div>

        <button className="btn-gold" style={{ ...styles.btnGold, width: "100%", marginTop: 20 }} onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

/* ── home tab ─────────────────────────────────────────────── */
function HomeTab({ stamps, openVip, setTab, notifDone, dismissNotif, setTicketModal }) {
  const [entryQR, setEntryQR] = useState(false);
  const nextShow = SHOWS[0];
  const remaining = 10 - stamps;
  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Hero Card */}
      <div style={styles.heroCard}>
        <div style={styles.heroImageWrap}>
          <img src="/images/crowd-family.jpg" alt="" style={styles.heroImage} />
          <div style={styles.heroImageOverlay} />
        </div>
        <div style={styles.heroEyebrow}>NEXT EVENT</div>
        <div style={styles.heroTitle}>{nextShow.title}</div>
        <div style={styles.heroMeta}>{nextShow.venue} &nbsp;·&nbsp; {nextShow.date}</div>
        <div style={styles.heroTime}>{nextShow.time}</div>
        <div style={styles.heroBar}>
          <div style={styles.heroBadgeSell}>{nextShow.tags[0]}</div>
          <div style={styles.sellBar}><div className="sell-fill" style={{ width: `${nextShow.sold}%` }} /></div>
          <div style={styles.sellLabel}>{nextShow.sold}% sold</div>
        </div>
        <div style={styles.heroActions}>
          <button className="btn-gold" style={styles.btnGold} onClick={() => setTicketModal(nextShow)}>Get Tickets — {nextShow.price}</button>
          <button className="btn-outline" style={styles.btnOutline} onClick={() => openVip(nextShow)}>Book VIP</button>
        </div>
      </div>

      {/* Quick Entry */}
      <div style={styles.entryCard} onClick={() => setEntryQR(true)} role="button" tabIndex={0}>
        <div style={styles.entryLeft}>
          <div style={styles.entryQRMini}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="4" height="4" rx="0.5"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="14" y1="21" x2="21" y2="21"/></svg>
          </div>
          <div>
            <div style={styles.entryTitle}>Fast Entry</div>
            <div style={styles.entrySub}>Show at the door — skip the line</div>
          </div>
        </div>
        <div style={styles.entryArrow}>→</div>
      </div>

      {entryQR && <EntryQRModal show={nextShow} onClose={() => setEntryQR(false)} />}

      {/* Loyalty Snapshot */}
      <div style={styles.sectionLabel}>YOUR INSIDER CARD</div>
      <div style={styles.loyaltySnap} onClick={() => setTab("loyalty")} role="button" tabIndex={0} aria-label="View your insider card">
        <div style={styles.snapLeft}>
          <div style={styles.snapCount}>{stamps}</div>
          <div style={styles.snapOf}>/ 10</div>
        </div>
        <div style={styles.stampRow}>
          {STAMPS.map(i => (
            <div key={i} style={{ ...styles.snapDot, ...(i <= stamps ? styles.snapDotFilled : {}) }} />
          ))}
        </div>
        <div style={styles.snapCTA}>{remaining > 0 ? `${remaining} more →` : "Free entry! →"}</div>
      </div>

      {/* Notification CTA */}
      {!notifDone && (
        <div style={styles.notifCard} className="fade-in">
          <div style={styles.notifText}>
            <div style={styles.notifTitle}>Never miss a drop</div>
            <div style={styles.notifSub}>Ticket drops sell out in minutes. Get notified first.</div>
          </div>
          <button className="btn-gold" style={styles.btnGoldSm} onClick={dismissNotif}>Turn On</button>
        </div>
      )}

      {/* Upcoming Strip */}
      <div style={styles.sectionLabel}>COMING UP</div>
      {SHOWS.slice(1).map((s) => (
        <div key={s.id} style={styles.eventStrip} onClick={() => setTicketModal(s)} role="button" tabIndex={0}>
          <div style={styles.stripDate}>
            <div style={styles.stripMon}>{s.month}</div>
            <div style={styles.stripNum}>{s.num}</div>
          </div>
          <div style={styles.stripInfo}>
            <div style={styles.stripTitle}>{s.title}</div>
            <div style={styles.stripVenue}>{s.venue}</div>
          </div>
          <div style={styles.stripPrice}>{s.price}</div>
        </div>
      ))}
    </div>
  );
}

/* ── events tab ──────────────────────────────────────────── */
function EventsTab({ openVip, setTicketModal }) {
  return (
    <div>
      <div style={styles.pageTitle}>UPCOMING EVENTS</div>
      {SHOWS.map((s) => (
        <article key={s.id} style={styles.eventCard}>
          <div style={styles.ecImageWrap}>
            <img src={s.image} alt={s.title} style={styles.ecImage} loading="lazy" />
            <div style={styles.ecImageOverlay} />
          </div>
          <div style={styles.eventCardTop}>
            <div style={styles.ecDate}>
              <div style={styles.ecMon}>{s.month}</div>
              <div style={styles.ecNum}>{s.num}</div>
            </div>
            <div style={styles.ecInfo}>
              <div style={styles.ecTitle}>{s.title}</div>
              <div style={styles.ecVenue}>{s.venue}</div>
              <div style={styles.ecTime}>{s.time}</div>
              <div style={styles.tagRow}>
                {s.tags.map((t, i) => <span key={i} style={i === 0 ? styles.tagAlert : styles.tagMember}>{t}</span>)}
              </div>
            </div>
          </div>
          <div style={styles.ecSellRow}>
            <div style={styles.sellBar}><div className="sell-fill" style={{ width: `${s.sold}%` }} /></div>
            <span style={styles.sellLabel}>{s.sold}% sold</span>
          </div>
          <div style={styles.ecActions}>
            <button className="btn-gold" style={styles.btnGold} onClick={() => setTicketModal(s)}>Get Tickets — {s.price}</button>
            <button className="btn-outline" style={styles.btnOutline} onClick={() => openVip(s)}>VIP Table</button>
            <button className="btn-share" style={styles.btnShare} onClick={() => shareEvent(s)} aria-label={`Share ${s.title}`}><ShareIcon /></button>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ── loyalty tab ─────────────────────────────────────────── */
function LoyaltyTab({ stamps }) {
  const [qrOpen, setQrOpen] = useState(false);
  const nextReward = 10;
  const pct = (stamps / nextReward) * 100;
  const tier = getTier(stamps);

  return (
    <div>
      <div style={styles.pageTitle}>YOUR INSIDER CARD</div>
      <div style={styles.loyaltyCard}>
        <div style={styles.lcGlow} />
        <div style={styles.lcHeader}>
          <div style={styles.lcName}>SJS INSIDER</div>
          <div style={styles.lcTier}>{tier} Status</div>
        </div>
        <div style={styles.lcStampGrid}>
          {STAMPS.map((i) => (
            <div key={i} style={{ ...styles.lcStamp, ...(i <= stamps ? styles.lcStampFilled : {}) }}>
              {i <= stamps ? "✦" : i}
            </div>
          ))}
        </div>
        <div style={styles.lcProgress}>
          <div style={styles.lcBar}><div className="sell-fill" style={{ width: `${pct}%` }} /></div>
          <div style={styles.lcProgressLabel}>
            {stamps === 10 ? "You earned free entry! Show your QR at the door." : `${stamps} of ${nextReward} shows — ${nextReward - stamps} until free entry`}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={styles.sectionLabel}>HOW IT WORKS</div>
      <div style={styles.howItWorks}>
        {[
          { step: "1", text: "Show your QR code at the door" },
          { step: "2", text: "Staff scans and stamps your card" },
          { step: "3", text: "Hit 10 stamps — next show is free" },
        ].map((h, i) => (
          <div key={i} style={styles.howStep}>
            <div style={styles.howNum}>{h.step}</div>
            <div style={styles.howText}>{h.text}</div>
          </div>
        ))}
      </div>

      <div style={styles.sectionLabel}>YOUR PERKS</div>
      {[
        { icon: "✦", title: "Early Ticket Access", desc: "48hrs before public drop" },
        { icon: "◈", title: "Members-Only Nights", desc: "Intimate free-cover events" },
        { icon: "◉", title: "Free Entry Reward", desc: "Every 10th show on us" },
        { icon: "♦", title: "VIP Priority", desc: "First access to table reservations" },
      ].map((p, i) => (
        <div key={i} style={styles.perkRow}>
          <div style={styles.perkIcon}>{p.icon}</div>
          <div>
            <div style={styles.perkTitle}>{p.title}</div>
            <div style={styles.perkDesc}>{p.desc}</div>
          </div>
        </div>
      ))}

      <button className="btn-gold" style={{ ...styles.btnGold, width: "100%", marginTop: 24 }} onClick={() => setQrOpen(true)}>
        Show Check-In QR Code
      </button>

      {qrOpen && <QRModal onClose={() => setQrOpen(false)} stamps={stamps} tier={tier} />}
    </div>
  );
}

/* ── qr check-in modal ───────────────────────────────────── */
function QRModal({ onClose, stamps, tier }) {
  const memberId = "SJS-2847-VIP";
  return (
    <div className="modal-overlay" style={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Check-in QR Code">
      <div className="modal-sheet" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>CHECK-IN</div>
          <button style={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div style={styles.qrBlock}>
          {/* QR Code visual */}
          <div style={styles.qrFrame}>
            <svg viewBox="0 0 200 200" width="180" height="180" style={{ display: "block" }}>
              {/* QR pattern — decorative representation */}
              <rect width="200" height="200" fill="#f4efe4" rx="4"/>
              {/* Corner squares */}
              <rect x="12" y="12" width="44" height="44" fill="#0c0907" rx="2"/>
              <rect x="18" y="18" width="32" height="32" fill="#f4efe4" rx="1"/>
              <rect x="24" y="24" width="20" height="20" fill="#0c0907" rx="1"/>
              <rect x="144" y="12" width="44" height="44" fill="#0c0907" rx="2"/>
              <rect x="150" y="18" width="32" height="32" fill="#f4efe4" rx="1"/>
              <rect x="156" y="24" width="20" height="20" fill="#0c0907" rx="1"/>
              <rect x="12" y="144" width="44" height="44" fill="#0c0907" rx="2"/>
              <rect x="18" y="150" width="32" height="32" fill="#f4efe4" rx="1"/>
              <rect x="24" y="156" width="20" height="20" fill="#0c0907" rx="1"/>
              {/* Data modules — pseudo-random grid */}
              {[
                [68,12],[80,12],[92,12],[104,12],[116,12],[128,12],
                [68,24],[92,24],[116,24],[128,24],
                [68,36],[80,36],[92,36],[104,36],[128,36],
                [12,68],[24,68],[36,68],[68,68],[80,68],[104,68],[128,68],[144,68],[156,68],[168,68],[180,68],
                [12,80],[36,80],[68,80],[92,80],[104,80],[116,80],[144,80],[168,80],
                [12,92],[24,92],[36,92],[80,92],[104,92],[128,92],[144,92],[156,92],[180,92],
                [24,104],[68,104],[80,104],[92,104],[116,104],[128,104],[156,104],[168,104],[180,104],
                [12,116],[36,116],[68,116],[92,116],[104,116],[128,116],[144,116],[168,116],
                [12,128],[24,128],[80,128],[104,128],[116,128],[144,128],[156,128],[180,128],
                [68,144],[80,144],[92,144],[116,144],[128,144],[144,144],[168,144],
                [68,156],[104,156],[128,156],[144,156],[156,156],[180,156],
                [68,168],[80,168],[92,168],[104,168],[116,168],[144,168],[168,168],[180,168],
                [68,180],[92,180],[116,180],[128,180],[156,180],[180,180],
              ].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width="10" height="10" fill="#0c0907"/>
              ))}
              {/* Center logo area */}
              <rect x="74" y="74" width="52" height="52" fill="#f4efe4" rx="4"/>
              <rect x="78" y="78" width="44" height="44" fill="#0c0907" rx="3"/>
              <text x="100" y="105" textAnchor="middle" fill="#e2b655" fontSize="16" fontWeight="700" fontFamily="Georgia, serif">SJS</text>
            </svg>
          </div>

          <div style={styles.qrMemberId}>{memberId}</div>
          <div style={styles.qrTier}>{tier} Member · {stamps}/10 stamps</div>
        </div>

        <div style={styles.qrInstructions}>
          <div style={styles.qrInstructIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div style={styles.qrInstructText}>Show this code to SJS staff at the door. They'll scan it to stamp your card and track your rewards.</div>
        </div>

        <div style={styles.qrNote}>Stamps are added automatically after each verified check-in. Your progress syncs across devices.</div>

        <button className="btn-gold" style={{ ...styles.btnGold, width: "100%", marginTop: 16 }} onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

/* ── vip landing ─────────────────────────────────────────── */
function VIPLanding({ openVip }) {
  return (
    <div>
      <div style={styles.pageTitle}>VIP EXPERIENCE</div>
      <div style={styles.vipHero}>
        <div style={styles.vipImageWrap}>
          <img src="/images/easter.jpg" alt="VIP bottle service at SJS" style={styles.vipImage} loading="lazy" />
          <div style={styles.vipImageOverlay} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={styles.vipHeroTitle}>Reserve Your Table</div>
          <div style={styles.vipHeroSub}>Bottle service, priority entry, dedicated host. No more texting a number and hoping.</div>
        </div>
      </div>
      <div style={styles.sectionLabel}>UPCOMING SHOWS</div>
      {SHOWS.map(s => (
        <div key={s.id} style={styles.vipShowRow}>
          <div>
            <div style={styles.vipShowTitle}>{s.title}</div>
            <div style={styles.vipShowMeta}>{s.venue} · {s.date}</div>
          </div>
          <button className="btn-gold" style={styles.btnGoldSm} onClick={() => openVip(s)}>Reserve</button>
        </div>
      ))}
      <div style={styles.sectionLabel}>PACKAGES</div>
      {[
        { name: "The Duo", guests: "2 guests", bottle: "1 bottle", price: "$220" },
        { name: "The Squad", guests: "4–6 guests", bottle: "2 bottles", price: "$420" },
        { name: "The Section", guests: "8–10 guests", bottle: "4 bottles", price: "$750" },
      ].map((p, i) => (
        <div key={i} style={styles.packageRow}>
          <div style={styles.packageLeft}>
            <div style={styles.packageName}>{p.name}</div>
            <div style={styles.packageMeta}>{p.guests} · {p.bottle}</div>
          </div>
          <div style={styles.packagePrice}>{p.price}</div>
        </div>
      ))}
    </div>
  );
}

/* ── more / about tab ────────────────────────────────────── */
function MoreTab() {
  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={styles.pageTitle}>SLOW JAM SUNDAYS</div>

      {/* Hero about */}
      <div style={styles.aboutHero}>
        <div style={styles.aboutImageWrap}>
          <img src="/images/about.png" alt="The SJS Crew" style={styles.aboutImage} />
          <div style={styles.aboutImageOverlay} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={styles.aboutTagline}>Baby making music...</div>
          <div style={styles.aboutTaglineSub}>or just practice.</div>
        </div>
      </div>

      {/* The Story */}
      <div style={styles.sectionLabel}>THE STORY</div>
      <div style={styles.aboutCard}>
        <div style={styles.aboutText}>
          Vancouver's original slow jam party — founded in the summer of 2012 by a crew of friends who wanted a night dedicated to R&B, old school and new.
        </div>
        <div style={styles.aboutText}>
          What started as intimate gatherings quickly grew into 700+ guest events across clubs, restaurants, hotels, boats, and even stadiums. SJS never plays the same venue consecutively — it's a caravan night that keeps the city guessing.
        </div>
        <div style={styles.aboutText}>
          In 2013, SJS launched a concert series featuring artists like <span style={{ color: gold }}>Dru Hill, Ginuwine, Dwele, Big Daddy Kane</span>, and <span style={{ color: gold }}>Salt-N-Pepa</span>.
        </div>
      </div>

      {/* Awards */}
      <div style={styles.sectionLabel}>RECOGNITION</div>
      <div style={styles.awardsRow}>
        {[
          { label: "Best Urban Night", year: "2013 & 2014" },
          { label: "Best Urban DJ", year: "Marlon J English" },
          { label: "VNA Event of the Year", year: "Nominated" },
        ].map((a, i) => (
          <div key={i} style={styles.awardCard}>
            <div style={styles.awardIcon}>✦</div>
            <div style={styles.awardLabel}>{a.label}</div>
            <div style={styles.awardYear}>{a.year}</div>
          </div>
        ))}
      </div>

      {/* The Crew */}
      <div style={styles.sectionLabel}>THE CREW</div>
      {[
        { name: "Marlon J. English", role: "DJ / Founder", desc: "Award-winning DJ and the heartbeat behind every SJS set. Mixing old school R&B with new school heat since 2012." },
        { name: "P-Luv", role: "DJ / Co-Founder", desc: "The other half of the decks. Known for reading the room and keeping the energy locked in all night." },
        { name: "Ariel Swan", role: "Host", desc: "The voice of SJS. Keeps the crowd moving and the vibes right from doors to last call." },
        { name: "Aaron Dudley", role: "Host", desc: "Energy on another level. If you've been to an SJS night, you've felt the impact." },
      ].map((p, i) => (
        <div key={i} style={styles.crewRow}>
          <div style={styles.crewAvatar}>{p.name.charAt(0)}</div>
          <div style={styles.crewInfo}>
            <div style={styles.crewName}>{p.name}</div>
            <div style={styles.crewRole}>{p.role}</div>
            <div style={styles.crewDesc}>{p.desc}</div>
          </div>
        </div>
      ))}

      {/* Stats */}
      <div style={styles.sectionLabel}>BY THE NUMBERS</div>
      <div style={styles.statsGrid}>
        {[
          { num: "2012", label: "Founded" },
          { num: "700+", label: "Guests per show" },
          { num: "12+", label: "Years running" },
          { num: "100+", label: "Events thrown" },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Signature line */}
      <div style={styles.signatureLine}>Best crowd. Best music. Best night.</div>

      {/* Social links */}
      <div style={styles.sectionLabel}>FOLLOW SJS</div>
      <div style={styles.socialRow}>
        {[
          { name: "Instagram", handle: "@slowjamsundays", url: "https://instagram.com/slowjamsundays" },
          { name: "Facebook", handle: "/slowjamsundays", url: "https://facebook.com/slowjamsundays" },
          { name: "SoundCloud", handle: "slow-jam-sundays", url: "https://soundcloud.com/slow-jam-sundays" },
        ].map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
            <div style={styles.socialName}>{s.name}</div>
            <div style={styles.socialHandle}>{s.handle}</div>
          </a>
        ))}
      </div>

      {/* Contact */}
      <div style={styles.sectionLabel}>CONTACT</div>
      <div style={styles.aboutCard}>
        <div style={styles.aboutText}>
          For VIP & bottle service: <span style={{ color: gold }}>604-375-9726</span>
        </div>
        <div style={styles.aboutText}>
          For bookings & press: <span style={{ color: gold }}>slowjamsundays.com/contact</span>
        </div>
      </div>

      <div style={styles.footerText}>© 2026 Slow Jam Sundays. All rights reserved.</div>
    </div>
  );
}

/* ── vip modal ───────────────────────────────────────────── */
function VIPModal({ show, step, setStep, tableSize, setTableSize, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const sizes = ["2 guests", "4–6 guests", "8–10 guests"];

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim()) e.phone = "Phone is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="modal-overlay" style={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="VIP Table Reservation">
      <div className="modal-sheet" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>VIP TABLE RESERVATION</div>
          <button style={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div style={styles.modalShow}>{show?.title}</div>
        <div style={styles.modalVenue}>{show?.venue} · {show?.date}</div>
        <div style={styles.modalSteps}>
          {[1,2,3].map(s => (
            <div key={s} style={{ ...styles.stepDot, ...(s <= step ? styles.stepDotActive : {}) }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={styles.modalStep}>Select your group size</div>
            {sizes.map((s, i) => (
              <button key={i} style={{ ...styles.sizeOption, ...(tableSize === s ? styles.sizeSelected : {}) }} onClick={() => setTableSize(s)}>{s}</button>
            ))}
            <button className="btn-gold" style={{ ...styles.btnGold, width: "100%", marginTop: 20, opacity: tableSize ? 1 : 0.4 }} disabled={!tableSize} onClick={() => tableSize && setStep(2)}>Continue</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={styles.modalStep}>Your details</div>
            <input style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }} placeholder="Your name" type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <div style={styles.fieldError}>{errors.name}</div>}
            <input style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }} placeholder="Phone number" type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            {errors.phone && <div style={styles.fieldError}>{errors.phone}</div>}
            <input style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }} placeholder="Email address" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
            {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
            <div style={styles.modalNote}>A host will confirm your table within 2 hours.</div>
            <button className="btn-gold" style={{ ...styles.btnGold, width: "100%", marginTop: 20 }} onClick={() => validate() && setStep(3)}>Request Table</button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.confirmBlock}>
            <div style={styles.confirmIcon}>✦</div>
            <div style={styles.confirmTitle}>Request Sent</div>
            <div style={styles.confirmSub}>Your SJS host will reach out to confirm. Get ready for a legendary night.</div>
            <button className="btn-gold" style={{ ...styles.btnGold, width: "100%", marginTop: 24 }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ticket modal (multi-step checkout) ──────────────────── */
function TicketModal({ show, onClose }) {
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(1);
  const [ticketType, setTicketType] = useState("ga");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardZip, setCardZip] = useState("");
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const priceNum = parseInt(show.price.replace("$", ""));
  const ticketTypes = [
    { id: "ga", label: "General Admission", price: priceNum },
    { id: "member", label: "SJS Insider", price: Math.round(priceNum * 0.8), tag: "Member Price" },
  ];
  const selectedType = ticketTypes.find(t => t.id === ticketType);
  const subtotal = selectedType.price * qty;
  const serviceFee = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + serviceFee;

  const ticketId = "SJS-TKT-" + (4800 + Math.floor(Math.random() * 200));

  const formatCard = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };
  const formatExp = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };

  const validateContact = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (cardNum.replace(/\s/g, "").length < 15) e.cardNum = "Invalid card number";
    if (cardExp.replace(/\s|\/]/g, "").length < 4) e.cardExp = "Invalid";
    if (cardCvc.length < 3) e.cardCvc = "Invalid";
    if (cardZip.length < 5) e.cardZip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePurchase = () => {
    if (!validatePayment()) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep(4); }, 1800);
  };

  const ck = { lineItem: { display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, color: "#9e8e78" }, lineVal: { color: "#f4efe4" }, divider: { borderTop: "1px solid #332820", margin: "6px 0" }, totalRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 17, fontWeight: 700, color: "#e2b655" }, secureRow: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 10, fontSize: 13, color: "#9e8e78" } };

  return (
    <div className="modal-overlay" style={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Get Tickets">
      <div className="modal-sheet" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>{step === 4 ? "CONFIRMED" : step === 3 ? "PAYMENT" : step === 2 ? "YOUR INFO" : "GET TICKETS"}</div>
          <button style={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {step < 4 && (
          <>
            <div style={styles.modalShow}>{show.title}</div>
            <div style={styles.modalVenue}>{show.venue} · {show.date} · {show.time}</div>
            <div style={styles.modalSteps}>
              {[1,2,3].map(s => (
                <div key={s} style={{ ...styles.stepDot, ...(s <= step ? styles.stepDotActive : {}), flex: 1 }} />
              ))}
            </div>
          </>
        )}

        {/* Step 1: Select tickets */}
        {step === 1 && (
          <div>
            {ticketTypes.map(t => (
              <button key={t.id} onClick={() => setTicketType(t.id)} style={{ ...styles.sizeOption, ...(ticketType === t.id ? styles.sizeSelected : {}), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.label}</div>
                  {t.tag && <div style={{ fontSize: 12, color: "#e2b655", marginTop: 2 }}>{t.tag}</div>}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: ticketType === t.id ? "#e2b655" : "#f4efe4" }}>${t.price}</div>
              </button>
            ))}

            <div style={styles.qtyRow}>
              <span style={styles.qtyLabel}>Quantity</span>
              <div style={styles.qtyControls}>
                <button className="btn-outline" style={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
                <span style={styles.qtyNum}>{qty}</span>
                <button className="btn-outline" style={styles.qtyBtn} onClick={() => setQty(Math.min(6, qty + 1))} aria-label="Increase">+</button>
              </div>
            </div>

            <div style={styles.sellBar2}><div className="sell-fill" style={{ width: `${show.sold}%` }} /></div>
            <div style={{ ...styles.sellLabel, marginBottom: 12 }}>{show.sold}% sold — don't wait</div>

            {/* Order summary */}
            <div style={{ background: "rgba(226,182,85,0.04)", border: "1px solid #332820", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={ck.lineItem}><span>{qty}x {selectedType.label}</span><span style={ck.lineVal}>${subtotal}</span></div>
              <div style={ck.lineItem}><span>Service fee</span><span style={ck.lineVal}>${serviceFee.toFixed(2)}</span></div>
              <div style={ck.divider} />
              <div style={ck.totalRow}><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>

            <button className="btn-gold" style={{ ...styles.btnGold, width: "100%" }} onClick={() => setStep(2)}>Continue to Checkout</button>
            <div style={styles.modalNote}>Powered by AdmitOne · Secure checkout</div>
          </div>
        )}

        {/* Step 2: Contact info */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginBottom: 12 }}>CONTACT DETAILS</div>
            <input style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }} placeholder="Full name" type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <div style={styles.fieldError}>{errors.name}</div>}
            <input style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }} placeholder="Email address" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
            {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
            <input style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }} placeholder="Phone number" type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            {errors.phone && <div style={styles.fieldError}>{errors.phone}</div>}

            <div style={{ background: "rgba(226,182,85,0.06)", border: "1px solid rgba(226,182,85,0.18)", borderRadius: 8, padding: 12, marginTop: 6, marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ color: "#e2b655", fontSize: 16, flexShrink: 0, marginTop: 1 }}>✦</span>
              <span style={{ fontSize: 13, color: "#9e8e78", lineHeight: 1.5 }}>Your tickets and QR code will be sent to this email. Make sure it's correct.</span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-outline" style={{ ...styles.btnOutline, flex: 1 }} onClick={() => setStep(1)}>Back</button>
              <button className="btn-gold" style={{ ...styles.btnGold, flex: 2 }} onClick={() => validateContact() && setStep(3)}>Continue to Payment</button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginBottom: 12 }}>PAYMENT DETAILS</div>

            <div style={{ position: "relative" }}>
              <input style={{ ...styles.input, ...(errors.cardNum ? styles.inputError : {}), paddingRight: 56 }} placeholder="Card number" inputMode="numeric" value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} />
              <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4, opacity: 0.5 }}>
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="2" fill="#1a1f71"/><circle cx="9" cy="8" r="5" fill="#eb001b" opacity="0.8"/><circle cx="15" cy="8" r="5" fill="#f79e1b" opacity="0.8"/></svg>
              </div>
            </div>
            {errors.cardNum && <div style={styles.fieldError}>{errors.cardNum}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <input style={{ ...styles.input, ...(errors.cardExp ? styles.inputError : {}) }} placeholder="MM / YY" inputMode="numeric" value={cardExp} onChange={e => setCardExp(formatExp(e.target.value))} />
                {errors.cardExp && <div style={styles.fieldError}>{errors.cardExp}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <input style={{ ...styles.input, ...(errors.cardCvc ? styles.inputError : {}) }} placeholder="CVC" inputMode="numeric" maxLength={4} value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                {errors.cardCvc && <div style={styles.fieldError}>{errors.cardCvc}</div>}
              </div>
            </div>

            <input style={{ ...styles.input, ...(errors.cardZip ? styles.inputError : {}) }} placeholder="Billing ZIP / Postal code" inputMode="numeric" value={cardZip} onChange={e => setCardZip(e.target.value.slice(0, 7))} />
            {errors.cardZip && <div style={styles.fieldError}>{errors.cardZip}</div>}

            {/* Order summary */}
            <div style={{ background: "rgba(226,182,85,0.04)", border: "1px solid #332820", borderRadius: 10, padding: 14, marginBottom: 14, marginTop: 4 }}>
              <div style={ck.lineItem}><span>{qty}x {selectedType.label}</span><span style={ck.lineVal}>${subtotal}</span></div>
              <div style={ck.lineItem}><span>Service fee</span><span style={ck.lineVal}>${serviceFee.toFixed(2)}</span></div>
              <div style={ck.divider} />
              <div style={ck.totalRow}><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-outline" style={{ ...styles.btnOutline, flex: 1 }} onClick={() => setStep(2)} disabled={processing}>Back</button>
              <button className="btn-gold" style={{ ...styles.btnGold, flex: 2, position: "relative" }} onClick={handlePurchase} disabled={processing}>
                {processing ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span className="spin-dot" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(12,9,7,0.3)", borderTop: "2px solid #0c0907", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Processing...
                  </span>
                ) : `Pay $${total.toFixed(2)}`}
              </button>
            </div>

            <div style={ck.secureRow}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="#9e8e78" strokeWidth="1.5"><rect x="1" y="6" width="10" height="7" rx="1.5"/><path d="M3 6V4a3 3 0 0 1 6 0v2"/></svg>
              <span>Encrypted & secure · Powered by AdmitOne</span>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✦</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#f4efe4", marginBottom: 6 }}>You're In!</div>
            <div style={{ fontSize: 15, color: "#9e8e78", lineHeight: 1.5, marginBottom: 20 }}>
              {qty}x {selectedType.label} for {show.title}
            </div>

            {/* Ticket card */}
            <div style={{ background: "linear-gradient(145deg, #1c1408 0%, #28200f 50%, #2e2214 100%)", border: "1px solid rgba(226,182,85,0.3)", borderRadius: 14, padding: 20, marginBottom: 16, textAlign: "left", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: "radial-gradient(circle, rgba(226,182,85,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
              <div style={{ fontSize: 12, letterSpacing: 3, color: "#e2b655", marginBottom: 10 }}>YOUR TICKET</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#f4efe4", marginBottom: 4 }}>{show.title}</div>
              <div style={{ fontSize: 14, color: "#9e8e78", marginBottom: 12 }}>{show.venue} · {show.date} · {show.time}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#9e8e78", marginBottom: 2 }}>{selectedType.label} · {qty}x</div>
                  <div style={{ fontSize: 12, color: "#9e8e78", letterSpacing: 1 }}>{ticketId}</div>
                  {name && <div style={{ fontSize: 13, color: "#f4efe4", marginTop: 4 }}>{name}</div>}
                </div>
                <div style={{ width: 52, height: 52, background: "#f4efe4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0c0907" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/><line x1="21" y1="14" x2="21" y2="18"/><line x1="18" y1="21" x2="21" y2="21"/></svg>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              <div style={{ flex: 1, background: "rgba(226,182,85,0.06)", border: "1px solid rgba(226,182,85,0.18)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#e2b655" }}>${total.toFixed(2)}</div>
                <div style={{ fontSize: 12, color: "#9e8e78", letterSpacing: 1, marginTop: 2 }}>CHARGED</div>
              </div>
              <div style={{ flex: 1, background: "rgba(80,200,120,0.06)", border: "1px solid rgba(80,200,120,0.18)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#50c878" }}>Confirmed</div>
                <div style={{ fontSize: 12, color: "#9e8e78", letterSpacing: 1, marginTop: 2 }}>STATUS</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: "#9e8e78", lineHeight: 1.5, marginBottom: 16 }}>
              Confirmation sent to <span style={{ color: "#e2b655" }}>{email || "your email"}</span>. Show the QR code at the door for fast entry.
            </div>

            <button className="btn-gold" style={{ ...styles.btnGold, width: "100%" }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── notifications modal ─────────────────────────────────── */
function NotificationsModal({ onClose }) {
  const notifications = [
    { id: 1, title: "Tickets dropping soon", body: "SJS: May Long Weekend tickets go live this Friday at noon. Members get 1-hour early access.", time: "2h ago", unread: true },
    { id: 2, title: "You earned a stamp!", body: "Thanks for attending SJS: Spring Equinox. You're 3 stamps away from a free ticket.", time: "3d ago", unread: true },
  ];
  return (
    <div className="modal-overlay" style={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Notifications">
      <div className="modal-sheet" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>NOTIFICATIONS</div>
          <button style={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>
        {notifications.map(n => (
          <div key={n.id} style={{ background: n.unread ? "rgba(226,182,85,0.06)" : "transparent", border: `1px solid ${n.unread ? "rgba(226,182,85,0.18)" : "#332820"}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#f4efe4" }}>{n.title}</span>
              {n.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e2b655", flexShrink: 0 }} />}
            </div>
            <div style={{ fontSize: 14, color: "#9e8e78", lineHeight: 1.4, marginBottom: 6 }}>{n.body}</div>
            <div style={{ fontSize: 13, color: "#9e8e78", letterSpacing: 1 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── profile modal ───────────────────────────────────────── */
function ProfileModal({ onClose, stamps }) {
  const [view, setView] = useState("main");
  const tier = stamps >= 10 ? "Gold" : stamps >= 5 ? "Silver" : "Bronze";

  const backBtn = (
    <button style={{ background: "none", border: "none", color: "#e2b655", fontSize: 15, cursor: "pointer", padding: 0, fontFamily: "inherit" }} onClick={() => setView("main")}>← Back</button>
  );

  const viewTitle = { main: "PROFILE", tickets: "MY TICKETS", preferences: "PREFERENCES", refer: "REFER A FRIEND", help: "HELP & SUPPORT" }[view];

  return (
    <div className="modal-overlay" style={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Profile">
      <div className="modal-sheet" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {view !== "main" && backBtn}
            <div style={styles.modalTitle}>{viewTitle}</div>
          </div>
          <button style={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {view === "main" && <ProfileMain tier={tier} stamps={stamps} setView={setView} />}
        {view === "tickets" && <MyTicketsView />}
        {view === "preferences" && <PreferencesView />}
        {view === "refer" && <ReferView />}
        {view === "help" && <HelpView />}
      </div>
    </div>
  );
}

function ProfileMain({ tier, stamps, setView }) {
  const menuItems = [
    { key: "tickets", label: "My Tickets", icon: "◈", desc: "View upcoming & past events" },
    { key: "preferences", label: "Preferences", icon: "◉", desc: "Notifications, music & privacy" },
    { key: "refer", label: "Refer a Friend", icon: "♦", desc: "Earn stamps for referrals" },
    { key: "help", label: "Help & Support", icon: "✦", desc: "FAQ, contact & feedback" },
  ];
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(226,182,85,0.12)", border: "2px solid rgba(226,182,85,0.3)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e2b655" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#f4efe4" }}>SJS Member</div>
        <div style={{ fontSize: 14, color: "#e2b655", letterSpacing: 2, marginTop: 4 }}>{tier.toUpperCase()} TIER · {stamps} STAMPS</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {menuItems.map(item => (
          <div key={item.key} onClick={() => setView(item.key)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 12px", background: "rgba(226,182,85,0.04)", border: "1px solid #332820", borderRadius: 12, cursor: "pointer", transition: "border-color 0.15s" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(226,182,85,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e2b655", fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#f4efe4" }}>{item.label}</div>
              <div style={{ fontSize: 14, color: "#9e8e78", marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── my tickets sub-view ─────────────────────────────────── */
function MyTicketsView() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const upcoming = [
    { id: 1, title: "SJS: May Long Weekend", venue: "Twelve West", date: "May 18, 2026", time: "Doors 9:30 PM", qty: 2, ticketId: "SJS-TKT-4829", type: "General Admission" },
  ];
  const past = [
    { id: 10, title: "SJS: Spring Equinox", venue: "Fortune Sound Club", date: "Mar 15, 2026", time: "Doors 9:00 PM", qty: 1, ticketId: "SJS-TKT-3102", type: "General Admission" },
    { id: 11, title: "SJS: Valentine's Special", venue: "Twelve West", date: "Feb 14, 2026", time: "Doors 9:30 PM", qty: 2, ticketId: "SJS-TKT-2744", type: "VIP Table" },
    { id: 12, title: "SJS: New Year Kickoff", venue: "Commodore Ballroom", date: "Jan 12, 2026", time: "Doors 9:00 PM", qty: 1, ticketId: "SJS-TKT-2201", type: "General Admission" },
  ];
  const tickets = activeTab === "upcoming" ? upcoming : past;

  return (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 16, background: "#161210", borderRadius: 10, padding: 3, border: "1px solid #332820" }}>
        {["upcoming", "past"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, letterSpacing: 1.5, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", background: activeTab === t ? "rgba(226,182,85,0.15)" : "transparent", color: activeTab === t ? "#e2b655" : "#9e8e78" }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      {tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#9e8e78", fontSize: 15 }}>No tickets yet</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tickets.map(t => (
            <div key={t.id} style={{ background: "linear-gradient(135deg, #161210 0%, #211a14 100%)", border: "1px solid #332820", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f4efe4", marginBottom: 3 }}>{t.title}</div>
                  <div style={{ fontSize: 14, color: "#9e8e78" }}>{t.venue} · {t.date}</div>
                  <div style={{ fontSize: 14, color: "#9e8e78" }}>{t.time}</div>
                </div>
                <div style={{ fontSize: 12, letterSpacing: 2, color: activeTab === "upcoming" ? "#e2b655" : "#9e8e78", background: activeTab === "upcoming" ? "rgba(226,182,85,0.1)" : "rgba(158,142,120,0.1)", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                  {activeTab === "upcoming" ? "ACTIVE" : "ATTENDED"}
                </div>
              </div>
              <div style={{ borderTop: "1px solid #332820", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#9e8e78", letterSpacing: 1 }}>{t.type} · {t.qty}x</div>
                  <div style={{ fontSize: 12, color: "#9e8e78", letterSpacing: 0.5, marginTop: 2 }}>{t.ticketId}</div>
                </div>
                {activeTab === "upcoming" && (
                  <div style={{ width: 40, height: 40, background: "#f4efe4", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0c0907" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/><line x1="21" y1="14" x2="21" y2="18"/><line x1="18" y1="21" x2="21" y2="21"/></svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── preferences sub-view ────────────────────────────────── */
function PreferencesView() {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAge, setShowAge] = useState(false);
  const [favGenres, setFavGenres] = useState(["R&B", "Old School"]);

  const genres = ["R&B", "Old School", "Neo Soul", "Hip Hop", "Dancehall", "Afrobeats", "House", "Reggae"];

  const toggleGenre = (g) => {
    setFavGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? "#e2b655" : "#332820", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: on ? "#0c0907" : "#9e8e78", position: "absolute", top: 2, left: on ? 22 : 2, transition: "left 0.2s" }} />
    </div>
  );

  return (
    <div>
      {/* Notifications section */}
      <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginBottom: 12 }}>NOTIFICATIONS</div>
      {[
        { label: "Push Notifications", desc: "Ticket drops & event reminders", on: pushNotifs, toggle: () => setPushNotifs(!pushNotifs) },
        { label: "Email Updates", desc: "Weekly lineup & member perks", on: emailNotifs, toggle: () => setEmailNotifs(!emailNotifs) },
        { label: "SMS Alerts", desc: "Last-minute announcements", on: smsNotifs, toggle: () => setSmsNotifs(!smsNotifs) },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #332820" }}>
          <div>
            <div style={{ fontSize: 15, color: "#f4efe4", fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: "#9e8e78", marginTop: 2 }}>{item.desc}</div>
          </div>
          <Toggle on={item.on} onToggle={item.toggle} />
        </div>
      ))}

      {/* Music Preferences */}
      <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginTop: 24, marginBottom: 12 }}>MUSIC PREFERENCES</div>
      <div style={{ fontSize: 14, color: "#9e8e78", marginBottom: 10 }}>Select your favorite genres to personalize event recommendations.</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {genres.map(g => {
          const active = favGenres.includes(g);
          return (
            <button key={g} onClick={() => toggleGenre(g)} style={{ padding: "8px 16px", borderRadius: 20, border: `1px solid ${active ? "#e2b655" : "#332820"}`, background: active ? "rgba(226,182,85,0.12)" : "transparent", color: active ? "#e2b655" : "#9e8e78", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
              {g}
            </button>
          );
        })}
      </div>

      {/* Privacy & Display */}
      <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginTop: 24, marginBottom: 12 }}>PRIVACY & DISPLAY</div>
      {[
        { label: "Dark Mode", desc: "Always dark — as it should be", on: darkMode, toggle: () => setDarkMode(!darkMode) },
        { label: "Show Profile Publicly", desc: "Let others see your attendance", on: showAge, toggle: () => setShowAge(!showAge) },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #332820" }}>
          <div>
            <div style={{ fontSize: 15, color: "#f4efe4", fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: "#9e8e78", marginTop: 2 }}>{item.desc}</div>
          </div>
          <Toggle on={item.on} onToggle={item.toggle} />
        </div>
      ))}
    </div>
  );
}

/* ── refer a friend sub-view ─────────────────────────────── */
function ReferView() {
  const [copied, setCopied] = useState(false);
  const referralCode = "SJS-FRIEND-7X2K";
  const referralLink = "slowjamsundays.com/r/7X2K";

  const copyCode = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎶</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f4efe4", marginBottom: 6 }}>Share the Vibes</div>
        <div style={{ fontSize: 15, color: "#9e8e78", lineHeight: 1.5 }}>For every friend who attends their first SJS night with your link, you both earn a bonus stamp.</div>
      </div>

      {/* Referral code card */}
      <div style={{ background: "rgba(226,182,85,0.06)", border: "1px solid rgba(226,182,85,0.2)", borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginBottom: 8 }}>YOUR REFERRAL CODE</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#e2b655", letterSpacing: 3, marginBottom: 12 }}>{referralCode}</div>
        <div style={{ fontSize: 14, color: "#9e8e78", marginBottom: 16 }}>{referralLink}</div>
        <button onClick={copyCode} style={{ background: copied ? "rgba(80,200,120,0.15)" : "linear-gradient(135deg, #b8922e 0%, #e2b655 50%, #f0cc6a 100%)", color: copied ? "#50c878" : "#0c0907", border: copied ? "1px solid rgba(80,200,120,0.3)" : "none", borderRadius: 8, padding: "12px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", transition: "all 0.2s", letterSpacing: 0.5 }}>
          {copied ? "✓ Link Copied!" : "Copy Referral Link"}
        </button>
      </div>

      {/* How it works */}
      <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginBottom: 12 }}>HOW IT WORKS</div>
      {[
        { step: "1", title: "Share your link", desc: "Send it to friends via text, DM, or social" },
        { step: "2", title: "They attend an SJS night", desc: "Your friend buys a ticket & shows up" },
        { step: "3", title: "You both earn a stamp", desc: "Bonus stamp added to both loyalty cards" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(226,182,85,0.1)", border: "1px solid rgba(226,182,85,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e2b655", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f4efe4" }}>{s.title}</div>
            <div style={{ fontSize: 14, color: "#9e8e78", marginTop: 2 }}>{s.desc}</div>
          </div>
        </div>
      ))}

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {[
          { num: "3", label: "Friends Referred" },
          { num: "3", label: "Stamps Earned" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "rgba(226,182,85,0.06)", border: "1px solid rgba(226,182,85,0.18)", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#e2b655" }}>{s.num}</div>
            <div style={{ fontSize: 13, color: "#9e8e78", letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── help & support sub-view ─────────────────────────────── */
function HelpView() {
  const [openFaq, setOpenFaq] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const faqs = [
    { q: "How does the loyalty card work?", a: "Every time you attend an SJS event and check in with your QR code, you earn a stamp. Collect 10 stamps and your next ticket is free. Stamps never expire." },
    { q: "Can I transfer my tickets?", a: "Yes! Open the ticket from your My Tickets page and tap 'Share'. The recipient will receive a link to claim the ticket in their own account." },
    { q: "What is VIP table service?", a: "VIP tables are premium reserved spots near the DJ booth with bottle service, a dedicated host, and priority entry. Tables seat 4-8 guests. Reservations are confirmed within 2 hours." },
    { q: "How do referral stamps work?", a: "Share your unique referral link with friends. When they purchase a ticket and attend their first SJS event, both you and your friend earn a bonus stamp on your loyalty cards." },
    { q: "What's the refund policy?", a: "Tickets are non-refundable but can be transferred to another person up to 24 hours before the event. If an event is cancelled, full refunds are issued automatically." },
  ];

  const handleFeedback = () => {
    if (feedbackText.trim()) {
      setFeedbackSent(true);
      setFeedbackText("");
      setTimeout(() => setFeedbackSent(false), 3000);
    }
  };

  return (
    <div>
      {/* FAQ */}
      <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginBottom: 12 }}>FREQUENTLY ASKED</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ border: "1px solid #332820", borderRadius: 10, overflow: "hidden" }}>
            <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding: "14px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: openFaq === i ? "rgba(226,182,85,0.04)" : "transparent" }}>
              <span style={{ fontSize: 15, color: "#f4efe4", fontWeight: 500, paddingRight: 12 }}>{faq.q}</span>
              <span style={{ color: "#e2b655", fontSize: 18, flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
            </div>
            {openFaq === i && (
              <div style={{ padding: "0 14px 14px", fontSize: 14, color: "#9e8e78", lineHeight: 1.6 }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginBottom: 12 }}>CONTACT US</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { label: "VIP & Bottle Service", value: "604-375-9726", icon: "☎" },
          { label: "General Inquiries", value: "info@slowjamsundays.com", icon: "✉" },
          { label: "Instagram DM", value: "@slowjamsundays", icon: "◉" },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(226,182,85,0.04)", border: "1px solid #332820", borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(226,182,85,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 14, color: "#9e8e78" }}>{c.label}</div>
              <div style={{ fontSize: 15, color: "#e2b655", fontWeight: 500 }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      <div style={{ fontSize: 12, letterSpacing: 3, color: "#9e8e78", marginBottom: 12 }}>SEND FEEDBACK</div>
      <textarea
        value={feedbackText}
        onChange={e => setFeedbackText(e.target.value)}
        placeholder="Tell us what you think — what's working, what's not, what you'd love to see..."
        style={{ width: "100%", minHeight: 80, padding: 14, background: "#161210", border: "1px solid #332820", borderRadius: 10, color: "#f4efe4", fontSize: 15, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
      />
      <button onClick={handleFeedback} style={{ marginTop: 10, width: "100%", padding: "12px 0", background: feedbackSent ? "rgba(80,200,120,0.12)" : "linear-gradient(135deg, #b8922e 0%, #e2b655 50%, #f0cc6a 100%)", color: feedbackSent ? "#50c878" : "#0c0907", border: feedbackSent ? "1px solid rgba(80,200,120,0.25)" : "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
        {feedbackSent ? "✓ Thanks for the feedback!" : "Submit Feedback"}
      </button>
    </div>
  );
}

/* ── admin panel (full-screen dashboard) ─────────────────── */
const INITIAL_EVENTS = [
  { id: 1, title: "SJS: May Long Weekend", venue: "Twelve West", date: "2026-05-18", time: "9:30 PM", price: 25, capacity: 700, sold: 504, status: "Active", image: "/images/event-may.jpg" },
  { id: 2, title: "SJS: Summer Kickoff", venue: "Commodore Ballroom", date: "2026-06-22", time: "9:00 PM", price: 30, capacity: 800, sold: 320, status: "Active", image: "/images/hero-summer.jpeg" },
  { id: 3, title: "SJS: Boat Party", venue: "Vancouver Harbour", date: "2026-07-13", time: "7:00 PM", price: 45, capacity: 200, sold: 176, status: "Active", image: "/images/boat-party.jpg" },
];

const INITIAL_TICKETS = [
  { id: 1, name: "General Admission", desc: "Standard entry", basePrice: 25, discount: 0, availability: "Everyone", status: "Active" },
  { id: 2, name: "Member", desc: "SJS Insider members", basePrice: 25, discount: 20, availability: "Members Only", status: "Active" },
  { id: 3, name: "VIP Table (4)", desc: "Reserved table for 4 guests", basePrice: 150, discount: 0, availability: "Everyone", status: "Active" },
  { id: 4, name: "VIP Table (8)", desc: "Reserved table for 8 guests", basePrice: 250, discount: 0, availability: "Everyone", status: "Active" },
  { id: 5, name: "Early Bird", desc: "First 100 tickets per event", basePrice: 25, discount: 40, availability: "Everyone", status: "Inactive" },
];

const INITIAL_PROMOS = [
  { id: 1, code: "SJSFRIEND", desc: "Referral discount", discountType: "%", discountVal: 15, uses: 47, maxUses: 200, status: "Active" },
  { id: 2, code: "SUMMER26", desc: "Summer launch promo", discountType: "$", discountVal: 10, uses: 12, maxUses: 50, status: "Active" },
  { id: 3, code: "VIP20OFF", desc: "VIP table discount", discountType: "%", discountVal: 20, uses: 8, maxUses: 25, status: "Active" },
];

const INITIAL_MEMBERS = [
  { id: 1, name: "Jasmine Carter", email: "jasmine.c@gmail.com", tier: "Gold", stamps: 9, joined: "2024-03-12", events: 14, status: "Active" },
  { id: 2, name: "Marcus Chen", email: "m.chen@outlook.com", tier: "Gold", stamps: 8, joined: "2024-06-01", events: 11, status: "Active" },
  { id: 3, name: "Desiree Williams", email: "desi.w@yahoo.com", tier: "Silver", stamps: 6, joined: "2025-01-18", events: 7, status: "Active" },
  { id: 4, name: "Jordan Baptiste", email: "jbaptiste@gmail.com", tier: "Silver", stamps: 5, joined: "2025-04-22", events: 6, status: "Active" },
  { id: 5, name: "Aaliyah Robinson", email: "aaliyah.r@icloud.com", tier: "Bronze", stamps: 3, joined: "2025-08-10", events: 3, status: "Active" },
  { id: 6, name: "Tyler Okonkwo", email: "tyler.ok@gmail.com", tier: "Bronze", stamps: 1, joined: "2026-01-05", events: 1, status: "Active" },
  { id: 7, name: "Samira Patel", email: "samira.p@hotmail.com", tier: "Silver", stamps: 4, joined: "2025-06-30", events: 5, status: "Inactive" },
];

function AdminModal({ onClose }) {
  const [page, setPage] = useState("dashboard");
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [promos, setPromos] = useState(INITIAL_PROMOS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  const a = {
    root: { position: "absolute", inset: 0, zIndex: 200, display: "flex", fontFamily: "'Georgia', serif", color: "#f4efe4", fontSize: 15 },
    sidebar: { width: 220, background: "#0c0907", borderRight: "1px solid #332820", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" },
    sidebarHeader: { padding: "20px 18px 16px", borderBottom: "1px solid #332820" },
    sidebarLogo: { fontSize: 16, fontWeight: 700, letterSpacing: 3, color: "#e2b655" },
    sidebarBadge: { fontSize: 11, letterSpacing: 2, color: "#9e8e78", marginLeft: 8 },
    navList: { flex: 1, padding: "12px 0" },
    navItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", cursor: "pointer", fontSize: 15, color: "#9e8e78", border: "none", background: "none", width: "100%", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s", borderLeft: "3px solid transparent" },
    navItemActive: { color: "#e2b655", background: "rgba(226,182,85,0.06)", borderLeft: "3px solid #e2b655" },
    main: { flex: 1, background: "#161210", overflowY: "auto", display: "flex", flexDirection: "column" },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderBottom: "1px solid #332820", background: "#0c0907", flexShrink: 0 },
    pageContent: { flex: 1, padding: 28, overflowY: "auto" },
    exitBtn: { display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", cursor: "pointer", fontSize: 14, color: "#9e8e78", border: "none", background: "none", fontFamily: "inherit", borderTop: "1px solid #332820", width: "100%", textAlign: "left", transition: "color 0.15s" },
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "events", label: "Events", icon: "◉" },
    { id: "tickets", label: "Tickets & Promos", icon: "✦" },
    { id: "members", label: "Members", icon: "♦" },
  ];

  return (
    <div style={a.root}>
      {/* Sidebar */}
      <div style={a.sidebar}>
        <div style={a.sidebarHeader}>
          <span style={a.sidebarLogo}>SJS</span>
          <span style={a.sidebarBadge}>ADMIN</span>
        </div>
        <div style={a.navList}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{ ...a.navItem, ...(page === n.id ? a.navItemActive : {}) }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={a.exitBtn}>
          <span style={{ fontSize: 16 }}>←</span> Exit Admin
        </button>
      </div>

      {/* Main content */}
      <div style={a.main}>
        <div style={a.topBar}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{navItems.find(n => n.id === page)?.label || "Admin"}</div>
            <div style={{ fontSize: 13, color: "#9e8e78", marginTop: 2 }}>Slow Jam Sundays · Admin Panel</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #332820", borderRadius: 8, padding: "8px 16px", color: "#9e8e78", cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>
            ✕ Close
          </button>
        </div>
        <div style={a.pageContent}>
          {page === "dashboard" && <AdminDashboard events={events} tickets={tickets} members={members} setPage={setPage} />}
          {page === "events" && <AdminEvents events={events} setEvents={setEvents} />}
          {page === "tickets" && <AdminTickets tickets={tickets} setTickets={setTickets} promos={promos} setPromos={setPromos} />}
          {page === "members" && <AdminMembers members={members} setMembers={setMembers} />}
        </div>
      </div>
    </div>
  );
}

/* ── admin: shared styles ────────────────────────────────── */
const ad = {
  card: { background: "#0c0907", border: "1px solid #332820", borderRadius: 12, padding: 20 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 },
  statCard: { background: "#0c0907", border: "1px solid #332820", borderRadius: 12, padding: 18 },
  statValue: { fontSize: 28, fontWeight: 700, color: "#e2b655", marginBottom: 4 },
  statLabel: { fontSize: 13, color: "#9e8e78", letterSpacing: 1 },
  statChange: { fontSize: 12, marginTop: 6 },
  sectionTitle: { fontSize: 13, letterSpacing: 3, color: "#9e8e78", marginBottom: 14 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 14px", fontSize: 13, letterSpacing: 2, color: "#9e8e78", borderBottom: "1px solid #332820", fontWeight: 600 },
  td: { padding: "12px 14px", borderBottom: "1px solid #1e1812", fontSize: 15, verticalAlign: "middle" },
  badge: (color) => ({ fontSize: 12, letterSpacing: 1, padding: "3px 10px", borderRadius: 20, fontWeight: 600, display: "inline-block", background: color === "gold" ? "rgba(226,182,85,0.12)" : color === "green" ? "rgba(80,200,120,0.12)" : color === "red" ? "rgba(224,64,64,0.12)" : "rgba(158,142,120,0.1)", color: color === "gold" ? "#e2b655" : color === "green" ? "#50c878" : color === "red" ? "#e04040" : "#9e8e78", border: `1px solid ${color === "gold" ? "rgba(226,182,85,0.25)" : color === "green" ? "rgba(80,200,120,0.25)" : color === "red" ? "rgba(224,64,64,0.25)" : "rgba(158,142,120,0.2)"}` }),
  btnPrimary: { background: "linear-gradient(135deg, #b8922e 0%, #e2b655 50%, #f0cc6a 100%)", color: "#0c0907", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 },
  btnSecondary: { background: "transparent", color: "#e2b655", border: "1px solid rgba(226,182,85,0.35)", borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  btnDanger: { background: "transparent", color: "#e04040", border: "1px solid rgba(224,64,64,0.3)", borderRadius: 6, padding: "6px 12px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  btnIcon: { background: "none", border: "none", cursor: "pointer", padding: 6, fontSize: 16, color: "#9e8e78", transition: "color 0.15s" },
  input: { width: "100%", background: "#161210", border: "1px solid #332820", borderRadius: 8, padding: "10px 14px", color: "#f4efe4", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  select: { width: "100%", background: "#161210", border: "1px solid #332820", borderRadius: 8, padding: "10px 14px", color: "#f4efe4", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", appearance: "none" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  formLabel: { fontSize: 13, color: "#9e8e78", letterSpacing: 1, marginBottom: 6, display: "block" },
  formGroup: { marginBottom: 14 },
  overlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" },
  dialog: { background: "linear-gradient(180deg, #1c1712 0%, #161210 100%)", border: "1px solid #332820", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" },
  dialogHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  dialogTitle: { fontSize: 18, fontWeight: 700 },
};

/* ── admin: dashboard ────────────────────────────────────── */
function AdminDashboard({ events, tickets, members, setPage }) {
  const totalSold = events.reduce((a, e) => a + e.sold, 0);
  const totalRevenue = events.reduce((a, e) => a + (e.sold * e.price), 0);
  const totalCapacity = events.reduce((a, e) => a + e.capacity, 0);
  const activeMembers = members.filter(m => m.status === "Active").length;

  return (
    <div>
      <div style={ad.statGrid}>
        {[
          { value: events.length, label: "Active Events", change: "+1 this month", up: true },
          { value: totalSold.toLocaleString(), label: "Tickets Sold", change: "+128 this week", up: true },
          { value: `$${totalRevenue.toLocaleString()}`, label: "Total Revenue", change: "+$3,200 this week", up: true },
          { value: activeMembers.toLocaleString(), label: "Active Members", change: "+18 this month", up: true },
        ].map((s, i) => (
          <div key={i} style={ad.statCard}>
            <div style={ad.statValue}>{s.value}</div>
            <div style={ad.statLabel}>{s.label}</div>
            <div style={{ ...ad.statChange, color: s.up ? "#50c878" : "#e04040" }}>{s.up ? "↑" : "↓"} {s.change}</div>
          </div>
        ))}
      </div>

      {/* Recent events */}
      <div style={ad.sectionTitle}>UPCOMING EVENTS</div>
      <div style={{ ...ad.card, marginBottom: 28, padding: 0, overflow: "hidden" }}>
        <table style={ad.table}>
          <thead>
            <tr>
              <th style={ad.th}>Event</th>
              <th style={ad.th}>Date</th>
              <th style={ad.th}>Venue</th>
              <th style={ad.th}>Sold</th>
              <th style={ad.th}>Revenue</th>
              <th style={ad.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td style={{ ...ad.td, fontWeight: 600 }}>{e.title}</td>
                <td style={ad.td}>{e.date}</td>
                <td style={{ ...ad.td, color: "#9e8e78" }}>{e.venue}</td>
                <td style={ad.td}>{e.sold}/{e.capacity}</td>
                <td style={{ ...ad.td, color: "#e2b655", fontWeight: 600 }}>${(e.sold * e.price).toLocaleString()}</td>
                <td style={ad.td}><span style={ad.badge("green")}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <div style={ad.sectionTitle}>QUICK ACTIONS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Create Event", desc: "Add a new SJS night", icon: "◉", page: "events" },
          { label: "Manage Tickets", desc: "Pricing & promo codes", icon: "✦", page: "tickets" },
          { label: "View Members", desc: "Member directory & tiers", icon: "♦", page: "members" },
        ].map((q, i) => (
          <div key={i} onClick={() => setPage(q.page)} style={{ ...ad.card, cursor: "pointer", transition: "border-color 0.15s" }}>
            <div style={{ fontSize: 24, color: "#e2b655", marginBottom: 8 }}>{q.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{q.label}</div>
            <div style={{ fontSize: 13, color: "#9e8e78" }}>{q.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── admin: events CRUD ──────────────────────────────────── */
function AdminEvents({ events, setEvents }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const empty = { title: "", venue: "", date: "", time: "9:00 PM", price: 25, capacity: 700, sold: 0, status: "Active", image: "" };
  const [form, setForm] = useState(empty);

  const openNew = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (e) => { setForm({ ...e }); setEditing(e.id); setShowForm(true); };
  const save = () => {
    if (!form.title || !form.venue || !form.date) return;
    if (editing) {
      setEvents(prev => prev.map(e => e.id === editing ? { ...form, id: editing, price: Number(form.price), capacity: Number(form.capacity), sold: Number(form.sold) } : e));
    } else {
      setEvents(prev => [...prev, { ...form, id: Date.now(), price: Number(form.price), capacity: Number(form.capacity), sold: Number(form.sold) }]);
    }
    setShowForm(false);
  };
  const remove = (id) => setEvents(prev => prev.filter(e => e.id !== id));
  const toggleStatus = (id) => setEvents(prev => prev.map(e => e.id === id ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" } : e));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "#9e8e78" }}>{events.length} events total</div>
        <button onClick={openNew} style={ad.btnPrimary}>+ Add Event</button>
      </div>

      <div style={{ ...ad.card, padding: 0, overflow: "hidden" }}>
        <table style={ad.table}>
          <thead>
            <tr>
              <th style={ad.th}>Event</th>
              <th style={ad.th}>Date</th>
              <th style={ad.th}>Venue</th>
              <th style={ad.th}>Price</th>
              <th style={ad.th}>Sold / Cap</th>
              <th style={ad.th}>Status</th>
              <th style={{ ...ad.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td style={{ ...ad.td, fontWeight: 600 }}>{e.title}</td>
                <td style={ad.td}>{e.date}</td>
                <td style={{ ...ad.td, color: "#9e8e78" }}>{e.venue}</td>
                <td style={{ ...ad.td, color: "#e2b655", fontWeight: 600 }}>${e.price}</td>
                <td style={ad.td}>
                  <div>{e.sold} / {e.capacity}</div>
                  <div style={{ height: 3, background: "#332820", borderRadius: 2, marginTop: 4, width: 80 }}>
                    <div style={{ height: "100%", background: "#e2b655", borderRadius: 2, width: `${(e.sold / e.capacity) * 100}%` }} />
                  </div>
                </td>
                <td style={ad.td}>
                  <span onClick={() => toggleStatus(e.id)} style={{ ...ad.badge(e.status === "Active" ? "green" : "grey"), cursor: "pointer" }}>{e.status}</span>
                </td>
                <td style={{ ...ad.td, textAlign: "right" }}>
                  <button onClick={() => openEdit(e)} style={ad.btnIcon} title="Edit">✎</button>
                  <button onClick={() => remove(e.id)} style={{ ...ad.btnIcon, color: "#e04040" }} title="Delete">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={ad.overlay} onClick={() => setShowForm(false)}>
          <div style={ad.dialog} onClick={e => e.stopPropagation()}>
            <div style={ad.dialogHeader}>
              <div style={ad.dialogTitle}>{editing ? "Edit Event" : "New Event"}</div>
              <button onClick={() => setShowForm(false)} style={ad.btnIcon}>✕</button>
            </div>
            <div style={ad.formGroup}>
              <label style={ad.formLabel}>EVENT TITLE</label>
              <input style={ad.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. SJS: Summer Vibes" />
            </div>
            <div style={ad.formRow}>
              <div>
                <label style={ad.formLabel}>VENUE</label>
                <input style={ad.input} value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="e.g. Twelve West" />
              </div>
              <div>
                <label style={ad.formLabel}>DATE</label>
                <input style={ad.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div style={ad.formRow}>
              <div>
                <label style={ad.formLabel}>DOORS TIME</label>
                <input style={ad.input} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="9:00 PM" />
              </div>
              <div>
                <label style={ad.formLabel}>TICKET PRICE ($)</label>
                <input style={ad.input} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div style={ad.formRow}>
              <div>
                <label style={ad.formLabel}>CAPACITY</label>
                <input style={ad.input} type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
              </div>
              <div>
                <label style={ad.formLabel}>TICKETS SOLD</label>
                <input style={ad.input} type="number" value={form.sold} onChange={e => setForm({ ...form, sold: e.target.value })} />
              </div>
            </div>
            <div style={ad.formGroup}>
              <label style={ad.formLabel}>IMAGE PATH</label>
              <input style={ad.input} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="/images/event.jpg" />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setShowForm(false)} style={ad.btnSecondary}>Cancel</button>
              <button onClick={save} style={ad.btnPrimary}>{editing ? "Save Changes" : "Create Event"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── admin: tickets & promos CRUD ────────────────────────── */
function AdminTickets({ tickets, setTickets, promos, setPromos }) {
  const [tab, setTab] = useState("tickets");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formType, setFormType] = useState("ticket");

  const emptyTicket = { name: "", desc: "", basePrice: 25, discount: 0, availability: "Everyone", status: "Active" };
  const emptyPromo = { code: "", desc: "", discountType: "%", discountVal: 10, uses: 0, maxUses: 100, status: "Active" };
  const [form, setForm] = useState(emptyTicket);

  const openNewTicket = () => { setForm(emptyTicket); setEditing(null); setFormType("ticket"); setShowForm(true); };
  const openNewPromo = () => { setForm(emptyPromo); setEditing(null); setFormType("promo"); setShowForm(true); };
  const openEditTicket = (t) => { setForm({ ...t }); setEditing(t.id); setFormType("ticket"); setShowForm(true); };
  const openEditPromo = (p) => { setForm({ ...p }); setEditing(p.id); setFormType("promo"); setShowForm(true); };

  const save = () => {
    if (formType === "ticket") {
      if (!form.name) return;
      if (editing) {
        setTickets(prev => prev.map(t => t.id === editing ? { ...form, id: editing, basePrice: Number(form.basePrice), discount: Number(form.discount) } : t));
      } else {
        setTickets(prev => [...prev, { ...form, id: Date.now(), basePrice: Number(form.basePrice), discount: Number(form.discount) }]);
      }
    } else {
      if (!form.code) return;
      if (editing) {
        setPromos(prev => prev.map(p => p.id === editing ? { ...form, id: editing, discountVal: Number(form.discountVal), uses: Number(form.uses), maxUses: Number(form.maxUses) } : p));
      } else {
        setPromos(prev => [...prev, { ...form, id: Date.now(), discountVal: Number(form.discountVal), uses: Number(form.uses), maxUses: Number(form.maxUses) }]);
      }
    }
    setShowForm(false);
  };

  const removeTicket = (id) => setTickets(prev => prev.filter(t => t.id !== id));
  const removePromo = (id) => setPromos(prev => prev.filter(p => p.id !== id));

  const tabStyle = (active) => ({
    padding: "10px 20px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontFamily: "inherit",
    background: active ? "#e2b655" : "transparent", color: active ? "#0c0907" : "#9e8e78", transition: "all 0.15s"
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setTab("tickets")} style={tabStyle(tab === "tickets")}>✦ Ticket Types</button>
        <button onClick={() => setTab("promos")} style={tabStyle(tab === "promos")}>◈ Promo Codes</button>
      </div>

      {tab === "tickets" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: "#9e8e78" }}>{tickets.length} ticket types</div>
            <button onClick={openNewTicket} style={ad.btnPrimary}>+ Add Ticket Type</button>
          </div>
          <div style={{ ...ad.card, padding: 0, overflow: "hidden" }}>
            <table style={ad.table}>
              <thead>
                <tr>
                  <th style={ad.th}>Type</th>
                  <th style={ad.th}>Base Price</th>
                  <th style={ad.th}>Discount</th>
                  <th style={ad.th}>Final Price</th>
                  <th style={ad.th}>Availability</th>
                  <th style={ad.th}>Status</th>
                  <th style={{ ...ad.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => {
                  const finalPrice = t.basePrice * (1 - t.discount / 100);
                  return (
                    <tr key={t.id}>
                      <td style={ad.td}>
                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                        <div style={{ fontSize: 13, color: "#9e8e78", marginTop: 2 }}>{t.desc}</div>
                      </td>
                      <td style={ad.td}>${t.basePrice}</td>
                      <td style={{ ...ad.td, color: t.discount > 0 ? "#50c878" : "#9e8e78" }}>{t.discount > 0 ? `${t.discount}% off` : "—"}</td>
                      <td style={{ ...ad.td, fontWeight: 700 }}>${finalPrice % 1 === 0 ? finalPrice : finalPrice.toFixed(2)}</td>
                      <td style={ad.td}><span style={ad.badge(t.availability === "Members Only" ? "gold" : "green")}>{t.availability}</span></td>
                      <td style={ad.td}><span style={ad.badge(t.status === "Active" ? "green" : "grey")}>{t.status}</span></td>
                      <td style={{ ...ad.td, textAlign: "right" }}>
                        <button onClick={() => openEditTicket(t)} style={ad.btnIcon} title="Edit">✎</button>
                        <button onClick={() => removeTicket(t.id)} style={{ ...ad.btnIcon, color: "#e04040" }} title="Delete">✕</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "promos" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: "#9e8e78" }}>{promos.length} promo codes</div>
            <button onClick={openNewPromo} style={ad.btnPrimary}>+ Add Promo Code</button>
          </div>
          <div style={{ ...ad.card, padding: 0, overflow: "hidden" }}>
            <table style={ad.table}>
              <thead>
                <tr>
                  <th style={ad.th}>Code</th>
                  <th style={ad.th}>Description</th>
                  <th style={ad.th}>Discount</th>
                  <th style={ad.th}>Uses</th>
                  <th style={ad.th}>Status</th>
                  <th style={{ ...ad.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promos.map(p => (
                  <tr key={p.id}>
                    <td style={{ ...ad.td, fontWeight: 700, letterSpacing: 1, color: "#e2b655" }}>{p.code}</td>
                    <td style={{ ...ad.td, color: "#9e8e78" }}>{p.desc}</td>
                    <td style={{ ...ad.td, color: "#50c878", fontWeight: 600 }}>{p.discountType === "%" ? `${p.discountVal}% off` : `$${p.discountVal} off`}</td>
                    <td style={ad.td}>
                      <div>{p.uses} / {p.maxUses}</div>
                      <div style={{ height: 3, background: "#332820", borderRadius: 2, marginTop: 4, width: 60 }}>
                        <div style={{ height: "100%", background: "#e2b655", borderRadius: 2, width: `${(p.uses / p.maxUses) * 100}%` }} />
                      </div>
                    </td>
                    <td style={ad.td}><span style={ad.badge(p.status === "Active" ? "green" : "grey")}>{p.status}</span></td>
                    <td style={{ ...ad.td, textAlign: "right" }}>
                      <button onClick={() => openEditPromo(p)} style={ad.btnIcon} title="Edit">✎</button>
                      <button onClick={() => removePromo(p.id)} style={{ ...ad.btnIcon, color: "#e04040" }} title="Delete">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <div style={ad.overlay} onClick={() => setShowForm(false)}>
          <div style={ad.dialog} onClick={e => e.stopPropagation()}>
            <div style={ad.dialogHeader}>
              <div style={ad.dialogTitle}>{editing ? "Edit" : "New"} {formType === "ticket" ? "Ticket Type" : "Promo Code"}</div>
              <button onClick={() => setShowForm(false)} style={ad.btnIcon}>✕</button>
            </div>
            {formType === "ticket" ? (
              <>
                <div style={ad.formGroup}>
                  <label style={ad.formLabel}>NAME</label>
                  <input style={ad.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Early Bird" />
                </div>
                <div style={ad.formGroup}>
                  <label style={ad.formLabel}>DESCRIPTION</label>
                  <input style={ad.input} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Short description" />
                </div>
                <div style={ad.formRow}>
                  <div>
                    <label style={ad.formLabel}>BASE PRICE ($)</label>
                    <input style={ad.input} type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} />
                  </div>
                  <div>
                    <label style={ad.formLabel}>DISCOUNT (%)</label>
                    <input style={ad.input} type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
                  </div>
                </div>
                <div style={ad.formRow}>
                  <div>
                    <label style={ad.formLabel}>AVAILABILITY</label>
                    <select style={ad.select} value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}>
                      <option value="Everyone">Everyone</option>
                      <option value="Members Only">Members Only</option>
                    </select>
                  </div>
                  <div>
                    <label style={ad.formLabel}>STATUS</label>
                    <select style={ad.select} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={ad.formRow}>
                  <div>
                    <label style={ad.formLabel}>PROMO CODE</label>
                    <input style={{ ...ad.input, textTransform: "uppercase", letterSpacing: 2 }} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER26" />
                  </div>
                  <div>
                    <label style={ad.formLabel}>DESCRIPTION</label>
                    <input style={ad.input} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="What's it for?" />
                  </div>
                </div>
                <div style={ad.formRow}>
                  <div>
                    <label style={ad.formLabel}>DISCOUNT TYPE</label>
                    <select style={ad.select} value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
                      <option value="%">Percentage (%)</option>
                      <option value="$">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label style={ad.formLabel}>DISCOUNT VALUE</label>
                    <input style={ad.input} type="number" value={form.discountVal} onChange={e => setForm({ ...form, discountVal: e.target.value })} />
                  </div>
                </div>
                <div style={ad.formRow}>
                  <div>
                    <label style={ad.formLabel}>MAX USES</label>
                    <input style={ad.input} type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} />
                  </div>
                  <div>
                    <label style={ad.formLabel}>STATUS</label>
                    <select style={ad.select} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setShowForm(false)} style={ad.btnSecondary}>Cancel</button>
              <button onClick={save} style={ad.btnPrimary}>{editing ? "Save Changes" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── admin: members CRUD ─────────────────────────────────── */
function AdminMembers({ members, setMembers }) {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyMember = { name: "", email: "", tier: "Bronze", stamps: 0, joined: new Date().toISOString().split("T")[0], events: 0, status: "Active" };
  const [form, setForm] = useState(emptyMember);

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === "All" || m.tier === filterTier;
    return matchSearch && matchTier;
  });

  const openNew = () => { setForm(emptyMember); setEditing(null); setShowForm(true); };
  const openEdit = (m) => { setForm({ ...m }); setEditing(m.id); setShowForm(true); };
  const save = () => {
    if (!form.name || !form.email) return;
    if (editing) {
      setMembers(prev => prev.map(m => m.id === editing ? { ...form, id: editing, stamps: Number(form.stamps), events: Number(form.events) } : m));
    } else {
      setMembers(prev => [...prev, { ...form, id: Date.now(), stamps: Number(form.stamps), events: Number(form.events) }]);
    }
    setShowForm(false);
  };
  const remove = (id) => setMembers(prev => prev.filter(m => m.id !== id));

  const tierCounts = { Gold: members.filter(m => m.tier === "Gold").length, Silver: members.filter(m => m.tier === "Silver").length, Bronze: members.filter(m => m.tier === "Bronze").length };

  return (
    <div>
      {/* Tier summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { tier: "Gold", count: tierCounts.Gold, color: "#e2b655" },
          { tier: "Silver", count: tierCounts.Silver, color: "#c0b8a8" },
          { tier: "Bronze", count: tierCounts.Bronze, color: "#9e8e78" },
        ].map(t => (
          <div key={t.tier} style={{ ...ad.card, textAlign: "center", cursor: "pointer", borderColor: filterTier === t.tier ? t.color : "#332820" }} onClick={() => setFilterTier(filterTier === t.tier ? "All" : t.tier)}>
            <div style={{ fontSize: 28, fontWeight: 700, color: t.color }}>{t.count}</div>
            <div style={{ fontSize: 13, color: "#9e8e78", letterSpacing: 1 }}>{t.tier} Members</div>
          </div>
        ))}
      </div>

      {/* Search & add */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input style={{ ...ad.input, flex: 1 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members by name or email..." />
        <button onClick={openNew} style={ad.btnPrimary}>+ Add Member</button>
      </div>

      <div style={{ ...ad.card, padding: 0, overflow: "hidden" }}>
        <table style={ad.table}>
          <thead>
            <tr>
              <th style={ad.th}>Member</th>
              <th style={ad.th}>Tier</th>
              <th style={ad.th}>Stamps</th>
              <th style={ad.th}>Events</th>
              <th style={ad.th}>Joined</th>
              <th style={ad.th}>Status</th>
              <th style={{ ...ad.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <td style={ad.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #b8922e, #e2b655)", color: "#0c0907", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{m.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 13, color: "#9e8e78" }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td style={ad.td}><span style={ad.badge(m.tier === "Gold" ? "gold" : m.tier === "Silver" ? "grey" : "grey")}>{m.tier}</span></td>
                <td style={ad.td}>
                  <span style={{ color: "#e2b655", fontWeight: 600 }}>{m.stamps}</span>
                  <span style={{ color: "#9e8e78" }}> / 10</span>
                </td>
                <td style={ad.td}>{m.events}</td>
                <td style={{ ...ad.td, color: "#9e8e78" }}>{m.joined}</td>
                <td style={ad.td}><span style={ad.badge(m.status === "Active" ? "green" : "red")}>{m.status}</span></td>
                <td style={{ ...ad.td, textAlign: "right" }}>
                  <button onClick={() => openEdit(m)} style={ad.btnIcon} title="Edit">✎</button>
                  <button onClick={() => remove(m.id)} style={{ ...ad.btnIcon, color: "#e04040" }} title="Delete">✕</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ ...ad.td, textAlign: "center", color: "#9e8e78", padding: 32 }}>No members found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={ad.overlay} onClick={() => setShowForm(false)}>
          <div style={ad.dialog} onClick={e => e.stopPropagation()}>
            <div style={ad.dialogHeader}>
              <div style={ad.dialogTitle}>{editing ? "Edit Member" : "Add Member"}</div>
              <button onClick={() => setShowForm(false)} style={ad.btnIcon}>✕</button>
            </div>
            <div style={ad.formRow}>
              <div>
                <label style={ad.formLabel}>NAME</label>
                <input style={ad.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
              </div>
              <div>
                <label style={ad.formLabel}>EMAIL</label>
                <input style={ad.input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
            </div>
            <div style={ad.formRow}>
              <div>
                <label style={ad.formLabel}>TIER</label>
                <select style={ad.select} value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
              <div>
                <label style={ad.formLabel}>STAMPS</label>
                <input style={ad.input} type="number" value={form.stamps} onChange={e => setForm({ ...form, stamps: e.target.value })} min="0" max="10" />
              </div>
            </div>
            <div style={ad.formRow}>
              <div>
                <label style={ad.formLabel}>EVENTS ATTENDED</label>
                <input style={ad.input} type="number" value={form.events} onChange={e => setForm({ ...form, events: e.target.value })} />
              </div>
              <div>
                <label style={ad.formLabel}>STATUS</label>
                <select style={ad.select} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setShowForm(false)} style={ad.btnSecondary}>Cancel</button>
              <button onClick={save} style={ad.btnPrimary}>{editing ? "Save Changes" : "Add Member"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── colors & styles ─────────────────────────────────────── */
const gold = "#e2b655";
const goldDim = "#b8922e";
const bg = "#0c0907";
const surface = "#161210";
const surface2 = "#211a14";
const border = "#332820";
const text = "#f4efe4";
const textDim = "#9e8e78";

const styles = {
  root: { background: bg, height: "100%", width: "100%", fontFamily: "'Georgia', serif", color: text, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 12px", borderBottom: `1px solid ${border}`, background: bg, position: "sticky", top: 0, zIndex: 10 },
  logoBlock: { display: "flex", flexDirection: "column" },
  logoImg: { height: 32, width: "auto", filter: "brightness(0) invert(1)" },
  headerActions: { display: "flex", alignItems: "center", gap: 4 },
  headerBtn: { background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "background 0.15s ease" },
  notifBadge: { position: "absolute", top: 2, right: 2, background: "#e04040", color: "#fff", fontSize: 11, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  memberBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: gold, letterSpacing: 1, background: "rgba(226,182,85,0.1)", border: `1px solid rgba(226,182,85,0.25)`, borderRadius: 20, padding: "5px 12px" },
  memberDot: { width: 6, height: 6, background: gold, borderRadius: "50%", display: "inline-block" },
  content: { flex: 1, overflowY: "auto", padding: "0 16px", paddingBottom: 90 },
  nav: { position: "absolute", bottom: 0, left: 0, right: 0, background: surface, borderTop: `1px solid ${border}`, display: "flex", zIndex: 20, paddingBottom: "env(safe-area-inset-bottom, 0px)" },
  navBtn: { flex: 1, background: "none", border: "none", color: "#ffffff", padding: "10px 0 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "color 0.2s" },
  navBtnActive: { color: gold },
  navLabel: { fontSize: 13, letterSpacing: 1.5 },

  heroCard: { background: `linear-gradient(145deg, ${surface2} 0%, #1e150e 50%, #261c12 100%)`, border: `1px solid ${border}`, borderRadius: 16, padding: 24, marginTop: 20, position: "relative", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  heroImageWrap: { position: "absolute", inset: 0, zIndex: 0 },
  heroImage: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" },
  heroImageOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,6,0.45) 0%, rgba(10,8,6,0.82) 55%, rgba(10,8,6,0.96) 100%)" },
  heroEyebrow: { fontSize: 14, letterSpacing: 4, color: gold, marginBottom: 8, position: "relative", zIndex: 1 },
  heroTitle: { fontSize: 24, fontWeight: 700, lineHeight: 1.2, marginBottom: 6, color: text, position: "relative", zIndex: 1 },
  heroMeta: { fontSize: 15, color: "#c0b8a8", marginBottom: 4, position: "relative", zIndex: 1 },
  heroTime: { fontSize: 15, color: "#c0b8a8", marginBottom: 16, position: "relative", zIndex: 1 },
  heroBar: { marginBottom: 20, position: "relative", zIndex: 1 },
  heroBadgeSell: { fontSize: 14, letterSpacing: 2, color: "#f08060", marginBottom: 6 },
  sellBar: { height: 5, background: "rgba(42,32,24,0.7)", borderRadius: 3, marginBottom: 4 },
  sellLabel: { fontSize: 14, color: textDim, letterSpacing: 1 },
  heroActions: { display: "flex", gap: 10, position: "relative", zIndex: 1 },

  btnGold: { background: `linear-gradient(135deg, ${goldDim} 0%, ${gold} 50%, #f0cc6a 100%)`, color: "#0c0907", border: "none", borderRadius: 8, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, fontFamily: "inherit", transition: "transform 0.1s ease, opacity 0.1s ease", boxShadow: "0 2px 12px rgba(226,182,85,0.25)" },
  btnGoldSm: { background: `linear-gradient(135deg, ${goldDim} 0%, ${gold} 50%, #f0cc6a 100%)`, color: "#0c0907", border: "none", borderRadius: 6, padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, fontFamily: "inherit", whiteSpace: "nowrap", transition: "transform 0.1s ease", boxShadow: "0 2px 8px rgba(226,182,85,0.2)" },
  btnOutline: { background: "transparent", color: gold, border: `1px solid rgba(226,182,85,0.45)`, borderRadius: 8, padding: "14px 20px", fontSize: 15, cursor: "pointer", letterSpacing: 0.5, fontFamily: "inherit", transition: "transform 0.1s ease, background 0.15s ease" },
  btnShare: { background: "transparent", color: textDim, border: `1px solid ${border}`, borderRadius: 8, padding: "14px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.15s ease" },

  sectionLabel: { fontSize: 14, letterSpacing: 4, color: textDim, marginTop: 28, marginBottom: 12 },
  pageTitle: { fontSize: 14, letterSpacing: 5, color: textDim, marginTop: 24, marginBottom: 20, textAlign: "center" },

  loyaltySnap: { background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "border-color 0.2s" },
  snapLeft: { display: "flex", alignItems: "baseline", gap: 3 },
  snapCount: { fontSize: 36, fontWeight: 700, color: gold, lineHeight: 1 },
  snapOf: { fontSize: 14, color: textDim },
  stampRow: { display: "flex", gap: 4, flex: 1, flexWrap: "wrap" },
  snapDot: { width: 8, height: 8, borderRadius: "50%", border: `1px solid ${border}`, background: surface2, transition: "background 0.2s" },
  snapDotFilled: { background: gold, border: `1px solid ${gold}` },
  snapCTA: { fontSize: 14, color: gold, whiteSpace: "nowrap" },

  entryCard: { background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "border-color 0.2s" },
  entryLeft: { display: "flex", alignItems: "center", gap: 14 },
  entryQRMini: { width: 44, height: 44, borderRadius: 8, background: `rgba(226,182,85,0.1)`, border: `1px solid rgba(226,182,85,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  entryTitle: { fontSize: 16, fontWeight: 700, color: text, marginBottom: 2 },
  entrySub: { fontSize: 14, color: textDim },
  entryArrow: { fontSize: 20, color: gold, fontWeight: 700 },

  entryModalEvent: { background: `rgba(226,182,85,0.08)`, border: `1px solid rgba(226,182,85,0.18)`, borderRadius: 10, padding: 14, marginBottom: 16, textAlign: "center" },
  entryModalTitle: { fontSize: 16, fontWeight: 700, color: text, marginBottom: 3 },
  entryModalMeta: { fontSize: 14, color: textDim },
  entrySteps: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 },
  entryStepRow: { display: "flex", alignItems: "center", gap: 12 },
  entryStepIcon: { flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: `rgba(226,182,85,0.08)`, display: "flex", alignItems: "center", justifyContent: "center" },
  entryStepText: { fontSize: 14, color: text, lineHeight: 1.4 },

  aboutHero: { borderRadius: 16, padding: "60px 24px 28px", textAlign: "center", position: "relative", overflow: "hidden", marginBottom: 8, border: `1px solid ${border}` },
  aboutImageWrap: { position: "absolute", inset: 0, zIndex: 0 },
  aboutImage: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" },
  aboutImageOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(12,9,7,0.4) 0%, rgba(12,9,7,0.85) 70%, rgba(12,9,7,0.98) 100%)" },
  aboutTagline: { fontSize: 22, fontWeight: 700, color: gold, fontStyle: "italic", marginBottom: 2 },
  aboutTaglineSub: { fontSize: 18, color: "#c0b8a8", fontStyle: "italic" },
  aboutCard: { background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 12, padding: 18 },
  aboutText: { fontSize: 15, color: text, lineHeight: 1.7, marginBottom: 12 },

  awardsRow: { display: "flex", gap: 8 },
  awardCard: { flex: 1, background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 10px", textAlign: "center" },
  awardIcon: { fontSize: 18, color: gold, marginBottom: 6 },
  awardLabel: { fontSize: 13, fontWeight: 700, color: text, lineHeight: 1.3, marginBottom: 4 },
  awardYear: { fontSize: 12, color: textDim },

  crewRow: { display: "flex", gap: 14, padding: "16px 0", borderBottom: `1px solid ${border}` },
  crewAvatar: { width: 44, height: 44, borderRadius: 22, background: `linear-gradient(135deg, ${goldDim}, ${gold})`, color: "#0c0907", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  crewInfo: { flex: 1 },
  crewName: { fontSize: 16, fontWeight: 700, marginBottom: 1, color: text },
  crewRole: { fontSize: 14, color: gold, marginBottom: 4 },
  crewDesc: { fontSize: 14, color: textDim, lineHeight: 1.5 },

  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  statCard: { background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 10, padding: "16px 14px", textAlign: "center" },
  statNum: { fontSize: 24, fontWeight: 700, color: gold, marginBottom: 4 },
  statLabel: { fontSize: 13, color: textDim, letterSpacing: 1 },

  signatureLine: { fontSize: 18, fontWeight: 700, fontStyle: "italic", color: gold, textAlign: "center", marginTop: 28, marginBottom: 8 },

  socialRow: { display: "flex", flexDirection: "column", gap: 8 },
  socialLink: { display: "flex", justifyContent: "space-between", alignItems: "center", background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px", textDecoration: "none", transition: "border-color 0.2s" },
  socialName: { fontSize: 15, fontWeight: 600, color: text },
  socialHandle: { fontSize: 14, color: gold },

  footerText: { fontSize: 13, color: textDim, textAlign: "center", marginTop: 28, paddingBottom: 8 },

  notifCard: { background: "rgba(226,182,85,0.08)", border: `1px solid rgba(226,182,85,0.22)`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 16 },
  notifText: {},
  notifTitle: { fontSize: 16, fontWeight: 700, marginBottom: 3, color: text },
  notifSub: { fontSize: 14, color: textDim, lineHeight: 1.4 },

  eventStrip: { display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${border}`, cursor: "pointer" },
  stripDate: { textAlign: "center", minWidth: 40 },
  stripMon: { fontSize: 13, letterSpacing: 2, color: gold },
  stripNum: { fontSize: 24, fontWeight: 700, color: text, lineHeight: 1 },
  stripInfo: { flex: 1 },
  stripTitle: { fontSize: 15, fontWeight: 600, marginBottom: 2 },
  stripVenue: { fontSize: 14, color: textDim },
  stripPrice: { fontSize: 16, color: gold, fontWeight: 700 },

  eventCard: { background: `linear-gradient(180deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 12, marginBottom: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.3)" },
  ecImageWrap: { position: "relative", width: "100%", height: 150 },
  ecImage: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" },
  ecImageOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(18,15,10,1) 100%)" },
  eventCardTop: { display: "flex", gap: 16, marginBottom: 14, padding: "0 18px", marginTop: -24, position: "relative", zIndex: 1 },
  ecDate: { textAlign: "center", minWidth: 44 },
  ecMon: { fontSize: 13, letterSpacing: 2, color: gold },
  ecNum: { fontSize: 30, fontWeight: 700, color: text, lineHeight: 1 },
  ecInfo: { flex: 1 },
  ecTitle: { fontSize: 17, fontWeight: 700, marginBottom: 3 },
  ecVenue: { fontSize: 14, color: textDim, marginBottom: 2 },
  ecTime: { fontSize: 14, color: textDim, marginBottom: 8 },
  tagRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  tagAlert: { fontSize: 13, letterSpacing: 1, color: "#f08060", background: "rgba(240,128,96,0.12)", border: "1px solid rgba(240,128,96,0.3)", borderRadius: 4, padding: "3px 8px" },
  tagMember: { fontSize: 13, letterSpacing: 1, color: gold, background: "rgba(226,182,85,0.12)", border: "1px solid rgba(226,182,85,0.3)", borderRadius: 4, padding: "3px 8px" },
  ecSellRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "0 18px" },
  ecActions: { display: "flex", gap: 8, padding: "0 18px 18px" },

  loyaltyCard: { background: `linear-gradient(145deg, #1c1408 0%, #28200f 50%, #2e2214 100%)`, border: `1px solid rgba(226,182,85,0.3)`, borderRadius: 16, padding: 24, position: "relative", overflow: "hidden", marginBottom: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(226,182,85,0.08)" },
  lcGlow: { position: "absolute", top: -60, right: -60, width: 280, height: 280, background: "radial-gradient(circle, rgba(226,182,85,0.15) 0%, transparent 65%)", pointerEvents: "none" },
  lcHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  lcName: { fontSize: 20, fontWeight: 700, letterSpacing: 4, color: gold },
  lcTier: { fontSize: 14, letterSpacing: 2, color: gold, background: "rgba(226,182,85,0.18)", borderRadius: 4, padding: "4px 10px" },
  lcStampGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 20 },
  lcStamp: { aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${border}`, borderRadius: 8, fontSize: 15, color: textDim, background: surface2, minWidth: 44, transition: "all 0.3s ease" },
  lcStampFilled: { background: `linear-gradient(135deg, ${goldDim}, ${gold}, #f0cc6a)`, color: "#0c0907", border: `1px solid ${gold}`, fontWeight: 700, boxShadow: "0 2px 8px rgba(226,182,85,0.3)" },
  lcProgress: {},
  lcBar: { height: 5, background: border, borderRadius: 3, marginBottom: 8 },
  lcProgressLabel: { fontSize: 14, color: textDim, letterSpacing: 0.5 },

  howItWorks: { background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  howStep: { display: "flex", alignItems: "center", gap: 14 },
  howNum: { width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${goldDim}, ${gold})`, color: "#0c0907", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  howText: { fontSize: 15, color: text, lineHeight: 1.4 },

  perkRow: { display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: `1px solid ${border}` },
  perkIcon: { color: gold, fontSize: 20, minWidth: 24, textAlign: "center", marginTop: 2 },
  perkTitle: { fontSize: 16, fontWeight: 600, marginBottom: 2 },
  perkDesc: { fontSize: 14, color: textDim },

  qrBlock: { display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 20px" },
  qrFrame: { background: "#f4efe4", borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: "0 4px 24px rgba(226,182,85,0.15)" },
  qrMemberId: { fontSize: 18, fontWeight: 700, letterSpacing: 3, color: gold, marginBottom: 4 },
  qrTier: { fontSize: 14, color: textDim },
  qrInstructions: { display: "flex", gap: 12, alignItems: "flex-start", background: `rgba(226,182,85,0.08)`, border: `1px solid rgba(226,182,85,0.2)`, borderRadius: 10, padding: 14, marginTop: 8 },
  qrInstructIcon: { flexShrink: 0, marginTop: 1 },
  qrInstructText: { fontSize: 14, color: text, lineHeight: 1.5 },
  qrNote: { fontSize: 13, color: textDim, textAlign: "center", marginTop: 14, lineHeight: 1.5 },

  vipHero: { border: `1px solid rgba(226,182,85,0.25)`, borderRadius: 16, padding: 28, textAlign: "center", position: "relative", overflow: "hidden", marginBottom: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.3)" },
  vipImageWrap: { position: "absolute", inset: 0, zIndex: 0 },
  vipImage: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" },
  vipImageOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,6,0.6) 0%, rgba(10,8,6,0.9) 100%)" },
  vipHeroTitle: { fontSize: 26, fontWeight: 700, color: gold, marginBottom: 10 },
  vipHeroSub: { fontSize: 15, color: "#c0b8a8", lineHeight: 1.6 },

  vipShowRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${border}` },
  vipShowTitle: { fontSize: 16, fontWeight: 600, marginBottom: 3 },
  vipShowMeta: { fontSize: 14, color: textDim },

  packageRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 8 },
  packageLeft: {},
  packageName: { fontSize: 16, fontWeight: 600, marginBottom: 3 },
  packageMeta: { fontSize: 14, color: textDim },
  packagePrice: { fontSize: 20, fontWeight: 700, color: gold },

  modalOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  modal: { background: `linear-gradient(180deg, #1c1712 0%, ${surface} 100%)`, border: `1px solid ${border}`, borderRadius: "20px 20px 0 0", width: "100%", padding: 24, paddingBottom: "calc(40px + env(safe-area-inset-bottom, 0px))", maxHeight: "85%", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 13, letterSpacing: 4, color: textDim },
  modalClose: { background: "none", border: "none", color: textDim, fontSize: 20, cursor: "pointer", padding: 4 },
  modalShow: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  modalVenue: { fontSize: 14, color: textDim, marginBottom: 16 },
  modalSteps: { display: "flex", gap: 6, marginBottom: 20 },
  stepDot: { width: 32, height: 3, borderRadius: 2, background: border },
  stepDotActive: { background: gold },
  modalStep: { fontSize: 15, color: textDim, marginBottom: 14, letterSpacing: 1 },
  sizeOption: { border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 8, cursor: "pointer", fontSize: 16, color: text, transition: "all 0.15s", background: "none", width: "100%", textAlign: "left", fontFamily: "inherit", display: "block" },
  sizeSelected: { border: `1px solid ${gold}`, background: "rgba(226,182,85,0.1)", color: gold },
  input: { width: "100%", background: surface2, border: `1px solid ${border}`, borderRadius: 8, padding: "14px", color: text, fontSize: 16, marginBottom: 10, boxSizing: "border-box", fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" },
  inputError: { borderColor: "#e8745a" },
  fieldError: { fontSize: 13, color: "#e8745a", marginTop: -6, marginBottom: 10 },
  modalNote: { fontSize: 14, color: textDim, textAlign: "center", marginTop: 12 },
  confirmBlock: { textAlign: "center", padding: "20px 0" },
  confirmIcon: { fontSize: 44, color: gold, marginBottom: 16 },
  confirmTitle: { fontSize: 24, fontWeight: 700, marginBottom: 8 },
  confirmSub: { fontSize: 15, color: textDim, lineHeight: 1.6 },

  ticketRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${border}` },
  ticketType: { fontSize: 16 },
  ticketPrice: { fontSize: 18, fontWeight: 700, color: text },
  sellBar2: { height: 5, background: border, borderRadius: 3, margin: "14px 0 6px" },

  qtyRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${border}` },
  qtyLabel: { fontSize: 16, color: text },
  qtyControls: { display: "flex", alignItems: "center", gap: 16 },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, border: `1px solid ${border}`, background: surface2, color: gold, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", padding: 0, transition: "background 0.15s" },
  qtyNum: { fontSize: 20, fontWeight: 700, color: text, minWidth: 24, textAlign: "center" },
};

/* ── CSS animations & global ──────────────────────────────── */
const css = `
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes stampPop { 0% { transform: scale(1) } 40% { transform: scale(1.25) } 100% { transform: scale(1) } }
  @keyframes modalIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes sheetIn { from { transform: translateY(100%) } to { transform: translateY(0) } }
  @keyframes fillIn { from { width: 0% } }

  .fade-in { animation: fadeIn 0.4s ease forwards; }
  .slide-up { animation: slideUp 0.35s ease-out forwards; }
  .stamp-pop { animation: stampPop 0.4s ease; }
  .modal-overlay { animation: modalIn 0.2s ease forwards; }
  .modal-sheet { animation: sheetIn 0.3s ease-out forwards; }
  .sell-fill {
    height: 100%;
    background: linear-gradient(90deg, #b8922e, #e2b655, #f0cc6a);
    border-radius: 3px;
    transition: width 0.6s ease;
    animation: fillIn 0.8s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .fade-in, .slide-up, .stamp-pop, .modal-overlay, .modal-sheet { animation: none; opacity: 1; transform: none; }
    .sell-fill { animation: none; }
  }

  * { -webkit-tap-highlight-color: transparent; }
  input::placeholder { color: #6a5a45; }
  ::-webkit-scrollbar { width: 0; }

  button:focus-visible { outline: 2px solid #e2b655; outline-offset: 2px; }
  input:focus-visible { border-color: #e2b655 !important; }

  .btn-gold:active { transform: scale(0.97); }
  .btn-outline:active { transform: scale(0.97); background: rgba(226,182,85,0.08); }
  .btn-share:hover, .btn-share:active { color: #e2b655; border-color: rgba(226,182,85,0.4); }
  .btn-nav:active { transform: scale(0.95); }

  button:disabled { opacity: 0.4; cursor: default; }
  button:disabled:active { transform: none; }
`;
