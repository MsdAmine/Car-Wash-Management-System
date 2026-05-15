// Employee-side screens.

const STATUS_FLOW = ["pending", "confirmed", "progress", "completed"];

const EmployeeDashboard = ({ onNav, queue, setQueue }) => {
  const inProg = queue.filter((b) => b.status === "progress");
  const next = queue.filter((b) => b.status === "confirmed");

  return (
    <div className="page" data-screen-label="Employee · Today's Work">
      <div className="page-header">
        <div>
          <div className="eyebrow">Sunday, May 17 · Bay 2</div>
          <h1 className="h1">Today's work, Diego.</h1>
          <div className="subtle mt-8">
            {next.length + inProg.length} jobs ahead · target finish 5:30 PM.
          </div>
        </div>
        <div className="row gap-8">
          <Button variant="secondary" icon={<IconRefresh size={14} />}>Sync queue</Button>
          <Button onClick={() => onNav("assigned")}>Open work queue</Button>
        </div>
      </div>

      <div className="stat-grid">
        <Stat icon={<IconCalendar size={14} />} label="Assigned today" value={String(queue.length)} sub="Across 3 services" />
        <Stat icon={<IconPlay size={14} />} label="In progress" value={String(inProg.length)} sub="Bay 2 · 12 min left" />
        <Stat icon={<IconCheck size={14} />} label="Completed today" value="2" delta="On pace" deltaDir="up" />
        <Stat icon={<IconUsers size={14} />} label="Waiting customers" value="1" sub="Walk-in arrived 3 min ago" />
      </div>

      <div className="two-col">
        <div className="card card-pad">
          <SectionHeader
            title="Current job"
            sub="Tap status to advance the wash."
          />
          {inProg[0] ? (
            <JobCard
              b={inProg[0]}
              onAdvance={(next) =>
                setQueue((q) =>
                  q.map((x) => (x.id === inProg[0].id ? { ...x, status: next } : x))
                )
              }
            />
          ) : (
            <div className="empty">
              <IconPlay size={18} />
              <h4>Nothing in progress</h4>
              <div style={{ fontSize: 13 }}>Start the next confirmed booking to begin.</div>
            </div>
          )}

          <div className="divider" />
          <SectionHeader title="Status workflow" sub="Required order for every job." />
          <StatusFlowVis />
        </div>

        <div className="card card-pad">
          <SectionHeader title="Up next" sub="Confirmed appointments." />
          <div className="stack gap-12">
            {next.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="row gap-12"
                style={{
                  padding: 14,
                  background: "#fafaf9",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                }}
              >
                <div className="avatar" style={{ width: 36, height: 36, borderRadius: 10 }}>
                  {b.customerInit}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row-between">
                    <div style={{ fontWeight: 600 }}>{b.customer}</div>
                    <div className="mono subtle" style={{ fontSize: 12 }}>{b.time}</div>
                  </div>
                  <div className="subtle" style={{ fontSize: 13 }}>
                    {b.service} · {b.vehicle}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setQueue((q) => q.map((x) => (x.id === b.id ? { ...x, status: "progress" } : x)))
                  }
                >
                  Start
                </Button>
              </div>
            ))}
            {next.length === 0 && (
              <div className="empty">
                <IconCheck size={18} />
                <h4>All caught up</h4>
                <div style={{ fontSize: 13 }}>No more confirmed jobs in your queue.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusFlowVis = () => {
  const steps = [
    { id: "pending", label: "Pending", desc: "Awaiting confirmation" },
    { id: "confirmed", label: "Confirmed", desc: "Booked & paid hold" },
    { id: "progress", label: "In Progress", desc: "Wash underway" },
    { id: "completed", label: "Completed", desc: "Handed off" },
  ];
  return (
    <div className="row gap-8" style={{ overflowX: "auto", paddingBottom: 4 }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div
            className="stack gap-4"
            style={{
              padding: 14,
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "#fff",
              minWidth: 156,
            }}
          >
            <StatusBadge kind={s.id} />
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.desc}</div>
          </div>
          {i < steps.length - 1 && <IconArrowR size={14} style={{ color: "var(--muted-2)" }} />}
        </React.Fragment>
      ))}
    </div>
  );
};

