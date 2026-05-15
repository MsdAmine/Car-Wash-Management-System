// Admin-side screens.

const AdminDashboard = ({ onNav }) => {
  return (
    <div className="page" data-screen-label="Admin · Overview">
      <div className="page-header">
        <div>
          <div className="eyebrow">Mission location · Sunday, May 17</div>
          <h1 className="h1">Business overview</h1>
          <div className="subtle mt-8">
            12 bookings today · 5 in queue · Capacity 78%.
          </div>
        </div>
        <div className="row gap-8">
          <Button variant="secondary" icon={<IconRefresh size={14} />}>Refresh</Button>
          <Button icon={<IconPlus size={14} />} onClick={() => onNav("services")}>Add service</Button>
        </div>
      </div>

      <div className="stat-grid">
        <Stat icon={<IconCalendar size={14} />} label="Today's bookings" value="12" delta="+3 vs. yesterday" deltaDir="up" />
        <Stat icon={<IconWallet size={14} />} label="Monthly revenue" value="$24,180" delta="+18% MoM" deltaDir="up" />
        <Stat icon={<IconUsers size={14} />} label="Active customers" value="412" delta="+24 this month" deltaDir="up" />
        <Stat icon={<IconReceipt size={14} />} label="Pending payments" value="$416" delta="3 awaiting" deltaDir="down" />
      </div>

      <div className="two-col" style={{ gridTemplateColumns: "1.7fr 1fr" }}>
        <div className="card">
          <div className="card-pad">
            <SectionHeader
              title="Recent bookings"
              sub="Live operations queue, refreshed each minute."
              action={
                <Button variant="secondary" size="sm" onClick={() => onNav("bookings")}>
                  View all <IconChevR size={14} />
                </Button>
              }
            />
          </div>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>When</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {BOOKINGS.slice(0, 6).map((b) => (
                  <tr key={b.id}>
                    <td className="mono" style={{ fontWeight: 500 }}>{b.id}</td>
                    <td>
                      <div className="row gap-8">
                        <div className="avatar" style={{ width: 26, height: 26, fontSize: 11 }}>
                          {b.customerInit}
                        </div>
                        <span>{b.customer}</span>
                      </div>
                    </td>
                    <td>{b.service}</td>
                    <td className="mono">{b.date} · {b.time}</td>
                    <td><StatusBadge kind={b.status} /></td>
                    <td>{b.assignee}</td>
                    <td style={{ textAlign: "right" }} className="mono">${b.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack gap-16">
          <div className="card card-pad">
            <SectionHeader title="Service performance" sub="This month" />
            <div className="stack gap-16">
              {[
                { name: "Premium Detail", count: 142, share: 42, revenue: 5396 },
                { name: "Express Wash", count: 188, share: 31, revenue: 3384 },
                { name: "Signature Polish", count: 56, share: 19, revenue: 4424 },
                { name: "Ceramic Protect", count: 11, share: 8, revenue: 2739 },
              ].map((s) => (
                <div key={s.name} className="stack gap-8">
                  <div className="row-between">
                    <div style={{ fontWeight: 500 }}>{s.name}</div>
                    <div className="row gap-12">
                      <span className="subtle mono" style={{ fontSize: 12 }}>{s.count} bookings</span>
                      <span className="mono" style={{ fontWeight: 500 }}>${s.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${s.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <SectionHeader title="Quick actions" />
            <div className="stack gap-8">
              <button className="action" style={{ flexDirection: "row", alignItems: "center" }} onClick={() => onNav("bookings")}>
                <div className="icon-wrap"><IconCalendar size={16} /></div>
                <div style={{ flex: 1 }}>
                  <h4>Manage bookings</h4>
                  <p>Assign, reschedule, confirm.</p>
                </div>
                <IconChevR size={14} />
              </button>
              <button className="action" style={{ flexDirection: "row", alignItems: "center" }} onClick={() => onNav("services")}>
                <div className="icon-wrap"><IconSparkles size={16} /></div>
                <div style={{ flex: 1 }}>
                  <h4>Add service</h4>
                  <p>New pricing or duration.</p>
                </div>
                <IconChevR size={14} />
              </button>
              <button className="action" style={{ flexDirection: "row", alignItems: "center" }} onClick={() => onNav("employees")}>
                <div className="icon-wrap"><IconUsers size={16} /></div>
                <div style={{ flex: 1 }}>
                  <h4>Manage employees</h4>
                  <p>Shifts, roles, assignments.</p>
                </div>
                <IconChevR size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-pad mt-24">
        <SectionHeader
          title="Today's schedule"
          sub="3 bays · 5 staff on shift."
          action={
            <div className="pill-toggle">
              <button className="active">Day</button>
              <button>Week</button>
              <button>Month</button>
            </div>
          }
        />
        <ScheduleTimeline />
      </div>
    </div>
  );
};

const ScheduleTimeline = () => {
  const hours = ["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p"];
  const bays = [
    {
      name: "Bay 1",
      items: [
        { x: 5, w: 12, label: "Express · Honda", s: "completed" },
        { x: 23, w: 18, label: "Premium · Priya", s: "progress" },
        { x: 50, w: 14, label: "Express · Adam", s: "confirmed" },
      ],
    },
    {
      name: "Bay 2",
      items: [
        { x: 12, w: 22, label: "Premium · Marcus", s: "confirmed" },
        { x: 40, w: 18, label: "Premium · Sora", s: "confirmed" },
        { x: 70, w: 20, label: "Signature · Walk-in", s: "pending" },
      ],
    },
    {
      name: "Bay 3",
      items: [
        { x: 8, w: 38, label: "Ceramic · Leila", s: "completed" },
        { x: 55, w: 26, label: "Signature · James", s: "pending" },
      ],
    },
  ];
  const colorFor = (s) =>
    ({
      pending: "var(--st-pending-bg)",
      confirmed: "var(--st-confirmed-bg)",
      progress: "var(--st-progress-bg)",
      completed: "var(--st-done-bg)",
    }[s]);
  const fgFor = (s) =>
    ({
      pending: "var(--st-pending-fg)",
      confirmed: "var(--st-confirmed-fg)",
      progress: "var(--st-progress-fg)",
      completed: "var(--st-done-fg)",
    }[s]);
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 720 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `80px 1fr`,
            gap: 0,
            marginBottom: 4,
          }}
        >
          <div />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${hours.length}, 1fr)`,
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            {hours.map((h) => (
              <div key={h} style={{ padding: "4px 0", borderLeft: "1px solid var(--border)", paddingLeft: 6 }} className="mono">
                {h}
              </div>
            ))}
          </div>
        </div>
        {bays.map((b) => (
          <div
            key={b.name}
            style={{
              display: "grid",
              gridTemplateColumns: `80px 1fr`,
              alignItems: "center",
              padding: "6px 0",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500 }}>{b.name}</div>
            <div
              style={{
                position: "relative",
                background:
                  "repeating-linear-gradient(90deg, transparent 0, transparent calc(100%/11 - 1px), var(--border) calc(100%/11 - 1px), var(--border) calc(100%/11))",
                height: 44,
                borderRadius: 8,
                background: "#fafaf9",
                border: "1px solid var(--border)",
              }}
            >
              {b.items.map((it, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${it.x}%`,
                    width: `${it.w}%`,
                    top: 6,
                    bottom: 6,
                    background: colorFor(it.s),
                    color: fgFor(it.s),
                    borderRadius: 6,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  title={`${it.label} (${it.s})`}
                >
                  {it.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminBookings = () => {
  const [filter, setFilter] = React.useState("all");
  const counts = BOOKINGS.reduce((a, b) => ((a[b.status] = (a[b.status] || 0) + 1), a), {});
  const filters = [
    { id: "all", label: "All", n: BOOKINGS.length },
    { id: "pending", label: "Pending", n: counts.pending || 0 },
    { id: "confirmed", label: "Confirmed", n: counts.confirmed || 0 },
    { id: "progress", label: "In Progress", n: counts.progress || 0 },
    { id: "completed", label: "Completed", n: counts.completed || 0 },
    { id: "cancelled", label: "Cancelled", n: counts.cancelled || 0 },
    { id: "noshow", label: "No Show", n: counts.noshow || 0 },
  ];
  const rows = filter === "all" ? BOOKINGS : BOOKINGS.filter((b) => b.status === filter);

  return (
    <div className="page" data-screen-label="Admin · Bookings">
      <div className="page-header">
        <div>
          <div className="eyebrow">Operations</div>
          <h1 className="h1">Bookings</h1>
        </div>
        <div className="row gap-8">
          <Button variant="secondary" icon={<IconFilter size={14} />}>Filters</Button>
          <Button icon={<IconPlus size={14} />}>New booking</Button>
        </div>
      </div>

      <div className="row gap-8 mb-16" style={{ flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="tag"
            style={{
              cursor: "pointer",
              background: filter === f.id ? "var(--ink)" : "#fff",
              color: filter === f.id ? "#fff" : "var(--ink-2)",
              borderColor: filter === f.id ? "var(--ink)" : "var(--border)",
              padding: "6px 12px",
            }}
          >
            {f.label}
            <span style={{ opacity: 0.6, fontSize: 11 }}>{f.n}</span>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Vehicle</th>
                <th>When</th>
                <th>Bay</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Payment</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td className="mono" style={{ fontWeight: 500 }}>{b.id}</td>
                  <td>
                    <div className="row gap-8">
                      <div className="avatar" style={{ width: 26, height: 26, fontSize: 11 }}>{b.customerInit}</div>
                      {b.customer}
                    </div>
                  </td>
                  <td>{b.service}</td>
                  <td className="subtle">{b.vehicle}</td>
                  <td className="mono">{b.date} · {b.time}</td>
                  <td>{b.bay}</td>
                  <td>{b.assignee}</td>
                  <td><StatusBadge kind={b.status} /></td>
                  <td><StatusBadge kind={b.pay} type="payment" /></td>
                  <td style={{ textAlign: "right" }} className="mono">${b.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminServices = () => {
  const [items, setItems] = React.useState(SERVICES);
  const [edit, setEdit] = React.useState(null);

  return (
    <div className="page" data-screen-label="Admin · Services">
      <div className="page-header">
        <div>
          <div className="eyebrow">Catalog</div>
          <h1 className="h1">Services</h1>
          <div className="subtle mt-8">Set pricing, duration and features for each wash.</div>
        </div>
        <Button icon={<IconPlus size={14} />} onClick={() => setEdit({ id: "new", name: "", desc: "", duration: 30, price: 25, features: [] })}>
          New service
        </Button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Service</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Bookings (30d)</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s, i) => (
                <tr key={s.id}>
                  <td>
                    <div className="row gap-12">
                      <div
                        className="icon-wrap"
                        style={{ width: 36, height: 36, background: "#f4f4f3" }}
                      >
                        <IconDroplet size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div className="subtle" style={{ fontSize: 12 }}>
                          {s.features.slice(0, 3).join(" · ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="mono">{s.duration} min</td>
                  <td className="mono">${s.price}.00</td>
                  <td className="mono">{[188, 142, 56, 11][i] || 0}</td>
                  <td>
                    <span className="badge badge-confirmed">
                      <span className="dot" />
                      Active
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="ghost" size="sm" onClick={() => setEdit(s)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceEditModal
        s={edit}
        onClose={() => setEdit(null)}
        onSave={(svc) => {
          if (svc.id === "new") {
            setItems((it) => [...it, { ...svc, id: "s" + (it.length + 1) }]);
          } else {
            setItems((it) => it.map((x) => (x.id === svc.id ? svc : x)));
          }
          setEdit(null);
          window.__showToast && window.__showToast("Service saved");
        }}
      />
    </div>
  );
};

const ServiceEditModal = ({ s, onClose, onSave }) => {
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [price, setPrice] = React.useState(25);
  const [duration, setDuration] = React.useState(30);
  React.useEffect(() => {
    if (s) {
      setName(s.name);
      setDesc(s.desc);
      setPrice(s.price);
      setDuration(s.duration);
    }
  }, [s]);

  return (
    <Modal
      open={!!s}
      onClose={onClose}
      title={s?.id === "new" ? "Create service" : "Edit service"}
      sub="Customer-facing details and pricing."
      wide
    >
      <div className="auth-form">
        <Field label="Service name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Premium Detail" />
        </Field>
        <Field label="Description">
          <textarea
            className="textarea"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe what's included..."
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Price (USD)">
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
              icon={<span className="mono" style={{ color: "var(--muted)" }}>$</span>}
            />
          </Field>
          <Field label="Duration (min)">
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(+e.target.value)}
              icon={<IconClock size={14} />}
            />
          </Field>
        </div>
        <div className="row gap-8" style={{ justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ ...(s || {}), name, desc, price, duration, features: s?.features || [] })}>
            Save service
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const AdminPayments = () => {
  return (
    <div className="page" data-screen-label="Admin · Payments">
      <div className="page-header">
        <div>
          <div className="eyebrow">Finance</div>
          <h1 className="h1">Payments</h1>
        </div>
        <div className="row gap-8">
          <Button variant="secondary" icon={<IconFilter size={14} />}>Filters</Button>
          <Button variant="secondary">Export CSV</Button>
        </div>
      </div>

      <div className="stat-grid">
        <Stat icon={<IconWallet size={14} />} label="Captured (today)" value="$486" delta="+12% vs. avg" deltaDir="up" />
        <Stat icon={<IconClock size={14} />} label="Pending" value="$416" sub="3 invoices" />
        <Stat icon={<IconRefresh size={14} />} label="Refunded (30d)" value="$144" sub="6 transactions" />
        <Stat icon={<IconX size={14} />} label="Failed (30d)" value="$98" sub="2 retried" />
      </div>

      <div className="card">
        <div className="card-pad">
          <SectionHeader title="Recent transactions" />
        </div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Booking</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p) => (
                <tr key={p.id}>
                  <td className="mono" style={{ fontWeight: 500 }}>{p.id}</td>
                  <td className="mono">{p.booking}</td>
                  <td>{p.customer}</td>
                  <td className="subtle mono" style={{ fontSize: 13 }}>{p.method}</td>
                  <td className="mono">{p.date}</td>
                  <td><StatusBadge kind={p.status} type="payment" /></td>
                  <td style={{ textAlign: "right" }} className="mono">${p.amount}.00</td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminEmployees = () => {
  return (
    <div className="page" data-screen-label="Admin · Employees">
      <div className="page-header">
        <div>
          <div className="eyebrow">Team</div>
          <h1 className="h1">Employees</h1>
          <div className="subtle mt-8">5 active · 4 on shift today.</div>
        </div>
        <Button icon={<IconPlus size={14} />}>Add employee</Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {EMPLOYEES.map((e) => (
          <div key={e.id} className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="row gap-12">
              <div className="avatar" style={{ width: 44, height: 44, borderRadius: 12, fontSize: 14 }}>
                {e.init}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{e.name}</div>
                <div className="subtle" style={{ fontSize: 13 }}>{e.role}</div>
              </div>
              <span
                className={`badge ${e.status === "On shift" ? "badge-confirmed" : "badge-neutral"}`}
                style={{ marginLeft: "auto" }}
              >
                <span className="dot" />
                {e.status}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                background: "#fafaf9",
                borderRadius: 12,
                padding: 12,
                fontSize: 13,
              }}
            >
              <div>
                <div className="subtle" style={{ fontSize: 11 }}>Today</div>
                <div className="mono" style={{ fontWeight: 600, marginTop: 2 }}>{e.today}</div>
              </div>
              <div>
                <div className="subtle" style={{ fontSize: 11 }}>This week</div>
                <div className="mono" style={{ fontWeight: 600, marginTop: 2 }}>{e.weekly}</div>
              </div>
              <div>
                <div className="subtle" style={{ fontSize: 11 }}>Rating</div>
                <div className="row gap-4" style={{ fontWeight: 600, marginTop: 2 }}>
                  <IconStar size={12} /> {e.rating.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="row gap-8">
              <Button variant="secondary" size="sm" block>Schedule</Button>
              <Button variant="ghost" size="sm">
                <IconChevR size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminCustomers = () => {
  const customers = [
    { name: "Marcus Reyes", init: "MR", email: "marcus@example.com", washes: 18, spend: 432, last: "May 02", tier: "Gold" },
    { name: "Priya Shah", init: "PS", email: "priya@example.com", washes: 24, spend: 612, last: "May 17", tier: "Gold" },
    { name: "James O'Connor", init: "JO", email: "james@example.com", washes: 5, spend: 188, last: "May 17", tier: "Silver" },
    { name: "Sora Tanaka", init: "ST", email: "sora@example.com", washes: 12, spend: 268, last: "May 17", tier: "Silver" },
    { name: "Leila Brooks", init: "LB", email: "leila@example.com", washes: 3, spend: 415, last: "May 16", tier: "Gold" },
    { name: "Adam Kessler", init: "AK", email: "adam@example.com", washes: 1, spend: 0, last: "May 16", tier: "New" },
  ];
  return (
    <div className="page" data-screen-label="Admin · Customers">
      <div className="page-header">
        <div>
          <div className="eyebrow">CRM</div>
          <h1 className="h1">Customers</h1>
        </div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Washes</th>
                <th>Lifetime spend</th>
                <th>Last visit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email}>
                  <td>
                    <div className="row gap-8">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {c.init}
                      </div>
                      {c.name}
                    </div>
                  </td>
                  <td className="subtle mono" style={{ fontSize: 13 }}>{c.email}</td>
                  <td>
                    <span className={`badge ${c.tier === "Gold" ? "badge-completed" : c.tier === "Silver" ? "badge-neutral" : "badge-pending"}`}>
                      <span className="dot" />{c.tier}
                    </span>
                  </td>
                  <td className="mono">{c.washes}</td>
                  <td className="mono">${c.spend}</td>
                  <td className="mono">{c.last}</td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  AdminDashboard,
  AdminBookings,
  AdminServices,
  AdminPayments,
  AdminEmployees,
  AdminCustomers,
});
