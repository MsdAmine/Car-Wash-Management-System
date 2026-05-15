// Customer-side screens.

const CustomerDashboard = ({ onNav }) => {
  return (
    <div className="page" data-screen-label="Customer · Dashboard">
      <div className="page-header">
        <div>
          <div className="eyebrow">Sunday, May 17</div>
          <h1 className="h1">Good morning, Marcus.</h1>
          <div className="subtle mt-8">
            You have 1 upcoming wash. Last visit was 19 days ago.
          </div>
        </div>
        <Button size="lg" icon={<IconPlus size={16} />} onClick={() => onNav("book")}>
          Book a wash
        </Button>
      </div>

      <div className="stat-grid">
        <Stat
          icon={<IconCalendar size={14} />}
          label="Upcoming bookings"
          value="2"
          sub="Next: Mon, May 19 · 10:30"
        />
        <Stat
          icon={<IconCar size={14} />}
          label="Registered vehicles"
          value="2"
          sub="Daily · Weekend"
        />
        <Stat
          icon={<IconCheck size={14} />}
          label="Completed washes"
          value="18"
          delta="+3 vs. last quarter"
          deltaDir="up"
        />
        <Stat
          icon={<IconWallet size={14} />}
          label="Pending payments"
          value="$79"
          sub="1 awaiting confirmation"
        />
      </div>

      <div className="two-col">
        <div className="card card-pad">
          <SectionHeader
            title="Upcoming booking"
            sub="Your next scheduled wash."
            action={
              <Button variant="secondary" size="sm" onClick={() => onNav("bookings")}>
                View all
              </Button>
            }
          />
          <UpcomingBookingCard onNav={onNav} />
          <div className="divider" />
          <SectionHeader title="Quick actions" />
          <div className="action-grid">
            <button className="action" onClick={() => onNav("book")}>
              <div className="icon-wrap">
                <IconPlus size={18} />
              </div>
              <div>
                <h4>Book a wash</h4>
                <p>Pick a service, time and vehicle.</p>
              </div>
            </button>
            <button className="action" onClick={() => onNav("vehicles")}>
              <div className="icon-wrap">
                <IconCar size={18} />
              </div>
              <div>
                <h4>Add vehicle</h4>
                <p>Save a car for faster booking.</p>
              </div>
            </button>
            <button className="action" onClick={() => onNav("bookings")}>
              <div className="icon-wrap">
                <IconCalendar size={18} />
              </div>
              <div>
                <h4>My bookings</h4>
                <p>Reschedule or cancel upcoming.</p>
              </div>
            </button>
            <button className="action" onClick={() => onNav("payments")}>
              <div className="icon-wrap">
                <IconWallet size={18} />
              </div>
              <div>
                <h4>Payments</h4>
                <p>Receipts and card on file.</p>
              </div>
            </button>
          </div>
        </div>

        <div className="card card-pad">
          <SectionHeader
            title="Recent activity"
            sub="Updates on your account."
          />
          <div className="stack gap-16">
            {[
              { t: "Today 09:12", text: "BK-2845 confirmed for Mon, May 19 · 10:30" },
              { t: "May 2", text: "Express Wash completed on Toyota Camry" },
              { t: "Apr 28", text: "Signature Polish completed on Subaru Outback" },
              { t: "Apr 28", text: "Receipt sent for $79.00" },
              { t: "Apr 12", text: "Booking BK-2756 cancelled · refund issued" },
            ].map((a, i) => (
              <div key={i} className="row gap-12" style={{ alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: i === 0 ? "var(--ink)" : "var(--border-strong)",
                    marginTop: 7,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "var(--ink-2)" }}>{a.text}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    {a.t}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="empty" style={{ padding: "22px 16px" }}>
            <IconStar size={20} />
            <h4>Refer a friend</h4>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Both get $10 off the next premium wash.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpcomingBookingCard = ({ onNav }) => {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1c1c1a 100%)",
        color: "#fff",
        borderRadius: 18,
        padding: 22,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 220,
          height: 220,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -10,
          top: -10,
          width: 160,
          height: 160,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />

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
            BK-2845 · Confirmed
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              marginTop: 6,
              letterSpacing: "-0.01em",
            }}
          >
            Premium Detail · Toyota Camry
          </div>
        </div>
        <span
          className="badge badge-confirmed"
          style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}
        >
          <span className="dot" />
          Confirmed
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
          marginTop: 22,
          position: "relative",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Date
          </div>
          <div style={{ marginTop: 4, fontWeight: 500 }}>Mon, May 19</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Time
          </div>
          <div style={{ marginTop: 4, fontWeight: 500 }} className="mono">
            10:30 AM
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Location
          </div>
          <div style={{ marginTop: 4, fontWeight: 500 }}>Bay 2 · Mission</div>
        </div>
      </div>

      <div className="row gap-8" style={{ marginTop: 22 }}>
        <button
          className="btn btn-sm"
          style={{ background: "#fff", color: "var(--ink)" }}
          onClick={() => onNav("bookings")}
        >
          View details
        </button>
        <button
          className="btn btn-sm"
          style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
        >
          Reschedule
        </button>
      </div>
    </div>
  );
};

