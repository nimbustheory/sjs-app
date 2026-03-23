import SJSApp from './SJSApp.jsx'

const gold = "#e2b655";
const dim = "#9e8e78";
const surface = "#161210";
const border = "#332820";

const features = [
  { icon: "◉", title: "Event Listings", desc: "Browse upcoming SJS nights & buy tickets" },
  { icon: "✦", title: "Loyalty Card", desc: "Digital stamp card with QR check-in" },
  { icon: "♦", title: "VIP Table Reservations", desc: "Premium table booking with bottle service" },
  { icon: "◈", title: "Member Profiles", desc: "Tier status, preferences & ticket history" },
  { icon: "☆", title: "Push Notifications", desc: "Ticket drops, event reminders & alerts" },
  { icon: "◎", title: "Referral Program", desc: "Share links & earn bonus stamps" },
  { icon: "▣", title: "Smart Ticketing", desc: "QR-based fast entry & digital tickets" },
  { icon: "⊡", title: "Admin Dashboard", desc: "Full CRM, analytics & event management" },
];

const s = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 32px",
    height: "100dvh",
    position: "fixed",
    inset: 0,
  },
  left: {
    width: 280,
    flexShrink: 0,
  },
  center: {
    width: 420,
    flexShrink: 0,
    height: "calc(100dvh - 60px)",
    maxHeight: 860,
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 8px 60px rgba(0,0,0,0.6), -1px 0 0 rgba(255,255,255,0.4), 1px 0 0 rgba(255,255,255,0.4)",
  },
  right: {
    width: 300,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 4,
    color: gold,
    marginBottom: 12,
    fontFamily: "'Georgia', serif",
  },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    color: "#f4efe4",
    lineHeight: 1.15,
    marginBottom: 4,
    fontFamily: "'Georgia', serif",
  },
  subtitle: {
    fontSize: 16,
    color: dim,
    marginBottom: 28,
    fontFamily: "'Georgia', serif",
  },
  featureRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "10px 0",
  },
  featureIcon: {
    color: gold,
    fontSize: 15,
    width: 20,
    textAlign: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#f4efe4",
    marginBottom: 2,
    fontFamily: "'Georgia', serif",
  },
  featureDesc: {
    fontSize: 13,
    color: dim,
    lineHeight: 1.4,
    fontFamily: "'Georgia', serif",
  },
  credit: {
    fontSize: 11,
    letterSpacing: 4,
    color: "#4a3e32",
    marginTop: 32,
    fontFamily: "'Georgia', serif",
  },
  card: {
    background: surface,
    border: `1px solid ${border}`,
    borderRadius: 14,
    padding: 22,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "rgba(226,182,85,0.08)",
    border: "1px solid rgba(226,182,85,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    color: gold,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#f4efe4",
    marginBottom: 8,
    lineHeight: 1.3,
    fontFamily: "'Georgia', serif",
  },
  cardDesc: {
    fontSize: 14,
    color: dim,
    lineHeight: 1.6,
    fontFamily: "'Georgia', serif",
  },
};

export default function App() {
  return (
    <>
      <style>{`
        html, body, #root { overflow: hidden !important; height: 100dvh !important; }
        @media (max-width: 1100px) {
          .demo-left, .demo-right { display: none !important; }
          .demo-wrapper { padding: 0 !important; gap: 0 !important; }
          .demo-center { border-radius: 0 !important; box-shadow: none !important; height: 100dvh !important; max-height: none !important; }
        }
      `}</style>

      <div style={s.wrapper} className="demo-wrapper">
        {/* Left panel — features */}
        <div style={s.left} className="demo-left">
          <div style={s.eyebrow}>PROTOTYPE DEMO</div>
          <div style={s.heading}>SJS Connect</div>
          <div style={s.subtitle}>Event & Loyalty App</div>

          {features.map((f, i) => (
            <div key={i} style={s.featureRow}>
              <div style={s.featureIcon}>{f.icon}</div>
              <div>
                <div style={s.featureTitle}>{f.title}</div>
                <div style={s.featureDesc}>{f.desc}</div>
              </div>
            </div>
          ))}

          <div style={s.credit}>BUILT BY NIMBUS THEORY.</div>
        </div>

        {/* Center — phone mockup */}
        <div style={s.center} className="demo-center">
          <SJSApp />
        </div>

        {/* Right panel — info cards */}
        <div style={s.right} className="demo-right">
          <div style={s.card}>
            <div style={s.cardIcon}>◈</div>
            <div style={s.cardTitle}>Click the shield icon to toggle the admin dashboard</div>
            <div style={s.cardDesc}>Manage events, tickets & promos, member directory, and view real-time analytics — all from a full-screen admin panel.</div>
          </div>

          <div style={s.card}>
            <div style={s.cardIcon}>✦</div>
            <div style={s.cardTitle}>Fully Interactive Prototype</div>
            <div style={s.cardDesc}>Every button, modal, and form is functional. Browse events, buy tickets, check your loyalty card, reserve VIP tables, and manage your profile — all wired up and ready to demo.</div>
          </div>

        </div>
      </div>
    </>
  );
}
