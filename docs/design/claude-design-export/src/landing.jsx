// Public landing page + role-selector signup modal.

const Landing = ({ onLogin, onSignup, onPick }) => {
  return (
    <div className="public-wrap" data-screen-label="Public · Landing">
      <nav className="public-nav">
        <Brand />
        <div className="links">
          <a>Services</a>
          <a>Booking</a>
          <a>About</a>
          <a>Contact</a>
        </div>
        <div className="row gap-8">
          <Button variant="ghost" size="sm" onClick={onLogin}>
            Log in
          </Button>
          <Button size="sm" onClick={onSignup}>
            Sign up
          </Button>
        </div>
      </nav>

      <div className="hero-card">
        <div className="hero-left">
          <div className="stack" style={{ gap: 0 }}>
            <span className="hero-eyebrow">
              <span className="pulse" />
              Now booking · Open today until 8pm
            </span>
            <h1 className="hero-title">
              A spotless car,
              <br />
              <em>booked in 30 seconds.</em>
            </h1>
            <p className="hero-desc">
              CarWash Pro is the booking and operations platform behind 200+ neighborhood
              detailers. Reserve a wash, track every step, and pay without leaving your seat.
            </p>
            <div className="hero-cta mt-24">
              <Button size="lg" icon={<IconCalendar size={16} />} onClick={onSignup}>
                Book a wash
              </Button>
              <Button size="lg" variant="secondary" onClick={() => onPick("employee")}>
                For washers & shops
                <IconArrowR size={14} />
              </Button>
            </div>
          </div>

          <div className="hero-trust">
            <div className="avatars">
              <div className="avatar" style={{ background: "#3a3a38" }}>MR</div>
              <div className="avatar" style={{ background: "#4a4a48" }}>PS</div>
              <div className="avatar" style={{ background: "#2a2a28" }}>JO</div>
              <div className="avatar" style={{ background: "#5a5a58" }}>+</div>
            </div>
            <div>
              <div style={{ color: "var(--ink)", fontWeight: 500 }}>
                12,400+ washes booked this month
              </div>
              <div>Across 187 partner shops · Avg rating 4.9 / 5</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <HeroIllustration />
          <QuickBookingPreview onPick={() => onPick("customer")} />
        </div>
      </div>

      <footer className="public-footer">
        <div>© 2026 CarWash Pro · Built for shop owners and detailers</div>
        <div className="row gap-16">
          <a>Privacy</a>
          <a>Terms</a>
          <a>Status</a>
        </div>
      </footer>
    </div>
  );
};

const QuickBookingPreview = ({ onPick }) => {
  const [svc, setSvc] = React.useState("prm");
  const [time, setTime] = React.useState("11:30");
  const slots = ["09:00", "10:30", "11:30", "13:00", "14:30"];
  const svcObj = SERVICES.find((s) => s.id === svc);
  return (
    <div className="quick-booking">
      <div className="row-between mb-16">
        <div>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Quick booking
          </div>
          <div style={{ fontWeight: 600, marginTop: 2 }}>Tomorrow · May 18</div>
        </div>
        <span className="badge badge-confirmed">
          <span className="dot" />2 slots left
        </span>
      </div>

      <div className="stack gap-8 mb-16">
        <label className="label">Service</label>
        <select
          className="select"
          value={svc}
          onChange={(e) => setSvc(e.target.value)}
        >
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — ${s.price} · {s.duration}m
            </option>
          ))}
        </select>
      </div>

      <div className="stack gap-8 mb-16">
        <label className="label">Time</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
          {slots.map((s, i) => (
            <button
              key={s}
              className={`slot ${time === s ? "selected" : ""} ${i === 1 ? "disabled" : ""}`}
              onClick={() => i !== 1 && setTime(s)}
              style={{ padding: "8px 4px", fontSize: 12 }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="row-between mb-16" style={{ fontSize: 13 }}>
        <span className="subtle">Total</span>
        <span style={{ fontWeight: 600, fontSize: 16 }}>${svcObj.price}.00</span>
      </div>

      <Button block size="sm" onClick={onPick}>
        Continue
        <IconArrowR size={14} />
      </Button>
    </div>
  );
};

const RoleModal = ({ open, onClose, onPick }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Create your account"
    sub="Tell us a bit about how you'll use CarWash Pro."
  >
    <div className="role-cards">
      <button className="role-card" onClick={() => onPick("customer")}>
        <div className="icon-wrap">
          <IconCar size={20} />
        </div>
        <h4>I am a client</h4>
        <p>Book washes, manage vehicles, track payments and receipts.</p>
        <span className="row gap-4" style={{ fontSize: 12, marginTop: 6 }}>
          Continue as client <IconArrowR size={12} />
        </span>
      </button>
      <button className="role-card" onClick={() => onPick("employee")}>
        <div className="icon-wrap">
          <IconWrench size={20} />
        </div>
        <h4>I am a car washer</h4>
        <p>Get assigned jobs, update statuses, and log completed work.</p>
        <span className="row gap-4" style={{ fontSize: 12, marginTop: 6 }}>
          Continue as washer <IconArrowR size={12} />
        </span>
      </button>
    </div>
    <div className="auth-foot mt-16">
      Looking for the admin tools?{" "}
      <a onClick={() => onPick("admin")}>Open the demo workspace</a>
    </div>
  </Modal>
);

Object.assign(window, { Landing, RoleModal });
