// Root app — routing + role state + auth flow.

const USER_BY_ROLE = {
  customer: { name: "Marcus Reyes", initials: "MR" },
  employee: { name: "Diego Marín", initials: "DM" },
  admin: { name: "Casey Nakamura", initials: "CN" },
};

function App() {
  const [view, setView] = React.useState("landing"); // landing | login | register | app
  const [role, setRole] = React.useState("customer");
  const [page, setPage] = React.useState("dashboard");
  const [signupOpen, setSignupOpen] = React.useState(false);
  const [registerRole, setRegisterRole] = React.useState("customer");

  // Employee queue is stateful (advance status workflow)
  const initialQueue = BOOKINGS.filter((b) => b.assignee === "Diego" || b.status === "progress")
    .concat([
      {
        id: "BK-2842",
        customer: "Tanvir Aziz",
        customerInit: "TA",
        vehicle: "Mazda CX-5 · MZD-714",
        service: "Express Wash",
        date: "May 17",
        time: "12:00",
        status: "confirmed",
        bay: "Bay 1",
        assignee: "Diego",
        price: 18,
        pay: "confirmed",
      },
      {
        id: "BK-2843",
        customer: "Erin Stahl",
        customerInit: "ES",
        vehicle: "Hyundai Tucson · HYU-227",
        service: "Premium Detail",
        date: "May 17",
        time: "15:30",
        status: "confirmed",
        bay: "Bay 1",
        assignee: "Diego",
        price: 38,
        pay: "pending",
      },
    ]);
  const [queue, setQueue] = React.useState(initialQueue);

  const enterApp = (r) => {
    setRole(r);
    setPage("dashboard");
    setView("app");
  };

  const handleNav = (id) => {
    setPage(id);
  };

  // ---- public flows ----
  if (view === "landing") {
    return (
      <>
        <Landing
          onLogin={() => setView("login")}
          onSignup={() => setSignupOpen(true)}
          onPick={(r) => {
            setSignupOpen(false);
            if (r === "admin") enterApp("admin");
            else {
              setRegisterRole(r);
              setView("register");
            }
          }}
        />
        <RoleModal
          open={signupOpen}
          onClose={() => setSignupOpen(false)}
          onPick={(r) => {
            setSignupOpen(false);
            if (r === "admin") enterApp("admin");
            else {
              setRegisterRole(r);
              setView("register");
            }
          }}
        />
      </>
    );
  }

  if (view === "login") {
    return (
      <Login
        onSubmit={() => enterApp(role)}
        onRegister={() => setView("register")}
        onHome={() => setView("landing")}
      />
    );
  }

  if (view === "register") {
    return (
      <Register
        initialRole={registerRole}
        onSubmit={(r) => enterApp(r)}
        onLogin={() => setView("login")}
        onHome={() => setView("landing")}
      />
    );
  }

  // ---- authenticated app ----
  return (
    <AppShell
      role={role}
      page={page}
      onNav={handleNav}
      user={USER_BY_ROLE[role]}
      onSignOut={() => setView("landing")}
      onSwitchRole={(r) => {
        setRole(r);
        setPage("dashboard");
      }}
    >
      <Routed role={role} page={page} onNav={handleNav} queue={queue} setQueue={setQueue} />
    </AppShell>
  );
}

const Routed = ({ role, page, onNav, queue, setQueue }) => {
  if (role === "customer") {
    if (page === "dashboard") return <CustomerDashboard onNav={onNav} />;
    if (page === "book") return <CustomerBook onDone={(to) => onNav(to || "dashboard")} />;
    if (page === "bookings") return <CustomerBookings />;
    if (page === "vehicles") return <CustomerVehicles />;
    if (page === "services") return <CustomerServices onBook={() => onNav("book")} />;
    if (page === "payments") return <CustomerPayments />;
  }
  if (role === "admin") {
    if (page === "dashboard") return <AdminDashboard onNav={onNav} />;
    if (page === "bookings") return <AdminBookings />;
    if (page === "services") return <AdminServices />;
    if (page === "payments") return <AdminPayments />;
    if (page === "employees") return <AdminEmployees />;
    if (page === "customers") return <AdminCustomers />;
  }
  if (role === "employee") {
    if (page === "dashboard") return <EmployeeDashboard onNav={onNav} queue={queue} setQueue={setQueue} />;
    if (page === "assigned") return <EmployeeAssigned queue={queue} setQueue={setQueue} />;
    if (page === "queue") return <EmployeeQueue queue={queue} setQueue={setQueue} />;
    if (page === "history") return <EmployeeHistory />;
  }
  // settings / fallback
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1 className="h1">Settings</h1>
        </div>
      </div>
      <div className="empty">
        <IconSettings size={20} />
        <h4>Settings panel</h4>
        <div style={{ fontSize: 13 }}>Workspace preferences, locations, notifications and integrations live here.</div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