const CustomerVehicles = ({ onAddVehicle }) => {
  const [vehicles, setVehicles] = React.useState(VEHICLES);
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <div className="page" data-screen-label="Customer · Vehicles">
      <div className="page-header">
        <div>
          <div className="eyebrow">Garage</div>
          <h1 className="h1">My vehicles</h1>
          <div className="subtle mt-8">Saved cars are pre-filled when booking.</div>
        </div>
        <Button icon={<IconPlus size={16} />} onClick={() => setAddOpen(true)}>
          Add vehicle
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {vehicles.map((v) => (
          <VehicleCard key={v.id} v={v} onRemove={() => setVehicles((vs) => vs.filter((x) => x.id !== v.id))} />
        ))}

        <button
          className="action"
          onClick={() => setAddOpen(true)}
          style={{
            border: "1px dashed var(--border-strong)",
            background: "transparent",
            padding: 22,
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <div className="icon-wrap" style={{ width: 44, height: 44 }}>
            <IconPlus size={20} />
          </div>
          <div style={{ textAlign: "center" }}>
            <h4>Add another vehicle</h4>
            <p>Make, model, plate and color.</p>
          </div>
        </button>
      </div>

      <AddVehicleModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(v) => {
          setVehicles((vs) => [...vs, { ...v, id: "v" + (vs.length + 1), lastWash: "—" }]);
          setAddOpen(false);
          window.__showToast && window.__showToast("Vehicle added");
        }}
      />
    </div>
  );
};

const VehicleCard = ({ v, onRemove }) => (
  <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div className="row-between">
      <div className="row gap-12">
        <div className="icon-wrap" style={{ background: "#0a0a0a", color: "#fff", width: 42, height: 42, borderRadius: 12 }}>
          <IconCar size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>
            {v.year} {v.make} {v.model}
          </div>
          <div className="subtle" style={{ fontSize: 13 }}>
            "{v.nickname}" · {v.color}
          </div>
        </div>
      </div>
      <span className="tag mono">{v.plate}</span>
    </div>
    <div
      style={{
        background: "#fafaf9",
        borderRadius: 12,
        padding: 12,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        fontSize: 13,
      }}
    >
      <div>
        <div className="subtle" style={{ fontSize: 11 }}>Last wash</div>
        <div style={{ fontWeight: 500, marginTop: 2 }}>{v.lastWash}</div>
      </div>
      <div>
        <div className="subtle" style={{ fontSize: 11 }}>Total visits</div>
        <div style={{ fontWeight: 500, marginTop: 2 }}>12</div>
      </div>
    </div>
    <div className="row gap-8">
      <Button variant="secondary" size="sm" block>
        Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={onRemove}>
        Remove
      </Button>
    </div>
  </div>
);

