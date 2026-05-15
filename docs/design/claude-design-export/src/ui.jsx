// Reusable building blocks: badges, modals, stat cards, tables, buttons.

const StatusBadge = ({ kind, type = "booking" }) => {
  const map = type === "payment" ? PAY_STATUS : STATUS;
  const s = map[kind] || { label: kind, cls: "badge-neutral" };
  return (
    <span className={`badge ${s.cls}`}>
      <span className="dot" />
      {s.label}
    </span>
  );
};

const Button = ({ variant = "primary", size, block, icon, children, ...rest }) => {
  const cls = [
    "btn",
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    variant === "ghost" && "btn-ghost",
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    block && "btn-block",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} {...rest}>
      {icon}
      {children}
    </button>
  );
};

const Field = ({ label, children, hint }) => (
  <div className="field">
    {label && <label>{label}</label>}
    {children}
    {hint && (
      <span style={{ fontSize: 12, color: "var(--muted)" }}>{hint}</span>
    )}
  </div>
);

const Input = ({ icon, ...rest }) => {
  if (!icon) return <input className="input" {...rest} />;
  return (
    <div className="input-with-icon">
      {icon}
      <input className="input" {...rest} />
    </div>
  );
};

const Modal = ({ open, onClose, title, sub, children, wide }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal ${wide ? "modal-wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row-between" style={{ marginBottom: 4 }}>
          <div>
            <h3 className="h2" style={{ fontSize: 20 }}>
              {title}
            </h3>
            {sub && (
              <div className="subtle" style={{ fontSize: 13, marginTop: 4 }}>
                {sub}
              </div>
            )}
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <IconX size={18} />
          </button>
        </div>
        <div style={{ marginTop: 16 }}>{children}</div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, delta, deltaDir, icon, sub }) => (
  <div className="stat">
    <div className="stat-label">
      {icon}
      <span>{label}</span>
    </div>
    <div className="stat-value">{value}</div>
    {(delta || sub) && (
      <div className={`stat-delta ${deltaDir || ""}`}>
        {deltaDir === "up" && <IconArrowUp size={12} />}
        {deltaDir === "down" && <IconArrowDown size={12} />}
        <span>{delta || sub}</span>
      </div>
    )}
  </div>
);