const JobCard = ({ b, onAdvance }) => {
  const stepIdx = STATUS_FLOW.indexOf(b.status);
  const next = STATUS_FLOW[stepIdx + 1];
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0a0a0a, #1c1c1a)",
        color: "#fff",
        padding: 22,
        borderRadius: 18,
      }}
    >
      <div className="row-between">
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Bay 1 · {b.id}
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: "-0.01em" }}>
            {b.service}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
            {b.customer} · {b.vehicle}
          </div>
        </div>
        <span className="badge badge-progress">
          <span className="dot" />
          In Progress
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
          marginTop: 22,
          fontSize: 13,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Started
          </div>
          <div className="mono" style={{ marginTop: 4 }}>11:18 AM</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            ETA
          </div>
          <div className="mono" style={{ marginTop: 4 }}>11:38 AM</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Charge
          </div>
          <div className="mono" style={{ marginTop: 4 }}>${b.price}.00</div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div className="row-between" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
          <span>Foam · Wash · Rinse · Dry</span>
          <span className="mono">68%</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, height: 6 }}>
          <div
            style={{
              background: "#fff",
              height: "100%",
              width: "68%",
              borderRadius: 999,
            }}
          />
        </div>
      </div>

      <div className="row gap-8" style={{ marginTop: 18 }}>
        {next && (
          <button
            className="btn"
            style={{ background: "#fff", color: "var(--ink)" }}
            onClick={() => onAdvance(next)}
          >
            <IconArrowR size={14} />
            Mark as {STATUS[next].label}
          </button>
        )}
        <button className="btn" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
          Add note
        </button>
      </div>
    </div>
  );
};

