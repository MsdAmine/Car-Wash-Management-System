// App shell — sidebar, topbar, used by all authenticated views.

const NAV_BY_ROLE = {
  customer: [
    { id: "dashboard", label: "Dashboard", icon: <IconHome size={17} /> },
    { id: "book", label: "Book a Wash", icon: <IconPlus size={17} /> },
    { id: "bookings", label: "My Bookings", icon: <IconCalendar size={17} />, badge: "2" },
    { id: "vehicles", label: "My Vehicles", icon: <IconCar size={17} /> },
    { id: "services", label: "Services", icon: <IconSparkles size={17} /> },
    { id: "payments", label: "Payments", icon: <IconWallet size={17} /> },
  ],
  employee: [
    { id: "dashboard", label: "Today's Work", icon: <IconHome size={17} /> },
    { id: "assigned", label: "Assigned Bookings", icon: <IconList size={17} />, badge: "4" },
    { id: "queue", label: "Work Queue", icon: <IconClock size={17} /> },
    { id: "history", label: "History", icon: <IconReceipt size={17} /> },
  ],
  admin: [
    { id: "dashboard", label: "Overview", icon: <IconChart size={17} /> },
    { id: "bookings", label: "Bookings", icon: <IconCalendar size={17} />, badge: "12" },
    { id: "services", label: "Services", icon: <IconSparkles size={17} /> },
    { id: "payments", label: "Payments", icon: <IconWallet size={17} /> },
    { id: "employees", label: "Employees", icon: <IconUsers size={17} /> },
    { id: "customers", label: "Customers", icon: <IconUser size={17} /> },
  ],
};

const ROLE_LABEL = {
  customer: "Customer",
  employee: "Employee",
  admin: "Admin",
};

const Brand = ({ subtitle }) => (
  <div className="row gap-12">
    <div className="brand-mark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        {/* simple drop + car silhouette mark */}
        <path
          d="M12 3s5 5 5 9a5 5 0 1 1-10 0c0-4 5-9 5-9z"
          fill="#fff"
        />
      </svg>
    </div>
    <div className="stack">
      <div className="brand-name">CarWash Pro</div>
      {subtitle && <div className="brand-sub">{subtitle}</div>}
    </div>
  </div>
);

const Sidebar = ({ role, page, onNav, user, onSignOut, open, onClose }) => {
  const nav = NAV_BY_ROLE[role] || [];
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-brand">
        <Brand subtitle={ROLE_LABEL[role] + " workspace"} />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div className="nav-section">Main</div>
        <div className="stack gap-4">
          {nav.map((n) => (
            <div
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => {
                onNav(n.id);
                onClose && onClose();
              }}
            >
              {n.icon}
              <span>{n.label}</span>
              {n.badge && <span className="nav-count">{n.badge}</span>}
            </div>
          ))}
        </div>

        <div className="nav-section">Account</div>
        <div className="stack gap-4">
          <div className="nav-item" onClick={() => onNav("settings")}>
            <IconSettings size={17} />
            <span>Settings</span>
          </div>
          <div className="nav-item" onClick={onSignOut}>
            <IconLogout size={17} />
            <span>Sign out</span>
          </div>
        </div>
      </div>

      <div className="sidebar-foot">
        <div className="avatar">{user.initials}</div>
        <div className="user-meta">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{ROLE_LABEL[role]}</div>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ role, onMenu, onSwitchRole, onNotify }) => {
  return (
    <div className="topbar">
      <div className="row gap-12">
        <button
          className="btn btn-secondary btn-icon mobile-toggle"
          onClick={onMenu}
          aria-label="Menu"
        >
          <IconMenu size={18} />
        </button>
        <div className="input-with-icon search">
          <IconSearch size={16} />
          <input
            className="input"
            placeholder="Search bookings, customers, vehicles…"
          />
        </div>
      </div>
      <div className="topbar-actions">
        <RoleSwitcher role={role} onChange={onSwitchRole} />
        <button
          className="btn btn-secondary btn-icon"
          aria-label="Notifications"
          onClick={onNotify}
        >
          <IconBell size={18} />
        </button>
      </div>
    </div>
  );
};

const RoleSwitcher = ({ role, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const roles = [
    { id: "customer", label: "Customer", icon: <IconUser size={15} /> },
    { id: "employee", label: "Employee", icon: <IconWrench size={15} /> },
    { id: "admin", label: "Admin", icon: <IconShield size={15} /> },
  ];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setOpen((o) => !o)}
        title="Switch demo role"
      >
        <span
          style={{
            fontSize: 10,
            background: "#ececea",
            padding: "2px 7px",
            borderRadius: 999,
            color: "var(--muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Demo
        </span>
        <span>View as {ROLE_LABEL[role]}</span>
        <IconChevD size={14} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "var(--shadow-md)",
            padding: 6,
            zIndex: 20,
            minWidth: 200,
          }}
        >
          <div
            style={{
              padding: "8px 10px 4px",
              fontSize: 11,
              color: "var(--muted-2)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Switch role
          </div>
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                onChange(r.id);
                setOpen(false);
              }}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                background: role === r.id ? "#f4f4f3" : "transparent",
                fontSize: 14,
                color: "var(--ink)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ececea")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  role === r.id ? "#f4f4f3" : "transparent")
              }
            >
              {r.icon}
              <span>{r.label}</span>
              {role === r.id && (
                <span style={{ marginLeft: "auto" }}>
                  <IconCheck size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AppShell = ({ role, page, onNav, user, onSignOut, onSwitchRole, children }) => {
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };
  React.useEffect(() => {
    window.__showToast = showToast;
  }, []);
  return (
    <div className="app" data-screen-label={`App / ${ROLE_LABEL[role]} / ${page}`}>
      <Sidebar
        role={role}
        page={page}
        onNav={onNav}
        user={user}
        onSignOut={onSignOut}
        open={open}
        onClose={() => setOpen(false)}
      />
      <div style={{ minWidth: 0 }}>
        <Topbar
          role={role}
          onMenu={() => setOpen((o) => !o)}
          onSwitchRole={onSwitchRole}
          onNotify={() => showToast("3 new notifications")}
        />
        {children}
      </div>
      {toast && (
        <div className="toast">
          <IconCheck size={16} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  AppShell,
  Brand,
  Sidebar,
  Topbar,
  NAV_BY_ROLE,
  ROLE_LABEL,
});