const SectionHeader = ({ title, sub, action }) => (
  <div className="row-between mb-16">
    <div>
      <h3 className="h3">{title}</h3>
      {sub && (
        <div className="subtle" style={{ fontSize: 13, marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
    {action}
  </div>
);

// SVG illustration for hero — car + bubbles + foam (vector, friendly, neutral)
const HeroIllustration = () => (
  <svg
    viewBox="0 0 600 600"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid slice"
    style={{ display: "block" }}
  >
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ececea" />
        <stop offset="1" stopColor="#cfcfca" />
      </linearGradient>
      <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a2a28" />
        <stop offset="1" stopColor="#0a0a0a" />
      </linearGradient>
      <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a4a48" />
        <stop offset="1" stopColor="#2a2a28" />
      </linearGradient>
      <radialGradient id="bubble" cx="0.35" cy="0.35">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.55" />
      </radialGradient>
      <radialGradient id="shadow" cx="0.5" cy="0.5">
        <stop offset="0" stopColor="#000" stopOpacity="0.18" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="600" height="600" fill="url(#bg)" />

    {/* horizon line */}
    <line x1="0" y1="430" x2="600" y2="430" stroke="#bcbcb6" strokeWidth="1" />

    {/* floor foam blobs */}
    <ellipse cx="120" cy="500" rx="180" ry="36" fill="#fff" opacity="0.55" />
    <ellipse cx="450" cy="520" rx="220" ry="42" fill="#fff" opacity="0.5" />
    <ellipse cx="300" cy="540" rx="280" ry="38" fill="#fff" opacity="0.45" />

    {/* car shadow */}
    <ellipse cx="300" cy="450" rx="220" ry="22" fill="url(#shadow)" />

    {/* car body */}
    <g>
      {/* lower body */}
      <path
        d="M110 420 C 130 380 175 360 230 358 L 380 358 C 440 360 470 380 490 420 L 490 440 C 490 448 482 452 472 452 L 128 452 C 118 452 110 448 110 440 Z"
        fill="url(#body)"
      />
      {/* cabin */}
      <path
        d="M180 358 C 195 320 230 300 270 300 L 360 300 C 395 300 420 320 430 358 Z"
        fill="url(#body)"
      />
      {/* windows */}
      <path
        d="M205 350 C 218 322 246 310 274 310 L 332 310 C 358 310 376 322 388 350 Z"
        fill="url(#window)"
        opacity="0.85"
      />
      {/* pillar */}
      <line x1="300" y1="312" x2="300" y2="348" stroke="#0a0a0a" strokeWidth="2" />
      {/* highlight */}
      <path
        d="M150 410 C 200 388 400 388 460 410"
        stroke="#5a5a58"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* wheels */}
      <circle cx="185" cy="450" r="34" fill="#0a0a0a" />
      <circle cx="185" cy="450" r="18" fill="#3a3a38" />
      <circle cx="185" cy="450" r="6" fill="#0a0a0a" />
      <circle cx="415" cy="450" r="34" fill="#0a0a0a" />
      <circle cx="415" cy="450" r="18" fill="#3a3a38" />
      <circle cx="415" cy="450" r="6" fill="#0a0a0a" />
      {/* headlight */}
      <ellipse cx="478" cy="395" rx="10" ry="6" fill="#f4f4f3" opacity="0.85" />
      <ellipse cx="122" cy="395" rx="10" ry="6" fill="#f4f4f3" opacity="0.6" />
      {/* door handles */}
      <rect x="240" y="385" width="22" height="3" rx="1.5" fill="#5a5a58" />
      <rect x="338" y="385" width="22" height="3" rx="1.5" fill="#5a5a58" />
    </g>

    {/* foam on roof */}
    <g opacity="0.95">
      <circle cx="220" cy="290" r="22" fill="#fff" />
      <circle cx="252" cy="278" r="18" fill="#fff" />
      <circle cx="285" cy="272" r="22" fill="#fff" />
      <circle cx="318" cy="276" r="16" fill="#fff" />
      <circle cx="348" cy="282" r="22" fill="#fff" />
      <circle cx="380" cy="290" r="16" fill="#fff" />
    </g>

    {/* bubbles */}
    <g>
      <circle cx="85" cy="180" r="28" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.7" />
      <circle cx="150" cy="120" r="18" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.6" />
      <circle cx="220" cy="170" r="14" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.7" />
      <circle cx="500" cy="140" r="34" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.7" />
      <circle cx="540" cy="220" r="16" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.6" />
      <circle cx="440" cy="90" r="12" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.7" />
      <circle cx="320" cy="80" r="20" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.65" />
      <circle cx="380" cy="200" r="10" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.7" />
      <circle cx="60" cy="350" r="14" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.6" />
      <circle cx="540" cy="370" r="22" fill="url(#bubble)" stroke="#fff" strokeOpacity="0.6" />
    </g>

    {/* water streaks */}
    <g stroke="#fff" strokeOpacity="0.6" strokeLinecap="round">
      <line x1="120" y1="200" x2="116" y2="240" strokeWidth="2" />
      <line x1="180" y1="180" x2="174" y2="220" strokeWidth="2" />
      <line x1="490" y1="200" x2="496" y2="240" strokeWidth="2" />
      <line x1="430" y1="170" x2="426" y2="210" strokeWidth="2" />
    </g>
  </svg>
);

// Image placeholder for service thumbs — abstract striped car silhouette
const ServiceThumb = ({ tone = 0 }) => {
  const tones = [
    ["#ececea", "#d8d8d4"],
    ["#dedeb8".replace("b8", "da"), "#c8c8c4"],
    ["#e2e2dd", "#cccac3"],
    ["#e6e4dd", "#cfccc1"],
  ];
  const t = tones[tone % tones.length];
  return (
    <svg viewBox="0 0 400 160" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`tg${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t[0]} />
          <stop offset="1" stopColor={t[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill={`url(#tg${tone})`} />
      {/* tiny car silhouette */}
      <g transform="translate(200 110)" fill="#0a0a0a" opacity="0.85">
        <path d="M-70 -2 C -60 -22 -38 -32 -10 -32 L 28 -32 C 56 -32 70 -22 78 -2 L 78 8 C 78 14 74 18 68 18 L -64 18 C -68 18 -72 14 -72 8 Z" />
        <circle cx="-42" cy="18" r="10" />
        <circle cx="52" cy="18" r="10" />
      </g>
      {/* bubbles */}
      <g fill="#fff" opacity="0.6">
        <circle cx="60" cy="40" r="9" />
        <circle cx="90" cy="22" r="5" />
        <circle cx="330" cy="36" r="11" />
        <circle cx="360" cy="64" r="6" />
      </g>
    </svg>
  );
};

Object.assign(window, {
  StatusBadge,
  Button,
  Field,
  Input,
  Modal,
  Stat,
  SectionHeader,
  HeroIllustration,
  ServiceThumb,
});