const EmployeeAssigned = ({ queue, setQueue }) => {
  return (
    <div className="page" data-screen-label="Employee · Assigned Bookings">
      <div className="page-header">
        <div>
          <div className="eyebrow">Diego · Mission location</div>
          <h1 className="h1">Assigned bookings</h1>
          <div className="subtle mt-8">Tap a job to update its status.</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Time</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Vehicle</th>
                <th>Bay</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((b) => {
                const idx = STATUS_FLOW.indexOf(b.status);
                const next = STATUS_FLOW[idx + 1];
                return (
                  <tr key={b.id}>
                    <td className="mono" style={{ fontWeight: 500 }}>{b.id}</td>
                    <td className="mono">{b.time}</td>
                    <td>{b.customer}</td>
                    <td>{b.service}</td>
                    <td className="subtle">{b.vehicle}</td>
                    <td>{b.bay}</td>
                    <td><StatusBadge kind={b.status} /></td>
                    <td style={{ textAlign: "right" }}>
                      {next ? (
                        <Button
                          size="sm"
                          variant={b.status === "progress" ? "primary" : "secondary"}
                          onClick={() =>
                            setQueue((q) =>
                              q.map((x) => (x.id === b.id ? { ...x, status: next } : x))
                            )
                          }
                        >
                          → {STATUS[next].label}
                        </Button>
                      ) : (
                        <span className="subtle" style={{ fontSize: 13 }}>Done</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const EmployeeQueue = ({ queue, setQueue }) => {
  // kanban-style by status
  const cols = [
    { id: "confirmed", label: "To do" },
    { id: "progress", label: "In progress" },
    { id: "completed", label: "Completed" },
  ];
  return (
    <div className="page" data-screen-label="Employee · Work Queue">
      <div className="page-header">
        <div>
          <div className="eyebrow">Workflow</div>
          <h1 className="h1">Work queue</h1>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {cols.map((col) => {
          const items = queue.filter((b) => b.status === col.id);
          return (
            <div key={col.id} className="card card-pad" style={{ background: "#fafaf9" }}>
              <div className="row-between mb-16">
                <h3 className="h3">{col.label}</h3>
                <span className="tag mono">{items.length}</span>
              </div>
              <div className="stack gap-12">
                {items.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: 14,
                    }}
                  >
                    <div className="row-between" style={{ marginBottom: 6 }}>
                      <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{b.id}</span>
                      <span className="mono" style={{ fontSize: 12 }}>{b.time}</span>
                    </div>
                    <div style={{ fontWeight: 600 }}>{b.service}</div>
                    <div className="subtle" style={{ fontSize: 13, marginTop: 2 }}>
                      {b.customer} · {b.vehicle}
                    </div>
                    <div className="row gap-4 mt-8">
                      {col.id === "confirmed" && (
                        <Button
                          size="sm"
                          block
                          onClick={() =>
                            setQueue((q) => q.map((x) => (x.id === b.id ? { ...x, status: "progress" } : x)))
                          }
                        >
                          Start
                        </Button>
                      )}
                      {col.id === "progress" && (
                        <Button
                          size="sm"
                          block
                          onClick={() =>
                            setQueue((q) => q.map((x) => (x.id === b.id ? { ...x, status: "completed" } : x)))
                          }
                        >
                          Complete
                        </Button>
                      )}
                      {col.id === "completed" && (
                        <div className="row gap-4" style={{ fontSize: 12, color: "var(--muted)" }}>
                          <IconCheck size={12} /> Handed off
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="empty" style={{ padding: "20px 12px" }}>
                    <div style={{ fontSize: 13 }}>Nothing here yet.</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EmployeeHistory = () => {
  const past = [
    { id: "BK-2837", date: "May 16", time: "09:00", customer: "Leila Brooks", service: "Ceramic Protect", rating: 5, tip: 25 },
    { id: "BK-2830", date: "May 15", time: "14:00", customer: "Tanvir Aziz", service: "Premium Detail", rating: 5, tip: 8 },
    { id: "BK-2828", date: "May 15", time: "10:30", customer: "Erin Stahl", service: "Express Wash", rating: 4, tip: 4 },
    { id: "BK-2821", date: "May 14", time: "16:00", customer: "Carl Wen", service: "Premium Detail", rating: 5, tip: 10 },
  ];
  return (
    <div className="page" data-screen-label="Employee · History">
      <div className="page-header">
        <div>
          <div className="eyebrow">Performance</div>
          <h1 className="h1">History</h1>
          <div className="subtle mt-8">Last 30 days · 22 completed washes.</div>
        </div>
      </div>
      <div className="stat-grid">
        <Stat icon={<IconCheck size={14} />} label="Completed (30d)" value="22" delta="+4 vs. prev" deltaDir="up" />
        <Stat icon={<IconStar size={14} />} label="Avg rating" value="4.9" sub="From 18 reviews" />
        <Stat icon={<IconClock size={14} />} label="On-time rate" value="96%" sub="Goal: 95%" />
        <Stat icon={<IconWallet size={14} />} label="Tips (30d)" value="$184" delta="+22%" deltaDir="up" />
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Booking</th>
                <th>When</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Rating</th>
                <th style={{ textAlign: "right" }}>Tip</th>
              </tr>
            </thead>
            <tbody>
              {past.map((p) => (
                <tr key={p.id}>
                  <td className="mono">{p.id}</td>
                  <td className="mono">{p.date} · {p.time}</td>
                  <td>{p.customer}</td>
                  <td>{p.service}</td>
                  <td>
                    <span className="row gap-4">
                      {Array.from({ length: p.rating }).map((_, i) => (
                        <IconStar key={i} size={12} />
                      ))}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }} className="mono">${p.tip}.00</td>
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
  EmployeeDashboard,
  EmployeeAssigned,
  EmployeeQueue,
  EmployeeHistory,
});