const AddVehicleModal = ({ open, onClose, onSubmit }) => (
  <Modal open={open} onClose={onClose} title="Add vehicle" sub="We'll save it for faster booking.">
    <form
      className="auth-form"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        onSubmit({
          nickname: f.get("nickname"),
          make: f.get("make"),
          model: f.get("model"),
          year: f.get("year"),
          plate: f.get("plate"),
          color: f.get("color"),
        });
      }}
    >
      <Field label="Nickname (optional)">
        <Input name="nickname" placeholder="Daily" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 110px", gap: 12 }}>
        <Field label="Make">
          <Input name="make" placeholder="Toyota" required />
        </Field>
        <Field label="Model">
          <Input name="model" placeholder="Camry" required />
        </Field>
        <Field label="Year">
          <Input name="year" placeholder="2022" required />
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="License plate">
          <Input name="plate" placeholder="8KQR-220" />
        </Field>
        <Field label="Color">
          <Input name="color" placeholder="Silver" />
        </Field>
      </div>
      <div className="row gap-8" style={{ justifyContent: "flex-end", marginTop: 8 }}>
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add vehicle</Button>
      </div>
    </form>
  </Modal>
);

const CustomerBook = ({ onDone }) => {
  const [step, setStep] = React.useState(0);
  const [svc, setSvc] = React.useState("prm");
  const [vehicle, setVehicle] = React.useState("v1");
  const [date, setDate] = React.useState(2); // index into days
  const [time, setTime] = React.useState("10:30");
  const [confirmed, setConfirmed] = React.useState(false);

  const days = [
    { d: "Sun", n: "17", disabled: true },
    { d: "Mon", n: "18" },
    { d: "Tue", n: "19" },
    { d: "Wed", n: "20" },
    { d: "Thu", n: "21" },
    { d: "Fri", n: "22" },
    { d: "Sat", n: "23" },
  ];
  const slots = [
    { t: "09:00", on: true },
    { t: "09:30", on: false },
    { t: "10:00", on: true },
    { t: "10:30", on: true },
    { t: "11:00", on: true },
    { t: "11:30", on: false },
    { t: "13:00", on: true },
    { t: "13:30", on: true },
    { t: "14:00", on: true },
    { t: "14:30", on: true },
    { t: "15:00", on: false },
    { t: "16:00", on: true },
  ];
  const svcObj = SERVICES.find((s) => s.id === svc);
  const vObj = VEHICLES.find((v) => v.id === vehicle);

  if (confirmed) {
    return (
      <div className="page" data-screen-label="Customer · Booking Confirmed">
        <div style={{ maxWidth: 540, margin: "60px auto", textAlign: "center" }}>
          <div
            className="icon-wrap"
            style={{
              width: 64,
              height: 64,
              background: "#e6efe9",
              color: "#2e5a3f",
              margin: "0 auto",
              borderRadius: 18,
            }}
          >
            <IconCheck size={28} />
          </div>
          <h1 className="h1" style={{ marginTop: 18 }}>
            You're booked.
          </h1>
          <div className="subtle mt-8">
            We've sent a confirmation to your email. See you on {days[date].d} {days[date].n}.
          </div>
          <div className="card card-pad mt-24" style={{ textAlign: "left" }}>
            <div className="row-between">
              <div>
                <div className="subtle" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Booking
                </div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>BK-2846</div>
              </div>
              <StatusBadge kind="confirmed" />
            </div>
            <div className="divider" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 14 }}>
              <div>
                <div className="subtle" style={{ fontSize: 12 }}>Service</div>
                <div style={{ fontWeight: 500, marginTop: 2 }}>{svcObj.name}</div>
              </div>
              <div>
                <div className="subtle" style={{ fontSize: 12 }}>Vehicle</div>
                <div style={{ fontWeight: 500, marginTop: 2 }}>
                  {vObj.year} {vObj.make} {vObj.model}
                </div>
              </div>
              <div>
                <div className="subtle" style={{ fontSize: 12 }}>When</div>
                <div style={{ fontWeight: 500, marginTop: 2 }} className="mono">
                  {days[date].d} {days[date].n} · {time}
                </div>
              </div>
              <div>
                <div className="subtle" style={{ fontSize: 12 }}>Total charged</div>
                <div style={{ fontWeight: 500, marginTop: 2 }}>${svcObj.price}.00</div>
              </div>
            </div>
          </div>
          <div className="row gap-8" style={{ justifyContent: "center", marginTop: 24 }}>
            <Button variant="secondary" onClick={onDone}>
              Back to dashboard
            </Button>
            <Button onClick={() => onDone("bookings")}>View my bookings</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" data-screen-label="Customer · Book Appointment">
      <div className="page-header">
        <div>
          <div className="eyebrow">New appointment</div>
          <h1 className="h1">Book a wash</h1>
        </div>
      </div>

      <div className="steps">
        {["Service", "Vehicle", "Time", "Review"].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`step ${i === step ? "active" : i < step ? "done" : ""}`}>
              <span className="step-num">{i < step ? <IconCheck size={11} /> : i + 1}</span>
              {s}
            </div>
            {i < 3 && <div className="step-bar" />}
          </React.Fragment>
        ))}
      </div>

      <div className="two-col">
        <div className="card card-pad-lg">
          {step === 0 && (
            <>
              <SectionHeader title="Pick a service" />
              <div className="stack gap-12">
                {SERVICES.map((s) => (
                  <label
                    key={s.id}
                    className="row-between"
                    style={{
                      padding: 16,
                      border: `1px solid ${svc === s.id ? "var(--ink)" : "var(--border)"}`,
                      borderRadius: 14,
                      cursor: "pointer",
                      background: svc === s.id ? "#fafaf9" : "#fff",
                    }}
                  >
                    <div className="row gap-12">
                      <input
                        type="radio"
                        name="svc"
                        checked={svc === s.id}
                        onChange={() => setSvc(s.id)}
                      />
                      <div>
                        <div className="row gap-8" style={{ alignItems: "center" }}>
                          <span style={{ fontWeight: 600 }}>{s.name}</span>
                          {s.popular && <span className="badge badge-neutral">Most popular</span>}
                        </div>
                        <div className="subtle" style={{ fontSize: 13, marginTop: 4 }}>
                          {s.desc}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 600 }}>${s.price}</div>
                      <div className="subtle" style={{ fontSize: 12 }}>
                        {s.duration} min
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <SectionHeader title="Which vehicle?" />
              <div className="stack gap-12">
                {VEHICLES.map((v) => (
                  <label
                    key={v.id}
                    className="row-between"
                    style={{
                      padding: 16,
                      border: `1px solid ${vehicle === v.id ? "var(--ink)" : "var(--border)"}`,
                      borderRadius: 14,
                      cursor: "pointer",
                    }}
                  >
                    <div className="row gap-12">
                      <input
                        type="radio"
                        name="v"
                        checked={vehicle === v.id}
                        onChange={() => setVehicle(v.id)}
                      />
                      <div className="icon-wrap">
                        <IconCar size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {v.year} {v.make} {v.model}
                        </div>
                        <div className="subtle" style={{ fontSize: 13 }}>
                          "{v.nickname}" · {v.color} · <span className="mono">{v.plate}</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
                <button
                  className="btn btn-secondary"
                  style={{ alignSelf: "flex-start", marginTop: 4 }}
                >
                  <IconPlus size={14} /> Add a new vehicle
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <SectionHeader
                title="Choose date & time"
                sub={`${svcObj.duration} minute appointment.`}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 18 }}>
                {days.map((d, i) => (
                  <button
                    key={i}
                    className={`slot ${date === i ? "selected" : ""} ${d.disabled ? "disabled" : ""}`}
                    onClick={() => !d.disabled && setDate(i)}
                    disabled={d.disabled}
                    style={{ padding: "10px 4px" }}
                  >
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{d.d}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{d.n}</div>
                  </button>
                ))}
              </div>
              <div className="label mb-8">Morning</div>
              <div className="slots mb-16">
                {slots.slice(0, 6).map((s) => (
                  <button
                    key={s.t}
                    className={`slot ${time === s.t ? "selected" : ""} ${!s.on ? "disabled" : ""}`}
                    onClick={() => s.on && setTime(s.t)}
                    disabled={!s.on}
                  >
                    {s.t}
                  </button>
                ))}
              </div>
              <div className="label mb-8">Afternoon</div>
              <div className="slots">
                {slots.slice(6).map((s) => (
                  <button
                    key={s.t}
                    className={`slot ${time === s.t ? "selected" : ""} ${!s.on ? "disabled" : ""}`}
                    onClick={() => s.on && setTime(s.t)}
                    disabled={!s.on}
                  >
                    {s.t}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <SectionHeader title="Review & pay" sub="You won't be charged until the wash is started." />
              <div className="stack gap-16">
                <ReviewRow label="Service" value={svcObj.name} sub={`${svcObj.duration} min`} />
                <ReviewRow
                  label="Vehicle"
                  value={`${vObj.year} ${vObj.make} ${vObj.model}`}
                  sub={`"${vObj.nickname}" · ${vObj.plate}`}
                />
                <ReviewRow label="When" value={`${days[date].d} ${days[date].n} · ${time}`} sub="Mission location · Bay assigned at check-in" />
                <ReviewRow label="Payment" value="Visa ending 4242" sub="Authorize now, charge on completion" />
              </div>
            </>
          )}

          <div className="row gap-8" style={{ justifyContent: "space-between", marginTop: 28 }}>
            <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <IconChevL size={14} /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Continue <IconArrowR size={14} />
              </Button>
            ) : (
              <Button onClick={() => setConfirmed(true)}>Confirm booking</Button>
            )}
          </div>
        </div>

        <div className="card card-pad" style={{ height: "fit-content", position: "sticky", top: 96 }}>
          <SectionHeader title="Order summary" />
          <div className="stack gap-12" style={{ fontSize: 14 }}>
            <div className="row-between">
              <span className="subtle">Service</span>
              <span style={{ fontWeight: 500 }}>{svcObj.name}</span>
            </div>
            <div className="row-between">
              <span className="subtle">Duration</span>
              <span className="mono">{svcObj.duration} min</span>
            </div>
            <div className="row-between">
              <span className="subtle">Vehicle</span>
              <span style={{ fontWeight: 500 }}>{vObj.make} {vObj.model}</span>
            </div>
            <div className="row-between">
              <span className="subtle">When</span>
              <span className="mono">{days[date].d} {days[date].n} · {time}</span>
            </div>
            <div className="divider" style={{ margin: "6px 0" }} />
            <div className="row-between">
              <span className="subtle">Subtotal</span>
              <span>${svcObj.price}.00</span>
            </div>
            <div className="row-between">
              <span className="subtle">Service fee</span>
              <span>$0.00</span>
            </div>
            <div className="row-between" style={{ fontSize: 18, fontWeight: 600 }}>
              <span>Total</span>
              <span>${svcObj.price}.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewRow = ({ label, value, sub }) => (
  <div className="row-between" style={{ paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
    <div className="subtle" style={{ fontSize: 13 }}>
      {label}
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={{ fontWeight: 500 }}>{value}</div>
      {sub && <div className="subtle" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const CustomerBookings = () => {
  const [tab, setTab] = React.useState("upcoming");
  const upcoming = MY_BOOKINGS.filter((b) => ["confirmed", "pending", "progress"].includes(b.status));
  const past = MY_BOOKINGS.filter((b) => ["completed", "cancelled", "noshow"].includes(b.status));
  const rows = tab === "upcoming" ? upcoming : past;

  return (
    <div className="page" data-screen-label="Customer · My Bookings">
      <div className="page-header">
        <div>
          <div className="eyebrow">Schedule</div>
          <h1 className="h1">My bookings</h1>
        </div>
        <div className="row gap-8">
          <div className="pill-toggle">
            <button className={tab === "upcoming" ? "active" : ""} onClick={() => setTab("upcoming")}>
              Upcoming · {upcoming.length}
            </button>
            <button className={tab === "past" ? "active" : ""} onClick={() => setTab("past")}>
              Past · {past.length}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Service</th>
                <th>When</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Payment</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td className="mono" style={{ fontWeight: 500 }}>{b.id}</td>
                  <td>{b.service}</td>
                  <td className="mono">{b.date} · {b.time}</td>
                  <td>{b.vehicle}</td>
                  <td><StatusBadge kind={b.status} /></td>
                  <td><StatusBadge kind={b.pay} type="payment" /></td>
                  <td style={{ textAlign: "right" }} className="mono">${b.price}.00</td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="ghost" size="sm">
                      Details <IconChevR size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div style={{ padding: 30 }}>
            <div className="empty">
              <IconCalendar size={22} />
              <h4>No {tab === "upcoming" ? "upcoming" : "past"} bookings</h4>
              <div style={{ fontSize: 13 }}>Bookings will appear here once they're placed.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomerServices = ({ onBook }) => {
  return (
    <div className="page" data-screen-label="Customer · Services">
      <div className="page-header">
        <div>
          <div className="eyebrow">Catalog</div>
          <h1 className="h1">Services</h1>
          <div className="subtle mt-8">Pick a wash that fits your time and budget.</div>
        </div>
      </div>
      <div className="svc-grid">
        {SERVICES.map((s, i) => (
          <div className="svc-card" key={s.id}>
            <div className="svc-thumb">
              <ServiceThumb tone={i} />
              {s.popular && (
                <span
                  className="badge badge-neutral"
                  style={{ position: "absolute", top: 12, left: 12, background: "#fff" }}
                >
                  Most popular
                </span>
              )}
            </div>
            <div className="svc-body">
              <div className="row-between">
                <h3 className="h3">{s.name}</h3>
                <span className="subtle mono" style={{ fontSize: 12 }}>{s.duration} min</span>
              </div>
              <p className="subtle" style={{ fontSize: 13, margin: 0 }}>{s.desc}</p>
              <ul style={{ margin: "4px 0", padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                {s.features.map((f) => (
                  <li key={f} className="row gap-8" style={{ fontSize: 13, color: "var(--ink-2)" }}>
                    <IconCheck size={14} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="row-between" style={{ marginTop: "auto" }}>
                <div className="svc-price">${s.price}</div>
                <Button size="sm" onClick={onBook}>
                  Book
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerPayments = () => {
  const items = [
    { id: "PMT-1245", date: "May 02", desc: "Express Wash", amount: 18, status: "confirmed" },
    { id: "PMT-1198", date: "Apr 28", desc: "Signature Polish", amount: 79, status: "confirmed" },
    { id: "PMT-1166", date: "Apr 12", desc: "Express Wash (refund)", amount: 18, status: "refunded" },
    { id: "PMT-1132", date: "Mar 30", desc: "Premium Detail", amount: 38, status: "confirmed" },
  ];
  return (
    <div className="page" data-screen-label="Customer · Payments">
      <div className="page-header">
        <div>
          <div className="eyebrow">Billing</div>
          <h1 className="h1">Payments</h1>
        </div>
      </div>

      <div className="two-col" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="card">
          <div className="card-pad">
            <SectionHeader title="Recent transactions" />
          </div>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td className="mono">{i.id}</td>
                    <td className="mono">{i.date}</td>
                    <td>{i.desc}</td>
                    <td><StatusBadge kind={i.status} type="payment" /></td>
                    <td style={{ textAlign: "right" }} className="mono">${i.amount}.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="stack gap-16">
          <div className="card card-pad">
            <SectionHeader title="Card on file" />
            <div
              style={{
                background: "linear-gradient(135deg, #0a0a0a, #2a2a28)",
                color: "#fff",
                borderRadius: 14,
                padding: 18,
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Visa
              </div>
              <div className="mono" style={{ fontSize: 18, marginTop: 18, letterSpacing: "0.1em" }}>
                •••• •••• •••• 4242
              </div>
              <div className="row-between" style={{ marginTop: 16, fontSize: 12 }}>
                <div>
                  <div style={{ opacity: 0.5 }}>Cardholder</div>
                  <div>Marcus Reyes</div>
                </div>
                <div>
                  <div style={{ opacity: 0.5 }}>Expires</div>
                  <div className="mono">08/28</div>
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm" block>
              Update payment method
            </Button>
          </div>
          <div className="card card-pad">
            <SectionHeader title="Statement" sub="Year to date" />
            <div className="stack gap-8">
              <div className="row-between">
                <span className="subtle">Completed washes</span>
                <span className="mono">14</span>
              </div>
              <div className="row-between">
                <span className="subtle">Total spent</span>
                <span className="mono">$432.00</span>
              </div>
              <div className="row-between">
                <span className="subtle">Average ticket</span>
                <span className="mono">$30.86</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  CustomerDashboard,
  CustomerVehicles,
  CustomerBook,
  CustomerBookings,
  CustomerServices,
  CustomerPayments,
});
